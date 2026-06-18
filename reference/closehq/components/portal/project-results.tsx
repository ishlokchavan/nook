'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Map as MapIcon, List as ListIcon, ChevronDown, MapPin, MessageCircle, User, Clock, ArrowRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProjectCard } from '@/components/portal/project-card';
import { PropertyMap, MAPS_ENABLED } from '@/components/portal/property-map';
import { useListingFilters, type FilterParams } from '@/components/portal/use-listing-filters';
import type { Listing } from '@/lib/portal/listing-types';
import type { Expert } from '@/lib/portal/experts';

type View = 'list' | 'map';
type Sort = 'featured' | 'price_low' | 'price_high' | 'delivery_early' | 'delivery_late';

const SORTS: { value: Sort; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price_low', label: 'Price (low)' },
  { value: 'price_high', label: 'Price (high)' },
  { value: 'delivery_early', label: 'Delivery date (earliest)' },
  { value: 'delivery_late', label: 'Delivery date (latest)' },
];

function handoverNum(p: Listing): number {
  return Number((p.handoverBy ?? '').replace(/\D/g, '').slice(-4)) || 9999;
}
function matchHandover(handoverBy: string | null | undefined, sel: string): boolean {
  if (!handoverBy) return false;
  const year = Number(handoverBy.replace(/\D/g, '').slice(-4));
  if (sel === 'later') return year > new Date().getFullYear();
  if (sel.endsWith('+')) return year >= Number(sel.replace('+', ''));
  return handoverBy.includes(sel);
}

