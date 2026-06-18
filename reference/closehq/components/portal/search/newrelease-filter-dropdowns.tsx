'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { FilterDropdown } from './filter-dropdown';
import { useListingFilters, type FilterParams } from '@/components/portal/use-listing-filters';
import type { FilterOptions } from '@/lib/portal/filters';

/** Functional filter dropdowns for the New Releases bar (URL + DB-backed options). */
export function NewReleaseFilterDropdowns({ params, options }: { params: FilterParams; options: FilterOptions }) {
  const { get, setParams } = useListingFilters(params);

  const type = get('type');
  const handover = get('handover');
  const plan = get('paymentPlan');
  const minPrice = get('minPrice');
  const maxPrice = get('maxPrice');

  const typeLabel = options.propertyTypes.find((t) => t.value === type)?.label;
  const priceLabel = minPrice || maxPrice ? `${minPrice || '0'}–${maxPrice || '∞'}` : null;

  function ListPanel(items: { value: string; label: string }[], current: string, key: string) {
    return (close: () => void) => (
      <div className="grid grid-cols-1 gap-0.5">
        {items.map((it) => (
          <button
            key={it.value || 'all'}
            type="button"
            onClick={() => { setParams({ [key]: it.value || null }); close(); }}
            className={cn(
              'text-start px-3 py-2.5 rounded-lg text-[14px] hover:bg-mist transition-colors',
              current === it.value ? 'text-accent font-medium' : 'text-ink',
            )}
          >
            {it.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <>
      <FilterDropdown label={type && typeLabel ? typeLabel : 'Type'} active={!!type} width="sm:w-56">
        {ListPanel(options.propertyTypes, type, 'type')}
      </FilterDropdown>

      <FilterDropdown label={handover ? `Handover ${handover}` : 'Handover By'} active={!!handover} width="sm:w-56">
        {ListPanel([{ value: '', label: 'Any time' }, ...options.handoverYears.map((y) => ({ value: y, label: y }))], handover, 'handover')}
      </FilterDropdown>

      <FilterDropdown label={plan ? `Plan ${plan}` : 'Payment Plan'} active={!!plan} width="sm:w-56">
        {ListPanel([{ value: '', label: 'Any plan' }, ...options.paymentPlans.map((p) => ({ value: p, label: p }))], plan, 'paymentPlan')}
      </FilterDropdown>

      <FilterDropdown label={priceLabel ?? 'Price'} active={!!(minPrice || maxPrice)}>
        {(close) => <PriceBody minPrice={minPrice} maxPrice={maxPrice} setParams={setParams} close={close} />}
      </FilterDropdown>
    </>
  );
}

function PriceBody({ minPrice, maxPrice, setParams, close }: {
  minPrice: string; maxPrice: string; setParams: (u: Record<string, string | null>) => void; close: () => void;
}) {
  const [lo, setLo] = useState(minPrice);
  const [hi, setHi] = useState(maxPrice);
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input inputMode="numeric" value={lo} onChange={(e) => setLo(e.target.value.replace(/\D/g, ''))} placeholder="Min AED"
          className="w-full h-10 px-3 rounded-xl border border-hairline text-[14px] focus:outline-none focus:ring-2 focus:ring-accent/40" />
        <span className="text-graphite">–</span>
        <input inputMode="numeric" value={hi} onChange={(e) => setHi(e.target.value.replace(/\D/g, ''))} placeholder="Max AED"
          className="w-full h-10 px-3 rounded-xl border border-hairline text-[14px] focus:outline-none focus:ring-2 focus:ring-accent/40" />
      </div>
      <div className="flex justify-between">
        <button type="button" onClick={() => { setParams({ minPrice: null, maxPrice: null }); close(); }} className="text-[13px] text-graphite hover:text-ink">Clear</button>
        <button type="button" onClick={() => { setParams({ minPrice: lo || null, maxPrice: hi || null }); close(); }} className="h-9 px-4 rounded-full bg-accent text-white text-[13px] font-medium hover:bg-accent-hover">Apply</button>
      </div>
    </div>
  );
}
