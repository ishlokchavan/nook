'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, MapPin, ChevronDown, Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SEARCH_TABS, type SearchTabKey } from '@/lib/portal-config';
import { useI18n } from '@/components/i18n/locale-provider';
import { FilterDropdown } from './filter-dropdown';
import type { FilterOptions } from '@/lib/portal/filters';
import type { Messages } from '@/lib/i18n/dictionaries';

type SubKey = keyof Messages['search']['sub'];

interface VerticalConfig {
  subTabs?: { key: SubKey; param: string }[];
  filters?: string[];
  withLocationIcon?: boolean;
}

const CONFIG: Record<SearchTabKey, VerticalConfig> = {
  properties: { subTabs: [{ key: 'all', param: 'all' }, { key: 'offplan', param: 'off-plan' }, { key: 'ready', param: 'ready' }] },
  'new-releases': { withLocationIcon: true },
  transactions: {},
  agents: {},
};

const RES_TYPES = ['apartment', 'villa', 'townhouse', 'penthouse', 'plot'];
const COM_TYPES = ['office', 'retail'];

interface LocalFilters {
  category: 'residential' | 'commercial';
  type?: string; beds?: string; baths?: string;
  minPrice?: string; maxPrice?: string; minSize?: string; maxSize?: string;
  amenities: string[];
  handover?: string; paymentPlan?: string;
}
const EMPTY: LocalFilters = { category: 'residential', amenities: [] };

