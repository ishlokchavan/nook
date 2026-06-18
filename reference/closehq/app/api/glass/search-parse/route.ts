import { NextResponse } from 'next/server';

/**
 * Natural-language search → structured filters.
 *
 * Turns "2-bed near the marina under 2M with a pool" into a filter object the
 * experience search can apply. Uses Google Gemini when GEMINI_API_KEY is set
 * (grounded to the real community/type vocabulary passed by the client);
 * otherwise a deterministic regex parser handles it. Either way the response
 * shape is identical, so the client never branches.
 */

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

const TYPES = ['apartment', 'villa', 'townhouse', 'penthouse', 'office', 'retail', 'plot'] as const;
const AMENITY_TOKENS = ['pool', 'beach', 'gym', 'maid', 'furnished', 'view', 'garden', 'balcony', 'parking', 'study'] as const;

export interface ParsedFilters {
  completion: 'ready' | 'off_plan' | null;
  types: string[];
  minBeds: number | null;
  maxBeds: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  community: string | null;
  amenities: string[];
  q: string;
}

interface Body {
  q?: string;
  communities?: string[];
}

/** Fresh object every call — arrays must not be shared across requests. */
function emptyFilters(): ParsedFilters {
  return {
    completion: null,
    types: [],
    minBeds: null,
    maxBeds: null,
    minPrice: null,
    maxPrice: null,
    community: null,
    amenities: [],
    q: '',
  };
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'bad request' }, { status: 400 });
  }

  const query = (body.q ?? '').trim();
  if (!query) return NextResponse.json({ filters: emptyFilters() });

  const communities = (body.communities ?? []).filter(Boolean).slice(0, 60);

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    const viaAI = await parseWithGemini(query, communities, apiKey);
    if (viaAI) return NextResponse.json({ filters: normalise(viaAI, communities) });
  }

  return NextResponse.json({ filters: deterministic(query, communities) });
}

/* ----------------------------- Gemini path ------------------------------ */

async function parseWithGemini(
  query: string,
  communities: string[],
  apiKey: string,
): Promise<Partial<ParsedFilters> | null> {
  const system =
    'You convert a home-buyer\'s natural-language request into a JSON filter. ' +
    'Only use the allowed values. Map nicknames to the closest community from the provided list ' +
    '(e.g. "marina" -> "Dubai Marina", "downtown" -> "Downtown Dubai", "palm" -> "Palm Jumeirah"). ' +
    'Prices are in AED; convert "2m"/"2 million" to 2000000 and "800k" to 800000. ' +
    'For bedrooms, "studio" means 0. "2-bed" sets minBeds and maxBeds to 2; "3+ beds" sets minBeds 3. ' +
    'Put any leftover meaningful keywords (not captured by other fields) into "q". Omit fields you are unsure about.';

  const schema = {
    type: 'object',
    properties: {
      completion: { type: 'string', enum: ['ready', 'off_plan'] },
      types: { type: 'array', items: { type: 'string', enum: [...TYPES] } },
      minBeds: { type: 'integer' },
      maxBeds: { type: 'integer' },
      minPrice: { type: 'number' },
      maxPrice: { type: 'number' },
      community: { type: 'string' },
      amenities: { type: 'array', items: { type: 'string', enum: [...AMENITY_TOKENS] } },
      q: { type: 'string' },
    },
  };

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: system }] },
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text:
                    `Allowed communities: ${communities.join(', ') || '(none provided)'}\n\n` +
                    `Request: "${query}"\n\nReturn the JSON filter.`,
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: schema,
            temperature: 0,
            maxOutputTokens: 300,
          },
        }),
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? '';
    if (!text.trim()) return null;
    return JSON.parse(text) as Partial<ParsedFilters>;
  } catch {
    return null;
  }
}

/** Clamp AI output to the allowed vocabulary and resolve the community. */
function normalise(p: Partial<ParsedFilters>, communities: string[]): ParsedFilters {
  const out: ParsedFilters = emptyFilters();
  if (p.completion === 'ready' || p.completion === 'off_plan') out.completion = p.completion;
  if (Array.isArray(p.types)) out.types = p.types.filter((t) => (TYPES as readonly string[]).includes(t));
  if (typeof p.minBeds === 'number') out.minBeds = clampBeds(p.minBeds);
  if (typeof p.maxBeds === 'number') out.maxBeds = clampBeds(p.maxBeds);
  if (typeof p.minPrice === 'number' && p.minPrice > 0) out.minPrice = p.minPrice;
  if (typeof p.maxPrice === 'number' && p.maxPrice > 0) out.maxPrice = p.maxPrice;
  if (Array.isArray(p.amenities))
    out.amenities = p.amenities.filter((a) => (AMENITY_TOKENS as readonly string[]).includes(a));
  if (typeof p.community === 'string' && p.community) {
    const match = communities.find((c) => c.toLowerCase() === p.community!.toLowerCase()) ??
      communities.find((c) => c.toLowerCase().includes(p.community!.toLowerCase()));
    out.community = match ?? p.community;
  }
  if (typeof p.q === 'string') out.q = p.q.trim();
  return out;
}

