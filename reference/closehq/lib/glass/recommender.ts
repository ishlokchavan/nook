import type { ExperienceListing } from './experience-data';

/**
 * Deterministic behavioural recommender (V1 — no AI).
 *
 * Every interaction adjusts per-facet affinity scores. A listing's score is the
 * sum of the user's affinity for its facets (community, developer, type, bed
 * band, price band, completion). Positive signals raise exposure of similar
 * homes; negative signals (quick skips, explicit "not interested") suppress them
 * — the rejection engine. Weights are configurable here.
 */

export const SIGNAL_WEIGHTS = {
  view: 4,
  dwell: 20, // sustained attention on a single card
  details: 20,
  save: 50,
  share: 40,
  like: 50,
  // High-intent actions (master-prompt weights) — strongest positive signals.
  viewing: 80, // booked a viewing
  whatsapp: 70,
  call: 70,
  offer: 100,
  skip: -15, // scrolled past quickly
  dislike: -60, // explicit "not interested"
} as const;

export type SignalType = keyof typeof SIGNAL_WEIGHTS;

export type Affinity = Record<string, number>;

function priceBand(p: number): string {
  if (p < 1_000_000) return '<1M';
  if (p < 2_000_000) return '1-2M';
  if (p < 5_000_000) return '2-5M';
  if (p < 10_000_000) return '5-10M';
  return '10M+';
}

function bedBand(b: number | null): string {
  if (b == null) return 'na';
  if (b === 0) return 'studio';
  if (b >= 4) return '4plus';
  return String(b);
}

/** Stable facet keys describing a listing. */
export function facetsOf(l: ExperienceListing): string[] {
  return [
    `community:${l.community ?? 'na'}`,
    `city:${l.city}`,
    `developer:${l.developerName ?? l.agencyName ?? 'na'}`,
    `type:${l.propertyType}`,
    `beds:${bedBand(l.bedrooms)}`,
    `price:${priceBand(l.priceAed)}`,
    `completion:${l.completion}`,
  ];
}

/** Apply a weighted signal for a listing onto the affinity map. */
export function applySignal(
  affinity: Affinity,
  listing: ExperienceListing,
  weight: number,
): Affinity {
  const next = { ...affinity };
  for (const facet of facetsOf(listing)) {
    next[facet] = (next[facet] ?? 0) + weight;
  }
  return next;
}

/** Sum of affinity across a listing's facets. */
export function scoreListing(affinity: Affinity, listing: ExperienceListing): number {
  let score = 0;
  for (const facet of facetsOf(listing)) score += affinity[facet] ?? 0;
  return score;
}

/**
 * Rank the *upcoming* (not-yet-seen, not-dismissed) listings by score, with a
 * little novelty jitter so the feed never collapses to one community. Seen
 * listings are appended at the end so the deck still has somewhere to go.
 */
export function rankUpcoming(
  listings: ExperienceListing[],
  affinity: Affinity,
  seen: Set<string>,
  dismissed: Set<string>,
): ExperienceListing[] {
  const pool = listings.filter((l) => !dismissed.has(l.reference));
  const unseen = pool.filter((l) => !seen.has(l.reference));
  const seenList = pool.filter((l) => seen.has(l.reference));

  const ranked = unseen
    .map((l) => ({
      l,
      score: scoreListing(affinity, l) + Math.random() * 6, // novelty jitter
    }))
    .sort((a, b) => b.score - a.score)
    .map((x) => x.l);

  return [...ranked, ...seenList];
}
