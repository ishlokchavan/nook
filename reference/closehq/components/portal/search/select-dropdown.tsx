'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { FilterDropdown } from './filter-dropdown';
import { useListingFilters, type FilterParams } from '@/components/portal/use-listing-filters';
import type { Option } from '@/lib/portal/filters';

/** Generic single-select dropdown backed by a URL param. */
export function SelectDropdown({
  label, paramKey, options, params, width = 'sm:w-56',
}: {
  label: string; paramKey: string; options: Option[]; params: FilterParams; width?: string;
}) {
  const { get, setParams } = useListingFilters(params);
  const cur = get(paramKey);
  const selected = options.find((o) => o.value === cur && o.value !== '');

  return (
    <FilterDropdown label={selected ? selected.label : label} active={!!cur} width={width}>
      {(close) => (
        <div className="grid grid-cols-1 gap-0.5">
          {options.map((o) => (
            <button
              key={o.value || 'all'}
              type="button"
              onClick={() => { setParams({ [paramKey]: o.value || null }); close(); }}
              className={cn(
                'text-start px-3 py-2.5 rounded-lg text-[14px] hover:bg-mist transition-colors',
                cur === o.value ? 'text-accent font-medium' : 'text-ink',
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </FilterDropdown>
  );
}

/** Generic min/max range dropdown backed by two URL params. */
export function RangeDropdown({
  label, unit, minKey, maxKey, params,
}: {
  label: string; unit: string; minKey: string; maxKey: string; params: FilterParams;
}) {
  const { get, setParams } = useListingFilters(params);
  const minVal = get(minKey);
  const maxVal = get(maxKey);
  const rangeLabel = minVal || maxVal ? `${minVal || '0'}–${maxVal || '∞'}` : label;

  return (
    <FilterDropdown label={rangeLabel} active={!!(minVal || maxVal)}>
      {(close) => <RangeBody unit={unit} minKey={minKey} maxKey={maxKey} minVal={minVal} maxVal={maxVal} setParams={setParams} close={close} />}
    </FilterDropdown>
  );
}

function RangeBody({ unit, minKey, maxKey, minVal, maxVal, setParams, close }: {
  unit: string; minKey: string; maxKey: string; minVal: string; maxVal: string;
  setParams: (u: Record<string, string | null>) => void; close: () => void;
}) {
  const [lo, setLo] = useState(minVal);
  const [hi, setHi] = useState(maxVal);
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input inputMode="numeric" value={lo} onChange={(e) => setLo(e.target.value.replace(/\D/g, ''))} placeholder={`Min ${unit}`}
          className="w-full h-10 px-3 rounded-xl border border-hairline text-[14px] focus:outline-none focus:ring-2 focus:ring-accent/40" />
        <span className="text-graphite">–</span>
        <input inputMode="numeric" value={hi} onChange={(e) => setHi(e.target.value.replace(/\D/g, ''))} placeholder={`Max ${unit}`}
          className="w-full h-10 px-3 rounded-xl border border-hairline text-[14px] focus:outline-none focus:ring-2 focus:ring-accent/40" />
      </div>
      <div className="flex justify-between">
        <button type="button" onClick={() => { setParams({ [minKey]: null, [maxKey]: null }); close(); }} className="text-[13px] text-graphite hover:text-ink">Clear</button>
        <button type="button" onClick={() => { setParams({ [minKey]: lo || null, [maxKey]: hi || null }); close(); }} className="h-9 px-4 rounded-full bg-accent text-white text-[13px] font-medium hover:bg-accent-hover">Apply</button>
      </div>
    </div>
  );
}
