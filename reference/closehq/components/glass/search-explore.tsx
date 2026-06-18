'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, X, Heart, Coins, Check, Sparkles, Loader2, MapPin } from 'lucide-react';
import { useExperience } from './experience-provider';
import { useSaved } from './saved-store';
import { formatAed, formatCredits } from '@/lib/glass/experience-data';
import type { ExperienceListing } from '@/lib/glass/experience-data';
import { SmartImage } from './smart-image';

type Completion = '' | 'ready' | 'off_plan';

interface ParsedFilters {
  completion: 'ready' | 'off_plan' | null;
  types: string[];
  minBeds: number | null;
  maxBeds: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  community: string | null;
  amenities: string[];
  q: string;
}

const EXAMPLE = '2-bed near the marina under 2M with a pool';
const BED_CHIPS = ['Studio', '1', '2', '3', '4+'];
const TYPES = ['apartment', 'villa', 'townhouse', 'penthouse', 'office', 'retail'] as const;

export function SearchExplore() {
  const { listings } = useExperience();
  const { isSaved, toggleSave } = useSaved();

  const [q, setQ] = useState('');
  const [completion, setCompletion] = useState<Completion>('');
  const [beds, setBeds] = useState('');
  const [sheet, setSheet] = useState(false);
  const [types, setTypes] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Natural-language ("smart") filters, set when the user submits a sentence.
  const [smart, setSmart] = useState<ParsedFilters | null>(null);
  const [parsing, setParsing] = useState(false);
  const [community, setCommunity] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [minBeds, setMinBeds] = useState<number | null>(null);
  const [maxBeds, setMaxBeds] = useState<number | null>(null);
  const [amenities, setAmenities] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const communityOptions = useMemo(
    () => Array.from(new Set(listings.map((l) => l.community).filter(Boolean))) as string[],
    [listings],
  );

  const activeFilters =
    types.length +
    (maxPrice ? 1 : 0) +
    (minPrice ? 1 : 0) +
    (community ? 1 : 0) +
    amenities.length +
    (minBeds != null ? 1 : 0) +
    (verifiedOnly ? 1 : 0);

  async function runSmart(text: string) {
    const query = text.trim();
    if (!query) return;
    setParsing(true);
    try {
      const res = await fetch('/api/glass/search-parse', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ q: query, communities: communityOptions }),
      });
      const data = (await res.json()) as { filters: ParsedFilters };
      const f = data.filters;
      setCompletion(f.completion ?? '');
      setTypes(f.types ?? []);
      setMaxPrice(f.maxPrice ?? 0);
      setMinPrice(f.minPrice ?? 0);
      setMinBeds(f.minBeds ?? null);
      setMaxBeds(f.maxBeds ?? null);
      setAmenities(f.amenities ?? []);
      setCommunity(f.community ?? '');
      setBeds('');
      setSmart(f);
      inputRef.current?.blur();
    } catch {
      /* network error — keep the instant substring results */
    } finally {
      setParsing(false);
    }
  }

  function clearSmart() {
    setSmart(null);
    setCommunity('');
    setMinPrice(0);
    setMaxPrice(0);
    setMinBeds(null);
    setMaxBeds(null);
    setAmenities([]);
    setCompletion('');
    setTypes([]);
    setQ('');
  }

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    return listings.filter((l) => {
      // Plain substring only when NOT in smart mode (the sentence won't match).
      if (!smart && query) {
        const hay = [l.title, l.community, l.building, l.city, l.developerName]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!hay.includes(query)) return false;
      }
      if (community && !(l.community ?? '').toLowerCase().includes(community.toLowerCase()))
        return false;
      if (completion && l.completion !== completion) return false;
      if (beds) {
        if (beds === 'Studio' && l.bedrooms !== 0) return false;
        else if (beds === '4+' && (l.bedrooms ?? 0) < 4) return false;
        else if (!['Studio', '4+'].includes(beds) && l.bedrooms !== Number(beds))
          return false;
      }
      if (minBeds != null && (l.bedrooms ?? -1) < minBeds) return false;
      if (maxBeds != null && (l.bedrooms ?? 99) > maxBeds) return false;
      if (types.length && !types.includes(l.propertyType)) return false;
      if (minPrice && l.priceAed < minPrice) return false;
      if (maxPrice && l.priceAed > maxPrice) return false;
      if (amenities.length) {
        const hay = [...(l.amenities ?? []), l.title, l.community ?? '']
          .join(' ')
          .toLowerCase();
        if (!amenities.every((a) => hay.includes(a))) return false;
      }
      if (verifiedOnly && !l.isVerified) return false;
      return true;
    });
  }, [listings, q, smart, community, completion, beds, minBeds, maxBeds, types, minPrice, maxPrice, amenities, verifiedOnly]);

  return (
    <div className="relative h-[100svh] overflow-hidden bg-paper">
      {/* Sticky search header */}
      <div className="absolute inset-x-0 top-0 z-20 bg-paper/80 px-4 pb-2 pt-[max(16px,env(safe-area-inset-top))] backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <label className="flex h-11 flex-1 items-center gap-2 rounded-full bg-mist px-4">
            {parsing ? (
              <Loader2 className="h-[18px] w-[18px] shrink-0 animate-spin text-accent" />
            ) : smart ? (
              <Sparkles className="h-[18px] w-[18px] shrink-0 text-accent" />
            ) : (
              <Search className="h-[18px] w-[18px] shrink-0 text-graphite" />
            )}
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                if (smart) setSmart(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  runSmart(q);
                }
              }}
              enterKeyHint="search"
              placeholder="Describe your ideal home…"
              className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-graphite"
            />
            {q && (
              <button
                type="button"
                onClick={() => {
                  setQ('');
                  if (smart) clearSmart();
                }}
                aria-label="Clear"
              >
                <X className="h-4 w-4 text-graphite" />
              </button>
            )}
          </label>
          <button
            type="button"
            onClick={() => setSheet(true)}
            aria-label="Filters"
            className={`relative flex h-11 w-11 items-center justify-center rounded-full ${
              activeFilters ? 'bg-ink text-white' : 'bg-mist text-ink'
            }`}
          >
            <SlidersHorizontal className="h-[19px] w-[19px]" />
            {activeFilters > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white ring-2 ring-white">
                {activeFilters}
              </span>
            )}
          </button>
        </div>

        {/* Quick chips */}
        <div className="no-scrollbar mt-2.5 flex gap-2 overflow-x-auto">
          <Chip active={completion === ''} onClick={() => setCompletion('')}>
            All
          </Chip>
          <Chip active={completion === 'ready'} onClick={() => setCompletion('ready')}>
            Ready
          </Chip>
          <Chip
            active={completion === 'off_plan'}
            onClick={() => setCompletion('off_plan')}
          >
            Off-plan
          </Chip>
          <span className="my-1 w-px shrink-0 bg-hairline" />
          {BED_CHIPS.map((b) => (
            <Chip key={b} active={beds === b} onClick={() => setBeds(beds === b ? '' : b)}>
              {b === 'Studio' ? b : `${b} bed`}
            </Chip>
          ))}
        </div>
      </div>

      {/* Results grid */}
      <div className="no-scrollbar h-full overflow-y-scroll px-3 pb-28 pt-[136px]">
        {smart ? (
          <SmartBanner
            completion={completion}
            community={community}
            minBeds={minBeds}
            maxBeds={maxBeds}
            minPrice={minPrice}
            maxPrice={maxPrice}
            types={types}
            amenities={amenities}
            onClear={clearSmart}
          />
        ) : !q ? (
          <button
            type="button"
            onClick={() => {
              setQ(EXAMPLE);
              runSmart(EXAMPLE);
            }}
            className="mx-1 mb-2 flex w-[calc(100%-0.5rem)] items-center gap-2 rounded-2xl border border-accent/20 bg-accent/[0.06] px-3.5 py-2.5 text-left active:scale-[0.99]"
          >
            <Sparkles className="h-4 w-4 shrink-0 text-accent" />
            <span className="text-[13px] text-graphite-dark">
              Try: <span className="text-ink">&ldquo;{EXAMPLE}&rdquo;</span>
            </span>
          </button>
        ) : null}
        <p className="px-1 pb-2 pt-1 text-[13px] text-graphite">
          {results.length} {results.length === 1 ? 'home' : 'homes'}
        </p>
        {results.length === 0 ? (
          <div className="mt-16 text-center text-[14px] text-graphite">
            No homes match. Try clearing a filter.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {results.map((l) => (
              <GridCard
                key={l.reference}
                listing={l}
                saved={isSaved(l.reference)}
                onToggleSave={() => toggleSave(l.reference)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Filters sheet */}
      {sheet && (
        <FilterSheet
          types={types}
          setTypes={setTypes}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          verifiedOnly={verifiedOnly}
          setVerifiedOnly={setVerifiedOnly}
          resultCount={results.length}
          onClose={() => setSheet(false)}
          onReset={() => {
            setTypes([]);
            setMaxPrice(0);
            setVerifiedOnly(false);
          }}
        />
      )}
    </div>
  );
}

function bedsLabel(min: number | null, max: number | null): string | null {
  if (min == null && max == null) return null;
  if (min === 0 && max === 0) return 'Studio';
  if (min != null && max != null) return min === max ? `${min} bed` : `${min}–${max} beds`;
  if (min != null) return `${min}+ beds`;
  return `up to ${max} beds`;
}

/** "Understood: …" — the parsed criteria shown back, with one tap to clear. */
function SmartBanner({
  completion,
  community,
  minBeds,
  maxBeds,
  minPrice,
  maxPrice,
  types,
  amenities,
  onClear,
}: {
  completion: Completion;
  community: string;
  minBeds: number | null;
  maxBeds: number | null;
  minPrice: number;
  maxPrice: number;
  types: string[];
  amenities: string[];
  onClear: () => void;
}) {
  const chips: { label: string; icon?: React.ReactNode }[] = [];
  if (community) chips.push({ label: community, icon: <MapPin className="h-3 w-3" /> });
  if (completion) chips.push({ label: completion === 'off_plan' ? 'Off-plan' : 'Ready' });
  const bl = bedsLabel(minBeds, maxBeds);
  if (bl) chips.push({ label: bl });
  for (const t of types) chips.push({ label: t });
  if (minPrice && maxPrice) chips.push({ label: `${formatAed(minPrice)}–${formatAed(maxPrice)}` });
  else if (maxPrice) chips.push({ label: `≤ ${formatAed(maxPrice)}` });
  else if (minPrice) chips.push({ label: `≥ ${formatAed(minPrice)}` });
  for (const a of amenities) chips.push({ label: a });

  return (
    <div className="mx-1 mb-2 rounded-2xl border border-accent/20 bg-accent/[0.06] px-3.5 py-3">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[12px] font-semibold text-accent">
          <Sparkles className="h-3.5 w-3.5" /> Understood
        </span>
        <button
          type="button"
          onClick={onClear}
          className="flex items-center gap-1 text-[12px] font-medium text-graphite"
        >
          Clear <X className="h-3.5 w-3.5" />
        </button>
      </div>
      {chips.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {chips.map((c, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-full bg-paper px-2.5 py-1 text-[12px] font-medium capitalize text-ink ring-1 ring-hairline"
            >
              {c.icon}
              {c.label}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-1 text-[12.5px] text-graphite">
          Couldn&rsquo;t pin down specifics — showing the closest matches.
        </p>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
        active ? 'bg-ink text-white' : 'bg-mist text-graphite-dark'
      }`}
    >
      {children}
    </button>
  );
}

function GridCard({
  listing,
  saved,
  onToggleSave,
}: {
  listing: ExperienceListing;
  saved: boolean;
  onToggleSave: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-hairline/60 bg-paper">
      <Link href={`/experience/property/${listing.reference}`}>
        <div className="relative aspect-square bg-mist">
          <SmartImage
            src={listing.cover}
            alt={listing.title}
            fill
            sizes="50vw"
            className="object-cover"
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onToggleSave();
            }}
            aria-label={saved ? 'Remove from saved' : 'Save'}
            className="lg-glass-light absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full active:scale-90"
          >
            <Heart
              className={`h-[17px] w-[17px] ${saved ? 'fill-rose-500 text-rose-500' : 'text-ink'}`}
            />
          </button>
        </div>
      </Link>
      <div className="p-2.5">
        <p className="text-[15px] font-semibold leading-none tracking-tight text-ink">
          {formatAed(listing.priceAed)}
        </p>
        <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-accent/10 px-1.5 py-0.5 text-[11px] font-semibold text-accent">
          <Coins className="h-3 w-3" /> {formatCredits(listing.credit.credits)}
        </span>
        <p className="mt-1 line-clamp-1 text-[12px] text-graphite">
          {listing.community}, {listing.city}
        </p>
      </div>
    </div>
  );
}

const PRICE_OPTIONS = [
  { label: 'Any', value: 0 },
  { label: '≤ 1M', value: 1_000_000 },
  { label: '≤ 2M', value: 2_000_000 },
  { label: '≤ 5M', value: 5_000_000 },
  { label: '≤ 10M', value: 10_000_000 },
];

function FilterSheet({
  types,
  setTypes,
  maxPrice,
  setMaxPrice,
  verifiedOnly,
  setVerifiedOnly,
  resultCount,
  onClose,
  onReset,
}: {
  types: string[];
  setTypes: (v: string[]) => void;
  maxPrice: number;
  setMaxPrice: (v: number) => void;
  verifiedOnly: boolean;
  setVerifiedOnly: (v: boolean) => void;
  resultCount: number;
  onClose: () => void;
  onReset: () => void;
}) {
  function toggleType(t: string) {
    setTypes(types.includes(t) ? types.filter((x) => x !== t) : [...types, t]);
  }

  return (
    <div className="absolute inset-0 z-[60] flex flex-col justify-end">
      <button
        type="button"
        aria-label="Close filters"
        onClick={onClose}
        className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
      />
      <div className="relative max-h-[80%] overflow-y-auto rounded-t-[28px] bg-paper p-5 pb-8">
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-hairline" />
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[20px] font-semibold tracking-tight text-ink">Filters</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            <X className="h-6 w-6 text-graphite" />
          </button>
        </div>

        <h3 className="mb-2 text-[14px] font-semibold text-ink">Property type</h3>
        <div className="mb-5 flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => toggleType(t)}
              className={`rounded-full px-3.5 py-2 text-[13px] font-medium capitalize transition-colors ${
                types.includes(t) ? 'bg-ink text-white' : 'bg-mist text-graphite-dark'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <h3 className="mb-2 text-[14px] font-semibold text-ink">Max price</h3>
        <div className="mb-5 flex flex-wrap gap-2">
          {PRICE_OPTIONS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setMaxPrice(p.value)}
              className={`rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors ${
                maxPrice === p.value ? 'bg-ink text-white' : 'bg-mist text-graphite-dark'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setVerifiedOnly(!verifiedOnly)}
          className="mb-6 flex w-full items-center justify-between rounded-2xl bg-mist px-4 py-3.5"
        >
          <span className="text-[15px] font-medium text-ink">Verified listings only</span>
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full ${
              verifiedOnly ? 'bg-ink text-white' : 'bg-paper text-transparent'
            }`}
          >
            <Check className="h-4 w-4" />
          </span>
        </button>

        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onReset}
            className="flex-1 rounded-full border border-hairline bg-paper py-3.5 text-[15px] font-medium text-ink active:scale-[0.98]"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-[2] rounded-full bg-ink py-3.5 text-[15px] font-semibold text-white active:scale-[0.98]"
          >
            Show {resultCount} homes
          </button>
        </div>
      </div>
    </div>
  );
}
