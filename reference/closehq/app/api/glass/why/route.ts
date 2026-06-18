import { NextResponse } from 'next/server';

/**
 * "Why this matches you" — generates a one-line, grounded explanation of why a
 * listing fits the user's behaviour. Uses Google Gemini (free tier) when
 * GEMINI_API_KEY is set; otherwise the client keeps its instant deterministic
 * reason. The recommender still does the ranking — this only *explains* it
 * (and never invents facts).
 */

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

interface Body {
  liked?: string[];
  listing?: {
    title?: string;
    community?: string;
    city?: string;
    type?: string;
    beds?: number | null;
    price?: string;
    hook?: string;
    credits?: string;
  };
}

const SYSTEM =
  'You write one short, warm sentence (max 22 words) telling a home buyer why a property fits them, in second person ("you"). ' +
  'Ground every claim ONLY in the facts provided — never invent amenities, prices, or features. ' +
  'If the person is new with no preferences, highlight one concrete appealing fact about the home instead. ' +
  'No preamble, no quotes, no emoji — just the sentence.';

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Not configured — tell the client to keep its deterministic line.
    return NextResponse.json({ reason: null }, { status: 200 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'bad request' }, { status: 400 });
  }

  const listing = body.listing ?? {};
  const liked = (body.liked ?? []).filter(Boolean).slice(0, 6);

  const facts = [
    listing.title && `Title: ${listing.title}`,
    listing.community && `Community: ${listing.community}${listing.city ? `, ${listing.city}` : ''}`,
    listing.type && `Type: ${listing.type}`,
    listing.beds != null && `Bedrooms: ${listing.beds === 0 ? 'studio' : listing.beds}`,
    listing.price && `Price: ${listing.price}`,
    listing.hook && `Tag: ${listing.hook}`,
    listing.credits && `iClose credits earned: ${listing.credits}`,
  ]
    .filter(Boolean)
    .join('\n');

  const taste = liked.length
    ? `So far this person keeps engaging with: ${liked.join(', ')}.`
    : `This person is new — no strong preferences yet.`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM }] },
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `${taste}\n\nProperty facts:\n${facts}\n\nWrite the one-sentence reason.`,
                },
              ],
            },
          ],
          generationConfig: { maxOutputTokens: 120, temperature: 0.7 },
        }),
        // Keep the UI snappy; fall back to deterministic if Gemini is slow.
        signal: AbortSignal.timeout(8000),
      },
    );

    if (!res.ok) return NextResponse.json({ reason: null }, { status: 200 });

    const data = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const reason =
      data.candidates?.[0]?.content?.parts
        ?.map((p) => p.text ?? '')
        .join(' ')
        .trim() ?? '';

    return NextResponse.json({ reason: reason || null });
  } catch {
    // Any API/network/timeout failure → client falls back to deterministic line.
    return NextResponse.json({ reason: null }, { status: 200 });
  }
}