function clampBeds(n: number): number {
  return Math.max(0, Math.min(10, Math.round(n)));
}

/* --------------------------- Deterministic path -------------------------- */

function deterministic(query: string, communities: string[]): ParsedFilters {
  const out: ParsedFilters = emptyFilters();
  const q = query.toLowerCase();

  // Completion
  if (/(off[\s-]?plan|new launch|under construction|payment plan)/.test(q)) out.completion = 'off_plan';
  else if (/(ready|move[\s-]?in|completed|secondary)/.test(q)) out.completion = 'ready';

  // Property types
  const typeMap: Record<string, string> = {
    apartment: 'apartment', flat: 'apartment', villa: 'villa', townhouse: 'townhouse',
    penthouse: 'penthouse', office: 'office', retail: 'retail', shop: 'retail', plot: 'plot', land: 'plot',
  };
  for (const [word, type] of Object.entries(typeMap)) {
    if (new RegExp(`\\b${word}s?\\b`).test(q) && !out.types.includes(type)) out.types.push(type);
  }

  // Bedrooms
  if (/\bstudio\b/.test(q)) {
    out.minBeds = 0;
    out.maxBeds = 0;
  } else {
    const range = q.match(/(\d+)\s*(?:to|-|–)\s*(\d+)\s*(?:bed|bedroom|br\b)/);
    const plus = q.match(/(\d+)[\s-]*\+?[\s-]*(?:bed|bedroom|br\b)/);
    if (range) {
      out.minBeds = Number(range[1]);
      out.maxBeds = Number(range[2]);
    } else if (plus) {
      const n = Number(plus[1]);
      out.minBeds = n;
      if (!/\+|plus|at least|minimum|or more/.test(q)) out.maxBeds = n;
    }
  }

  // Prices
  const between = q.match(/between\s+([\d.,]+\s*[mk]?)\s+(?:and|to|-|–)\s+([\d.,]+\s*[mk]?)/);
  if (between) {
    out.minPrice = toAed(between[1]);
    out.maxPrice = toAed(between[2]);
  } else {
    const under = q.match(/(?:under|below|less than|up to|max|max\.|maximum|within)\s+([\d.,]+\s*(?:m|k|million|thousand)?)/);
    const over = q.match(/(?:over|above|more than|from|min|minimum|at least)\s+([\d.,]+\s*(?:m|k|million|thousand)?)/);
    if (under) out.maxPrice = toAed(under[1]);
    if (over) out.minPrice = toAed(over[1]);
    if (!under && !over) {
      const bare = q.match(/([\d.,]+\s*(?:m|k|million|thousand|aed)\b)/);
      if (bare && /budget|price|around|aed/.test(q)) out.maxPrice = toAed(bare[1]);
    }
  }

  // Community (match longest community name appearing in the query)
  let best = '';
  for (const c of communities) {
    const cl = c.toLowerCase();
    if (q.includes(cl) && cl.length > best.length) best = c;
  }
  const NICK: Record<string, string> = {
    marina: 'Dubai Marina', downtown: 'Downtown Dubai', palm: 'Palm Jumeirah',
    jbr: 'JBR', jvc: 'JVC', creek: 'Dubai Creek Harbour', hills: 'Dubai Hills Estate',
    'business bay': 'Business Bay',
  };
  if (!best) {
    for (const [nick, canonical] of Object.entries(NICK)) {
      if (q.includes(nick)) {
        const match = communities.find((c) => c.toLowerCase() === canonical.toLowerCase());
        best = match ?? canonical;
        break;
      }
    }
  }
  if (best) out.community = best;

  // Amenities
  for (const tok of AMENITY_TOKENS) {
    const synonyms: Record<string, RegExp> = {
      pool: /pool|swimming/, beach: /beach|waterfront|sea|water/, gym: /gym|fitness/,
      maid: /maid|servant/, furnished: /furnished/, view: /view|skyline/,
      garden: /garden|landscap/, balcony: /balcony|terrace/, parking: /parking|garage/, study: /study|home office/,
    };
    if ((synonyms[tok] ?? new RegExp(tok)).test(q)) out.amenities.push(tok);
  }

  return out;
}

/** "2m" -> 2_000_000, "800k" -> 800_000, "1.5 million" -> 1_500_000. */
function toAed(raw: string): number {
  const s = raw.toLowerCase().replace(/,/g, '').trim();
  const num = parseFloat(s.replace(/[^\d.]/g, ''));
  if (!isFinite(num)) return 0;
  if (/m|million/.test(s)) return Math.round(num * 1_000_000);
  if (/k|thousand/.test(s)) return Math.round(num * 1_000);
  // Bare number: assume millions if small (<1000), else literal AED.
  if (num < 1000) return Math.round(num * 1_000_000);
  return Math.round(num);
}
