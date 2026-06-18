'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ExperienceListing } from '@/lib/glass/experience-data';
import {
  SIGNAL_WEIGHTS,
  applySignal,
  rankUpcoming,
  scoreListing,
  type Affinity,
  type SignalType,
} from '@/lib/glass/recommender';
import { trackEvent, persistAffinity } from '@/lib/glass/track-event';

interface SignalState {
  seen: Set<string>;
  dismissed: Set<string>;
  /** Record a signal for a listing (updates affinity + logs the event). */
  track: (type: SignalType, listing: ExperienceListing, dwellMs?: number) => void;
  score: (listing: ExperienceListing) => number;
  rank: (listings: ExperienceListing[]) => ExperienceListing[];
  /** Cold-start: merge facet weights straight into affinity (taste picker). */
  seed: (facets: Affinity) => void;
  /** Read the current affinity without subscribing to it (avoids re-renders). */
  getAffinity: () => Affinity;
  /** Increments whenever affinity is seeded, so the feed can re-rank once. */
  seedVersion: number;
  reset: () => void;
}

const STORAGE_KEY = 'closehq.glass.affinity.v1';

const SignalContext = createContext<SignalState | null>(null);

export function SignalStoreProvider({ children }: { children: React.ReactNode }) {
  // Affinity lives in a ref (read by score/rank/getAffinity) plus a state mirror
  // used only to drive the debounced server persist. Keeping it out of the
  // context value means recording signals never re-renders consumers — only an
  // explicit seedVersion bump does.
  const affinityRef = useRef<Affinity>({});
  const [affinitySnapshot, setAffinitySnapshot] = useState<Affinity>({});
  const seenRef = useRef<Set<string>>(new Set());
  const dismissedRef = useRef<Set<string>>(new Set());
  const [seedVersion, setSeedVersion] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          affinity?: Affinity;
          seen?: string[];
          dismissed?: string[];
        };
        if (parsed.affinity) {
          affinityRef.current = parsed.affinity;
          setAffinitySnapshot(parsed.affinity);
        }
        if (parsed.seen) seenRef.current = new Set(parsed.seen);
        if (parsed.dismissed) dismissedRef.current = new Set(parsed.dismissed);
      }
    } catch {
      /* ignore malformed storage */
    }
    setHydrated(true);
  }, []);

  // Debounced server-side snapshot of affinity (additive table; for future ML).
  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!hydrated) return;
    if (persistTimer.current) clearTimeout(persistTimer.current);
    persistTimer.current = setTimeout(() => persistAffinity(affinitySnapshot), 1500);
    return () => {
      if (persistTimer.current) clearTimeout(persistTimer.current);
    };
  }, [affinitySnapshot, hydrated]);

  const persistLocal = useCallback((nextAffinity: Affinity) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          affinity: nextAffinity,
          seen: [...seenRef.current],
          dismissed: [...dismissedRef.current],
        }),
      );
    } catch {
      /* storage may be unavailable */
    }
  }, []);

  const track = useCallback<SignalState['track']>(
    (type, listing, dwellMs) => {
      const weight =
        type === 'dwell' && dwellMs
          ? Math.min(SIGNAL_WEIGHTS.dwell, Math.round(dwellMs / 1000) * 4)
          : SIGNAL_WEIGHTS[type];

      seenRef.current.add(listing.reference);
      if (type === 'dislike') dismissedRef.current.add(listing.reference);

      const next = applySignal(affinityRef.current, listing, weight);
      affinityRef.current = next;
      persistLocal(next);
      setAffinitySnapshot(next); // drives the debounced server persist only
      trackEvent(type, listing.reference, weight, dwellMs);
    },
    [persistLocal],
  );

  const seed = useCallback<SignalState['seed']>(
    (facets) => {
      const next = { ...affinityRef.current };
      for (const [k, v] of Object.entries(facets)) next[k] = (next[k] ?? 0) + v;
      affinityRef.current = next;
      persistLocal(next);
      setAffinitySnapshot(next);
      setSeedVersion((n) => n + 1);
    },
    [persistLocal],
  );

  const score = useCallback(
    (listing: ExperienceListing) => scoreListing(affinityRef.current, listing),
    [],
  );

  const rank = useCallback(
    (listings: ExperienceListing[]) =>
      rankUpcoming(listings, affinityRef.current, seenRef.current, dismissedRef.current),
    [],
  );

  const getAffinity = useCallback(() => affinityRef.current, []);

  const reset = useCallback(() => {
    seenRef.current = new Set();
    dismissedRef.current = new Set();
    affinityRef.current = {};
    setAffinitySnapshot({});
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('closehq.glass.onboarded.v1');
      localStorage.removeItem('closehq.glass.intro.v1');
    } catch {
      /* ignore */
    }
    setSeedVersion((n) => n + 1);
  }, []);

  // Stable context value — only changes when seedVersion changes, so recording
  // signals (the hot path) never re-renders the feed cards.
  const value = useMemo<SignalState>(
    () => ({
      seen: seenRef.current,
      dismissed: dismissedRef.current,
      track,
      score,
      rank,
      seed,
      getAffinity,
      seedVersion,
      reset,
    }),
    [track, score, rank, seed, getAffinity, seedVersion, reset],
  );

  return <SignalContext.Provider value={value}>{children}</SignalContext.Provider>;
}

export function useSignals(): SignalState {
  const ctx = useContext(SignalContext);
  if (!ctx) throw new Error('useSignals must be used within <SignalStoreProvider>');
  return ctx;
}