export function SearchPanel({ initial = 'properties', options }: { initial?: SearchTabKey; options: FilterOptions }) {
  const router = useRouter();
  const { messages } = useI18n();
  const m = messages.search;
  const [active, setActive] = useState<SearchTabKey>(initial);
  const [subTab, setSubTab] = useState(0);
  const [query, setQuery] = useState('');
  const [f, setF] = useState<LocalFilters>(EMPTY);
  const set = (patch: Partial<LocalFilters>) => setF((p) => ({ ...p, ...patch }));

  const config = CONFIG[active];
  const typeLabel = options.propertyTypes.find((t) => t.value === f.type)?.label;
  const year = new Date().getFullYear();
  const DELIVERY = [{ value: '', label: 'All dates' }, { value: String(year), label: String(year) }, { value: 'later', label: 'Later' }];

  function onSelectTab(key: SearchTabKey) {
    setActive(key);
    setSubTab(0);
    setF(EMPTY);
  }

  function onSearch() {
    const tab = SEARCH_TABS.find((t) => t.key === active)!;
    const p = new URLSearchParams();
    if (query.trim()) p.set('q', query.trim());
    const sub = config.subTabs?.[subTab];

    if (active === 'properties') {
      if (sub && sub.param !== 'all') p.set('completion', sub.param === 'off-plan' ? 'off_plan' : 'ready');
      if (f.category === 'commercial') p.set('category', 'commercial');
      if (f.type) p.set('type', f.type);
      if (f.beds) p.set('beds', f.beds);
      if (f.baths) p.set('baths', f.baths);
      if (f.minPrice) p.set('minPrice', f.minPrice);
      if (f.maxPrice) p.set('maxPrice', f.maxPrice);
      if (f.minSize) p.set('minSize', f.minSize);
      if (f.maxSize) p.set('maxSize', f.maxSize);
      if (f.amenities.length) p.set('amenities', f.amenities.join(','));
    } else if (active === 'new-releases') {
      if (f.type) p.set('type', f.type);
      if (f.handover) p.set('handover', f.handover);
      if (f.paymentPlan) p.set('paymentPlan', f.paymentPlan);
      if (f.minPrice) p.set('minPrice', f.minPrice);
      if (f.maxPrice) p.set('maxPrice', f.maxPrice);
    } else if (active === 'transactions' && sub) {
      p.set('tab', sub.param);
    }
    const qs = p.toString();
    router.push(qs ? `${tab.href}?${qs}` : tab.href);
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Vertical tabs */}
      <div className="flex items-center justify-center mb-4">
        <div className="inline-flex items-center gap-1 p-1 rounded-full bg-paper shadow-card overflow-x-auto max-w-full">
          {SEARCH_TABS.map((tab) => (
            <button key={tab.key} type="button" onClick={() => onSelectTab(tab.key)}
              className={cn('px-4 py-1.5 text-[14px] rounded-full whitespace-nowrap transition-colors',
                tab.key === active ? 'bg-accent/10 text-accent font-medium' : 'text-ink/70 hover:text-ink')}>
              {m.tabs[tab.key === 'new-releases' ? 'newReleases' : tab.key]}
            </button>
          ))}
        </div>
      </div>

      {/* Search card */}
      <div className="card-surface shadow-card p-4 sm:p-5 text-start">
        {config.subTabs && (
          <div className="flex items-center gap-6 border-b border-hairline/60 mb-4">
            {config.subTabs.map((sub, i) => (
              <button key={sub.key} type="button" onClick={() => setSubTab(i)}
                className={cn('pb-2.5 -mb-px text-[14px] border-b-2 transition-colors',
                  i === subTab ? 'border-accent text-ink font-medium' : 'border-transparent text-graphite hover:text-ink')}>
                {m.sub[sub.key]}
              </button>
            ))}
          </div>
        )}

        {/* Search field + button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            {config.withLocationIcon
              ? <MapPin className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-graphite" />
              : <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-graphite" />}
            <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && onSearch()}
              placeholder={m.ph[active === 'new-releases' ? 'newReleases' : active]}
              className="w-full h-11 ps-10 pe-3 rounded-full border border-hairline text-[15px] text-ink placeholder:text-graphite focus:outline-none focus:ring-2 focus:ring-accent/40" />
          </div>
          <button type="button" onClick={onSearch}
            className="h-11 px-6 rounded-full text-[15px] font-medium text-white bg-accent hover:bg-accent-hover active:bg-accent-dark transition-colors">
            {m.search}
          </button>
        </div>

        {/* Functional filter pills */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {active === 'properties' && (
            <>
              <TypeDropdown options={options} category={f.category} type={f.type} onPick={(type, category) => set({ type, category })} typeLabel={typeLabel} />
              <BedsBaths options={options} beds={f.beds} baths={f.baths} onSet={set} />
              <RangePill label="Price" unit="AED" min={f.minPrice} max={f.maxPrice} onApply={(min, max) => set({ minPrice: min, maxPrice: max })} />
              <Amenities options={options} selected={f.amenities} onToggle={(a) => set({ amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a] })} />
              <RangePill label="Area (sqft)" unit="sqft" min={f.minSize} max={f.maxSize} onApply={(min, max) => set({ minSize: min, maxSize: max })} />
              <CategoryPill category={f.category} onSet={(c) => set({ category: c, type: undefined })} />
            </>
          )}
          {active === 'new-releases' && (
            <>
              <TypeDropdown options={options} category="residential" type={f.type} onPick={(type) => set({ type })} typeLabel={typeLabel} />
              <SimpleSelect label="Delivery date" value={f.handover} items={DELIVERY} onPick={(v) => set({ handover: v })} />
              <SimpleSelect label="Payment Plan" value={f.paymentPlan} items={[{ value: '', label: 'Any plan' }, ...options.paymentPlans.map((p) => ({ value: p, label: p }))]} onPick={(v) => set({ paymentPlan: v })} />
              <RangePill label="Price" unit="AED" min={f.minPrice} max={f.maxPrice} onApply={(min, max) => set({ minPrice: min, maxPrice: max })} />
            </>
          )}
          {config.filters?.map((label) => (
            <button key={label} type="button" className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full border border-hairline text-[13px] text-ink/80 hover:border-ink/40">
              {label} <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </button>
          ))}
        </div>

        {active === 'new-releases' && (
          <Link href="/new-releases" className="mt-3 -mx-1 flex items-center justify-between gap-3 rounded-xl bg-journey-offplan/15 px-4 py-2.5 hover:bg-journey-offplan/25 transition-colors">
            <span className="flex items-center gap-2 text-[13px] sm:text-[14px] text-ink">
              <Sparkles className="h-4 w-4 shrink-0" /> Want to find out more about UAE real estate using AI?
            </span>
            <span className="inline-flex items-center gap-1 text-[13px] sm:text-[14px] text-accent font-medium whitespace-nowrap">
              Try iExpert <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick}
      className={cn('h-9 min-w-[44px] px-3 rounded-full border text-[13px] transition-colors',
        active ? 'border-accent text-accent bg-accent/5 font-medium' : 'border-hairline text-ink/80 hover:border-ink/40')}>
      {children}
    </button>
  );
}

function TypeDropdown({ options, category, type, onPick, typeLabel }: {
  options: FilterOptions; category: 'residential' | 'commercial'; type?: string;
  onPick: (type: string | undefined, category: 'residential' | 'commercial') => void; typeLabel?: string;
}) {
  const types = category === 'commercial' ? COM_TYPES : RES_TYPES;
  return (
    <FilterDropdown label={type && typeLabel ? typeLabel : 'Property type'} active={!!type} width="sm:w-72">
      {(close) => (
        <div className="grid grid-cols-2 gap-2">
          {types.map((val) => {
            const label = options.propertyTypes.find((o) => o.value === val)?.label ?? val;
            return <Chip key={val} active={type === val} onClick={() => { onPick(type === val ? undefined : val, category); close(); }}>{label}</Chip>;
          })}
        </div>
      )}
    </FilterDropdown>
  );
}