export function ProjectResults({ projects, params, expert }: { projects: Listing[]; params: FilterParams; expert: Expert }) {
  const { get, setParams } = useListingFilters(params);
  const router = useRouter();
  const [view, setView] = useState<View>('list');
  const [sort, setSort] = useState<Sort>('featured');
  const [sortOpen, setSortOpen] = useState(false);
  const [unitView, setUnitView] = useState(false);
  const [compare, setCompare] = useState<string[]>([]);

  const type = get('type');
  const handover = get('handover');
  const plan = get('paymentPlan');
  const city = get('city');
  const minPrice = Number(get('minPrice')) || 0;
  const maxPrice = Number(get('maxPrice')) || Infinity;

  // Everything except city (so chips can show counts per emirate).
  const base = useMemo(
    () =>
      projects.filter((p) => {
        if (type && p.propertyType !== type) return false;
        if (handover && !matchHandover(p.handoverBy, handover)) return false;
        if (plan && p.paymentPlan !== plan) return false;
        if (p.priceAed < minPrice || p.priceAed > maxPrice) return false;
        return true;
      }),
    [projects, type, handover, plan, minPrice, maxPrice],
  );

  const cityCounts = useMemo(() => {
    const m = new Map<string, number>();
    base.forEach((p) => m.set(p.city, (m.get(p.city) ?? 0) + 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [base]);

  const filtered = useMemo(() => {
    const out = city ? base.filter((p) => p.city === city) : base;
    const sorted = [...out];
    sorted.sort((a, b) => {
      switch (sort) {
        case 'price_low': return a.priceAed - b.priceAed;
        case 'price_high': return b.priceAed - a.priceAed;
        case 'delivery_early': return handoverNum(a) - handoverNum(b);
        case 'delivery_late': return handoverNum(b) - handoverNum(a);
        default: return 0;
      }
    });
    return sorted;
  }, [base, city, sort]);

  function toggleCompare(ref: string) {
    setCompare((prev) => (prev.includes(ref) ? prev.filter((r) => r !== ref) : prev.length < 5 ? [...prev, ref] : prev));
  }

  // Insert the rotating expert card after the 2nd project (PF "New Project Expert").
  const withExpert: (Listing | 'expert')[] = filtered.length >= 2 ? [...filtered.slice(0, 2), 'expert', ...filtered.slice(2)] : [...filtered, 'expert'];

  return (
    <div className="space-y-5 pb-24">
      {/* Emirate chips */}
      <div className="flex items-center gap-2 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <Chip active={!city} onClick={() => setParams({ city: null })} label={`All UAE (${base.length})`} />
        {cityCounts.map(([c, n]) => (
          <Chip key={c} active={city === c} onClick={() => setParams({ city: c })} label={`${c} (${n})`} />
        ))}
      </div>

      {/* Controls: count + view + unit toggle + sort */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[15px] font-medium text-ink">{filtered.length} off-plan {filtered.length === 1 ? 'project' : 'projects'}</p>
        <div className="flex items-center gap-3 flex-wrap">
          <label className="flex items-center gap-2 text-[13px] text-graphite cursor-pointer">
            Show unit view
            <button
              type="button"
              role="switch"
              aria-checked={unitView}
              onClick={() => setUnitView((s) => !s)}
              className={cn('relative h-6 w-10 rounded-full transition-colors', unitView ? 'bg-accent' : 'bg-hairline')}
            >
              <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all', unitView ? 'start-[1.125rem]' : 'start-0.5')} />
            </button>
          </label>

          {/* Sort */}
          <div className="relative">
            <button type="button" onClick={() => setSortOpen((s) => !s)} onBlur={() => setTimeout(() => setSortOpen(false), 150)}
              className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-full border border-hairline text-[13px] text-ink/80">
              Sort: {SORTS.find((s) => s.value === sort)!.label} <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </button>
            {sortOpen && (
              <div className="absolute end-0 z-30 mt-2 w-56 rounded-2xl border border-hairline bg-paper shadow-card-hover p-1.5">
                {SORTS.map((s) => (
                  <button key={s.value} type="button" onMouseDown={() => { setSort(s.value); setSortOpen(false); }}
                    className={cn('w-full text-start px-3 py-2 rounded-lg text-[14px] hover:bg-mist', sort === s.value ? 'text-accent font-medium' : 'text-ink')}>
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Map/List */}
          <div className="inline-flex items-center gap-1 p-1 rounded-full bg-mist">
            {(['map', 'list'] as View[]).map((v) => (
              <button key={v} onClick={() => setView(v)}
                className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] rounded-full capitalize transition-colors',
                  view === v ? 'bg-paper text-ink shadow-card font-medium' : 'text-graphite hover:text-ink')}>
                {v === 'map' ? <MapIcon className="h-3.5 w-3.5" /> : <ListIcon className="h-3.5 w-3.5" />} {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="card-mist rounded-apple px-6 py-10 text-center text-[14px] text-graphite-dark">No projects match these filters.</div>
      ) : view === 'map' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="order-2 lg:order-1 grid grid-cols-1 xl:grid-cols-2 gap-4">
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} selectable selected={compare.includes(p.reference)} onToggleSelect={() => toggleCompare(p.reference)} />
            ))}
          </div>
          <div className="order-1 lg:order-2 lg:sticky lg:top-[140px] relative rounded-apple bg-[#eaeef0] overflow-hidden h-[420px] lg:h-[calc(100vh-160px)]">
            {MAPS_ENABLED ? <PropertyMap listings={filtered} /> : (
              <div className="absolute inset-0 flex items-center justify-center text-graphite/60">
                <span className="inline-flex items-center gap-2 text-[13px]"><MapPin className="h-4 w-4" /> Map view</span>
              </div>
            )}
          </div>
        </div>
      ) : unitView ? (
        <div className="space-y-3">
          {filtered.map((p) => <UnitRow key={p.id} project={p} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {withExpert.map((item, i) =>
            item === 'expert' ? (
              <ExpertCard key="expert" expert={expert} />
            ) : (
              <ProjectCard key={item.id} project={item} selectable selected={compare.includes(item.reference)} onToggleSelect={() => toggleCompare(item.reference)} />
            ),
          )}
        </div>
      )}

      {/* Compare bar */}
      {compare.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 bg-paper border-t border-hairline shadow-elevated">
          <div className="container-wide py-3 flex items-center justify-between gap-4">
            <span className="text-[14px] text-graphite">
              {compare.length < 2 ? 'Select 2–5 projects to compare' : `${compare.length} selected`}
            </span>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setCompare([])} className="text-[13px] text-graphite hover:text-ink">Clear</button>
              <button
                type="button"
                disabled={compare.length < 2}
                onClick={() => router.push(`/new-releases/compare?ids=${compare.join(',')}`)}
                className={cn('inline-flex items-center gap-1.5 h-10 px-5 rounded-full text-[14px] font-medium text-white transition-colors',
                  compare.length < 2 ? 'bg-graphite-light cursor-not-allowed' : 'bg-accent hover:bg-accent-hover')}
              >
                Compare <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Chip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick}
      className={cn('h-9 px-3.5 rounded-full border text-[13px] whitespace-nowrap transition-colors',
        active ? 'border-accent text-accent bg-accent/5 font-medium' : 'border-hairline text-ink/80 hover:border-ink/40')}>
      {label}
    </button>
  );
}

function UnitRow({ project }: { project: Listing }) {
  return (
    <Link href={`/properties/${project.reference}`} className="card-surface p-4 flex items-center gap-4 hover:shadow-card-hover transition-shadow">
      <span className="h-16 w-20 rounded-lg bg-mist shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-medium text-ink truncate">{project.building ?? project.title}</p>
        <p className="text-[12px] text-graphite truncate">{[project.community, project.city].filter(Boolean).join(', ')}</p>
        <p className="text-[12px] text-graphite mt-0.5">
          {project.bedrooms === 0 ? 'Studio' : `${project.bedrooms} bed`} · {project.areaSqft?.toLocaleString('en-US')} sqft · Handover {project.handoverBy}
        </p>
      </div>
      <div className="text-end shrink-0">
        <div className="text-[15px] font-semibold text-ink">AED {project.priceAed.toLocaleString('en-US')}</div>
        {project.paymentPlan && <div className="text-[12px] text-graphite">Plan {project.paymentPlan}</div>}
      </div>
    </Link>
  );
}

function ExpertCard({ expert }: { expert: Expert }) {
  const wa = `https://wa.me/971501234567?text=${encodeURIComponent(`Hi ${expert.name}, I'd like off-plan advice.`)}`;
  return (
    <article className="card-surface overflow-hidden flex flex-col">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-ink-700 via-ink-900 to-black flex items-end justify-center">
        <span className="absolute top-3 start-3 rounded-md bg-paper/90 text-ink text-[11px] font-medium px-2 py-1">NEW PROJECT EXPERT</span>
        <span className="flex items-center justify-center h-20 w-20 rounded-full bg-paper text-graphite -mb-10 border-4 border-paper shadow-card">
          <User className="h-9 w-9" />
        </span>
      </div>
      <div className="p-4 pt-12 flex flex-col flex-1 text-center">
        <h3 className="text-[16px] font-semibold text-ink">{expert.name}</h3>
        <p className="text-[12px] text-graphite mt-0.5">Languages: {expert.languages.join(' & ')}</p>
        <p className="text-[13px] text-graphite-dark mt-2 flex-1">{expert.blurb}</p>
        <p className="inline-flex items-center justify-center gap-1.5 text-[12px] text-journey-listing mt-3">
          <Clock className="h-3.5 w-3.5" /> Responds in {expert.respondsMins} minutes
        </p>
        <a href={wa} target="_blank" rel="noopener noreferrer"
          className="mt-3 inline-flex items-center justify-center gap-2 h-10 rounded-full border border-hairline text-[14px] text-ink hover:bg-mist transition-colors">
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
      </div>
    </article>
  );
}

export { X };
