'use client';

import { useState } from 'react';
import { User, Building2, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FilterDropdown } from './filter-dropdown';
import { useListingFilters, type FilterParams } from '@/components/portal/use-listing-filters';
import type { FilterOptions } from '@/lib/portal/filters';

export interface AgentOption { name: string; type: 'person' | 'company' }

const RES_TYPES = ['apartment', 'villa', 'townhouse', 'penthouse', 'plot'];
const COM_TYPES = ['office', 'retail'];

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick}
      className={cn('h-9 min-w-[44px] px-3 rounded-full border text-[13px] transition-colors',
        active ? 'border-accent text-accent bg-accent/5 font-medium' : 'border-hairline text-ink/80 hover:border-ink/40')}>
      {children}
    </button>
  );
}

function csv(v: string): string[] {
  return v.split(',').map((s) => s.trim()).filter(Boolean);
}

export function PropertyFilterDropdowns({
  params, options, developerOptions = [], agentOptions = [],
}: {
  params: FilterParams; options: FilterOptions; developerOptions?: string[]; agentOptions?: AgentOption[];
}) {
  const { get, setParams } = useListingFilters(params);

  const type = get('type');
  const category = get('category');
  const beds = get('beds');
  const baths = get('baths');
  const typeLabel = options.propertyTypes.find((t) => t.value === type)?.label;
  const bedBathLabel = beds || baths ? `${beds ? `${beds} bed` : ''}${beds && baths ? ' · ' : ''}${baths ? `${baths} bath` : ''}` : null;

  // active "More" count
  const moreCount = ['minPrice', 'maxPrice', 'minSize', 'maxSize', 'completion'].filter((k) => get(k)).length
    + (get('verified') === 'true' ? 1 : 0)
    + csv(get('keywords')).length + csv(get('developers')).length + csv(get('agents')).length + csv(get('amenities')).length;

  return (
    <>
      {/* Property type — Residential / Commercial tabs */}
      <FilterDropdown
        label={type && typeLabel ? typeLabel : category ? (category === 'commercial' ? 'Commercial' : 'Residential') : 'Property type'}
        active={!!(type || category)}
        width="sm:w-80"
      >
        {(close) => {
          const tab = category === 'commercial' ? 'commercial' : 'residential';
          const types = tab === 'commercial' ? COM_TYPES : RES_TYPES;
          const setTab = (t: 'residential' | 'commercial') => setParams({ category: t, type: null });
          return (
            <div>
              <div className="flex border-b border-hairline mb-3">
                {(['residential', 'commercial'] as const).map((t) => (
                  <button key={t} type="button" onClick={() => setTab(t)}
                    className={cn('flex-1 pb-2.5 -mb-px text-[14px] capitalize border-b-2 transition-colors',
                      tab === t ? 'border-accent text-ink font-medium' : 'border-transparent text-graphite')}>
                    {t}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {types.map((val) => {
                  const label = options.propertyTypes.find((o) => o.value === val)?.label ?? val;
                  return (
                    <button key={val} type="button"
                      onClick={() => { setParams({ type: val, category: tab }); }}
                      className={cn('h-10 px-3 rounded-xl border text-[13px] text-start transition-colors',
                        type === val ? 'border-accent text-accent bg-accent/5 font-medium' : 'border-hairline text-ink/80 hover:border-ink/40')}>
                      {label}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between mt-4">
                <button type="button" onClick={() => { setParams({ type: null, category: null }); close(); }} className="text-[13px] text-graphite hover:text-ink">Reset</button>
                <button type="button" onClick={close} className="h-9 px-4 rounded-full bg-accent text-white text-[13px] font-medium hover:bg-accent-hover">Done</button>
              </div>
            </div>
          );
        }}
      </FilterDropdown>

      {/* Beds & Baths */}
      <FilterDropdown label={bedBathLabel ?? 'Beds & Baths'} active={!!(beds || baths)} width="sm:w-72">
        {() => (
          <div className="space-y-4">
            <div>
              <p className="text-[12px] text-graphite mb-2">Bedrooms</p>
              <div className="flex flex-wrap gap-2">
                <Chip active={!beds} onClick={() => setParams({ beds: null })}>Any</Chip>
                {options.beds.map((b) => <Chip key={b} active={beds === b} onClick={() => setParams({ beds: b })}>{b}</Chip>)}
              </div>
            </div>
            <div>
              <p className="text-[12px] text-graphite mb-2">Bathrooms</p>
              <div className="flex flex-wrap gap-2">
                <Chip active={!baths} onClick={() => setParams({ baths: null })}>Any</Chip>
                {options.baths.map((b) => <Chip key={b} active={baths === b} onClick={() => setParams({ baths: b })}>{b}</Chip>)}
              </div>
            </div>
          </div>
        )}
      </FilterDropdown>

      {/* More Filters */}
      <FilterDropdown label={moreCount ? `More Filters (${moreCount})` : 'More Filters'} active={moreCount > 0} width="sm:w-96">
        {(close) => (
          <MoreFilters get={get} setParams={setParams} options={options} developerOptions={developerOptions} agentOptions={agentOptions} close={close} />
        )}
      </FilterDropdown>
    </>
  );
}

function MoreFilters({
  get, setParams, options, developerOptions, agentOptions, close,
}: {
  get: (k: string) => string;
  setParams: (u: Record<string, string | null>) => void;
  options: FilterOptions;
  developerOptions: string[];
  agentOptions: AgentOption[];
  close: () => void;
}) {
  const [minP, setMinP] = useState(get('minPrice'));
  const [maxP, setMaxP] = useState(get('maxPrice'));
  const [minA, setMinA] = useState(get('minSize'));
  const [maxA, setMaxA] = useState(get('maxSize'));
  const [kw, setKw] = useState('');
  const keywords = csv(get('keywords'));
  const developers = csv(get('developers'));
  const agents = csv(get('agents'));
  const amenities = csv(get('amenities'));
  const completion = get('completion');
  const verified = get('verified') === 'true';

  function toggle(key: string, list: string[], val: string) {
    const next = list.includes(val) ? list.filter((x) => x !== val) : [...list, val];
    setParams({ [key]: next.join(',') || null });
  }
  function addKeyword() {
    const v = kw.trim();
    if (!v || keywords.includes(v)) return setKw('');
    setParams({ keywords: [...keywords, v].join(',') });
    setKw('');
  }

  const inputCls = 'w-full h-10 px-3 rounded-xl border border-hairline text-[14px] focus:outline-none focus:ring-2 focus:ring-accent/40';

  return (
    <div className="space-y-5">
      {/* Price */}
      <div>
        <p className="text-[12px] text-graphite mb-2">Price (AED)</p>
        <div className="flex items-center gap-2">
          <input inputMode="numeric" value={minP} onChange={(e) => setMinP(e.target.value.replace(/\D/g, ''))} placeholder="Min" className={inputCls} />
          <span className="text-graphite">–</span>
          <input inputMode="numeric" value={maxP} onChange={(e) => setMaxP(e.target.value.replace(/\D/g, ''))} placeholder="Max" className={inputCls} />
        </div>
      </div>

      {/* Area */}
      <div>
        <p className="text-[12px] text-graphite mb-2">Area (sqft)</p>
        <div className="flex items-center gap-2">
          <input inputMode="numeric" value={minA} onChange={(e) => setMinA(e.target.value.replace(/\D/g, ''))} placeholder="Min" className={inputCls} />
          <span className="text-graphite">–</span>
          <input inputMode="numeric" value={maxA} onChange={(e) => setMaxA(e.target.value.replace(/\D/g, ''))} placeholder="Max" className={inputCls} />
        </div>
      </div>

      {/* Keywords (multiple) */}
      <div>
        <p className="text-[12px] text-graphite mb-2">Keywords</p>
        <input value={kw} onChange={(e) => setKw(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
          placeholder="e.g. furnished, sea view — press Enter" className={inputCls} />
        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {keywords.map((k) => (
              <span key={k} className="inline-flex items-center gap-1 rounded-full bg-mist px-2.5 py-1 text-[12px] text-ink">
                {k}
                <button type="button" onClick={() => toggle('keywords', keywords, k)}><X className="h-3 w-3" /></button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Developer (multi-select) */}
      {developerOptions.length > 0 && (
        <MultiSelect title="Developer" placeholder="Search developers" selected={developers} options={developerOptions.map((n) => ({ name: n, type: 'company' as const }))} onToggle={(v) => toggle('developers', developers, v)} />
      )}

      {/* Agent / Agency (multi-select with icons) */}
      {agentOptions.length > 0 && (
        <MultiSelect title="Agent / Agency" placeholder="Search agents or agencies" selected={agents} options={agentOptions} onToggle={(v) => toggle('agents', agents, v)} />
      )}

      {/* Amenities */}
      <div>
        <p className="text-[12px] text-graphite mb-2">Amenities</p>
        <div className="max-h-44 overflow-auto space-y-0.5">
          {options.amenities.map((a) => {
            const on = amenities.includes(a);
            return (
              <label key={a} className="flex items-center gap-2.5 px-1 py-1.5 rounded-lg text-[14px] text-ink hover:bg-mist cursor-pointer">
                <input type="checkbox" className="h-4 w-4 accent-[#0071e3]" checked={on} onChange={() => toggle('amenities', amenities, a)} />
                {a}
              </label>
            );
          })}
        </div>
      </div>

      {/* Completion */}
      <div>
        <p className="text-[12px] text-graphite mb-2">Completion</p>
        <div className="flex flex-wrap gap-2">
          {options.completion.map((c) => (
            <button key={c.label} type="button" onClick={() => setParams({ completion: c.value || null })}
              className={cn('h-9 px-3 rounded-full border text-[13px]', completion === c.value ? 'border-accent text-accent bg-accent/5 font-medium' : 'border-hairline text-ink/80')}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2.5 text-[14px] text-ink">
        <input type="checkbox" className="h-4 w-4 accent-[#0071e3]" checked={verified} onChange={(e) => setParams({ verified: e.target.checked ? 'true' : null })} />
        Verified listings only
      </label>

      {/* Done / Reset */}
      <div className="flex justify-between pt-1 border-t border-hairline/60">
        <button type="button"
          onClick={() => { setParams({ minPrice: null, maxPrice: null, minSize: null, maxSize: null, keywords: null, developers: null, agents: null, amenities: null, completion: null, verified: null }); close(); }}
          className="text-[13px] text-graphite hover:text-ink mt-3">Reset</button>
        <button type="button"
          onClick={() => { setParams({ minPrice: minP || null, maxPrice: maxP || null, minSize: minA || null, maxSize: maxA || null }); close(); }}
          className="h-9 px-4 rounded-full bg-accent text-white text-[13px] font-medium hover:bg-accent-hover mt-3">Done</button>
      </div>
    </div>
  );
}

function MultiSelect({
  title, placeholder, selected, options, onToggle,
}: {
  title: string; placeholder: string; selected: string[];
  options: AgentOption[]; onToggle: (v: string) => void;
}) {
  const [q, setQ] = useState('');
  const filtered = options.filter((o) => o.name.toLowerCase().includes(q.toLowerCase())).slice(0, 30);
  return (
    <div>
      <p className="text-[12px] text-graphite mb-2">{title}</p>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder}
        className="w-full h-10 px-3 rounded-xl border border-hairline text-[14px] focus:outline-none focus:ring-2 focus:ring-accent/40" />
      <div className="max-h-40 overflow-auto mt-2 space-y-0.5">
        {filtered.map((o) => {
          const on = selected.includes(o.name);
          return (
            <button key={o.name} type="button" onClick={() => onToggle(o.name)}
              className={cn('w-full flex items-center gap-2 px-2 py-2 rounded-lg text-[14px] text-start hover:bg-mist', on && 'bg-mist')}>
              <span className={cn('flex items-center justify-center h-4 w-4 rounded border shrink-0', on ? 'bg-accent border-accent' : 'border-graphite')}>
                {on && <Check className="h-3 w-3 text-white" />}
              </span>
              {o.type === 'company' ? <Building2 className="h-4 w-4 text-graphite shrink-0" /> : <User className="h-4 w-4 text-graphite shrink-0" />}
              <span className="truncate">{o.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