function BedsBaths({ options, beds, baths, onSet }: { options: FilterOptions; beds?: string; baths?: string; onSet: (p: { beds?: string; baths?: string }) => void }) {
  const label = beds || baths ? `${beds ? `${beds} bed` : ''}${beds && baths ? ' · ' : ''}${baths ? `${baths} bath` : ''}` : 'Beds & Baths';
  return (
    <FilterDropdown label={label} active={!!(beds || baths)} width="sm:w-72">
      {() => (
        <div className="space-y-4">
          <div><p className="text-[12px] text-graphite mb-2">Bedrooms</p><div className="flex flex-wrap gap-2">
            <Chip active={!beds} onClick={() => onSet({ beds: undefined })}>Any</Chip>
            {options.beds.map((b) => <Chip key={b} active={beds === b} onClick={() => onSet({ beds: b })}>{b}</Chip>)}
          </div></div>
          <div><p className="text-[12px] text-graphite mb-2">Bathrooms</p><div className="flex flex-wrap gap-2">
            <Chip active={!baths} onClick={() => onSet({ baths: undefined })}>Any</Chip>
            {options.baths.map((b) => <Chip key={b} active={baths === b} onClick={() => onSet({ baths: b })}>{b}</Chip>)}
          </div></div>
        </div>
      )}
    </FilterDropdown>
  );
}

function RangePill({ label, unit, min, max, onApply }: { label: string; unit: string; min?: string; max?: string; onApply: (min?: string, max?: string) => void }) {
  const rangeLabel = min || max ? `${min || '0'}–${max || '∞'}` : label;
  return (
    <FilterDropdown label={rangeLabel} active={!!(min || max)}>
      {(close) => <RangeBody unit={unit} min={min} max={max} onApply={onApply} close={close} />}
    </FilterDropdown>
  );
}

function RangeBody({ unit, min, max, onApply, close }: { unit: string; min?: string; max?: string; onApply: (min?: string, max?: string) => void; close: () => void }) {
  const [lo, setLo] = useState(min ?? '');
  const [hi, setHi] = useState(max ?? '');
  const cls = 'w-full h-10 px-3 rounded-xl border border-hairline text-[14px] focus:outline-none focus:ring-2 focus:ring-accent/40';
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input inputMode="numeric" value={lo} onChange={(e) => setLo(e.target.value.replace(/\D/g, ''))} placeholder={`Min ${unit}`} className={cls} />
        <span className="text-graphite">–</span>
        <input inputMode="numeric" value={hi} onChange={(e) => setHi(e.target.value.replace(/\D/g, ''))} placeholder={`Max ${unit}`} className={cls} />
      </div>
      <div className="flex justify-between">
        <button type="button" onClick={() => { setLo(''); setHi(''); onApply(undefined, undefined); close(); }} className="text-[13px] text-graphite hover:text-ink">Clear</button>
        <button type="button" onClick={() => { onApply(lo || undefined, hi || undefined); close(); }} className="h-9 px-4 rounded-full bg-accent text-white text-[13px] font-medium hover:bg-accent-hover">Apply</button>
      </div>
    </div>
  );
}

function Amenities({ options, selected, onToggle }: { options: FilterOptions; selected: string[]; onToggle: (a: string) => void }) {
  const label = selected.length ? `Amenities (${selected.length})` : 'Amenities';
  return (
    <FilterDropdown label={label} active={selected.length > 0} width="sm:w-80">
      {() => (
        <div className="max-h-72 overflow-auto space-y-0.5">
          {options.amenities.map((a) => {
            const on = selected.includes(a);
            return (
              <label key={a} className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-[14px] text-ink hover:bg-mist cursor-pointer">
                <input type="checkbox" className="h-4 w-4 accent-[#0071e3]" checked={on} onChange={() => onToggle(a)} />
                {a}
              </label>
            );
          })}
        </div>
      )}
    </FilterDropdown>
  );
}

function SimpleSelect({ label, value, items, onPick }: { label: string; value?: string; items: { value: string; label: string }[]; onPick: (v: string | undefined) => void }) {
  const sel = items.find((i) => i.value === value && i.value !== '');
  return (
    <FilterDropdown label={sel ? sel.label : label} active={!!value} width="sm:w-56">
      {(close) => (
        <div className="grid grid-cols-1 gap-0.5">
          {items.map((it) => (
            <button key={it.value || 'all'} type="button" onClick={() => { onPick(it.value || undefined); close(); }}
              className={cn('text-start px-3 py-2.5 rounded-lg text-[14px] hover:bg-mist', value === it.value ? 'text-accent font-medium' : 'text-ink')}>
              {it.label}
            </button>
          ))}
        </div>
      )}
    </FilterDropdown>
  );
}

function CategoryPill({ category, onSet }: { category: 'residential' | 'commercial'; onSet: (c: 'residential' | 'commercial') => void }) {
  return (
    <FilterDropdown label={category === 'commercial' ? 'Commercial' : 'Residential'} active width="sm:w-44">
      {(close) => (
        <div className="grid grid-cols-1 gap-0.5">
          {(['residential', 'commercial'] as const).map((c) => (
            <button key={c} type="button" onClick={() => { onSet(c); close(); }}
              className={cn('text-start px-3 py-2.5 rounded-lg text-[14px] capitalize hover:bg-mist', category === c ? 'text-accent font-medium' : 'text-ink')}>
              {c}
            </button>
          ))}
        </div>
      )}
    </FilterDropdown>
  );
}
