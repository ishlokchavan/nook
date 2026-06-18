'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type Decision = 'saved' | 'passed';

interface SavedState {
  /** reference -> decision */
  decisions: Record<string, Decision>;
  savedRefs: string[];
  isSaved: (reference: string) => boolean;
  isDecided: (reference: string) => boolean;
  save: (reference: string) => void;
  pass: (reference: string) => void;
  toggleSave: (reference: string) => void;
  reset: () => void;
}

const STORAGE_KEY = 'closehq.glass.decisions.v1';

const SavedContext = createContext<SavedState | null>(null);

export function SavedStoreProvider({ children }: { children: React.ReactNode }) {
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount (client only).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDecisions(JSON.parse(raw));
    } catch {
      /* ignore malformed storage */
    }
    setHydrated(true);
  }, []);

  // Persist on change (after hydration so we don't clobber stored state).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(decisions));
    } catch {
      /* storage may be unavailable (private mode) */
    }
  }, [decisions, hydrated]);

  const setDecision = useCallback((reference: string, decision: Decision) => {
    setDecisions((prev) => ({ ...prev, [reference]: decision }));
  }, []);

  const value = useMemo<SavedState>(() => {
    const savedRefs = Object.entries(decisions)
      .filter(([, d]) => d === 'saved')
      .map(([ref]) => ref);

    return {
      decisions,
      savedRefs,
      isSaved: (ref) => decisions[ref] === 'saved',
      isDecided: (ref) => ref in decisions,
      save: (ref) => setDecision(ref, 'saved'),
      pass: (ref) => setDecision(ref, 'passed'),
      toggleSave: (ref) =>
        setDecisions((prev) => {
          const next = { ...prev };
          if (next[ref] === 'saved') delete next[ref];
          else next[ref] = 'saved';
          return next;
        }),
      reset: () => setDecisions({}),
    };
  }, [decisions, setDecision]);

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export function useSaved(): SavedState {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error('useSaved must be used within <SavedStoreProvider>');
  return ctx;
}
