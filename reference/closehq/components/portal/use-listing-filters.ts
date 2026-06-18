'use client';

import { useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export type FilterParams = Record<string, string>;

/**
 * URL-backed listing filters. Current values come from server props (so the
 * results render correctly on the server — no useSearchParams CSR bailout);
 * writes go through the router, which re-renders the server page with the new
 * params.
 */
export function useListingFilters(current: FilterParams) {
  const router = useRouter();
  const pathname = usePathname();

  const get = useCallback((key: string) => current[key] ?? '', [current]);

  const setParams = useCallback(
    (updates: Record<string, string | null>) => {
      const p = new URLSearchParams(current);
      for (const [k, v] of Object.entries(updates)) {
        if (v === null || v === '') p.delete(k);
        else p.set(k, v);
      }
      const qs = p.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [current, router, pathname],
  );

  return { get, setParams };
}
