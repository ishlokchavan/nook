'use client';

import { createContext, useContext, useMemo } from 'react';
import type { ExperienceListing } from '@/lib/glass/experience-data';

interface ExperienceValue {
  listings: ExperienceListing[];
  launches: ExperienceListing[];
  byRef: (reference: string) => ExperienceListing | undefined;
}

const ExperienceContext = createContext<ExperienceValue | null>(null);

export function ExperienceProvider({
  listings,
  children,
}: {
  listings: ExperienceListing[];
  children: React.ReactNode;
}) {
  const value = useMemo<ExperienceValue>(
    () => ({
      listings,
      launches: listings.filter((l) => l.completion === 'off_plan'),
      byRef: (reference) => listings.find((l) => l.reference === reference),
    }),
    [listings],
  );

  return (
    <ExperienceContext.Provider value={value}>
      {children}
    </ExperienceContext.Provider>
  );
}

export function useExperience(): ExperienceValue {
  const ctx = useContext(ExperienceContext);
  if (!ctx) throw new Error('useExperience must be used within <ExperienceProvider>');
  return ctx;
}
