'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useDragControls, useMotionValue, animate } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { useExperience } from './experience-provider';
import { SmartImage } from './smart-image';
import { formatAed } from '@/lib/glass/experience-data';
import type { ExperienceListing } from '@/lib/glass/experience-data';
import type { Listing } from '@/lib/portal/listing-types';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? 'DEMO_MAP_ID';
const DUBAI = { lat: 25.13, lng: 55.22 };

const SHEET_PEEK = 196; // px visible above the tab bar when collapsed
const CHIP_BAR_H = 108; // approx chip-bar height incl. safe area

const CHIPS = [
  { key: 'all',      label: 'All' },
  { key: 'buy',      label: 'Buy' },
  { key: 'offplan',  label: 'Off-Plan' },
  { key: 'releases', label: 'New Releases' },
] as const;

type ChipKey = typeof CHIPS[number]['key'];

type PropertyType = Listing['propertyType'];
const TYPE_OPTIONS: { key: PropertyType; label: string }[] = [
  { key: 'apartment', label: 'Apartment' },
  { key: 'villa', label: 'Villa' },
  { key: 'townhouse', label: 'Townhouse' },
  { key: 'penthouse', label: 'Penthouse' },
  { key: 'plot', label: 'Plot' },
];
const BED_OPTIONS = [0, 1, 2, 3, 4]; // minimum bedrooms (0 = any)
const PRICE_OPTIONS = [1_000_000, 2_000_000, 5_000_000, 10_000_000]; // max price ceilings

interface Filters {
  types: PropertyType[];
  minBeds: number;
  maxPrice: number | null;
}
const EMPTY_FILTERS: Filters = { types: [], minBeds: 0, maxPrice: null };

function filtersActive(f: Filters): number {
  return f.types.length + (f.minBeds > 0 ? 1 : 0) + (f.maxPrice ? 1 : 0);
}

function applyAll(listings: ExperienceListing[], chip: ChipKey, f: Filters): ExperienceListing[] {
  let out = listings;
  switch (chip) {
    case 'buy':      out = out.filter(l => l.purpose === 'sale' && l.completion === 'ready'); break;
    case 'offplan':  out = out.filter(l => l.completion === 'off_plan'); break;
    case 'releases': out = out.filter(l => l.completion === 'off_plan' && l.source === 'developer'); break;
  }
  if (f.types.length) out = out.filter(l => f.types.includes(l.propertyType));
  if (f.minBeds > 0) out = out.filter(l => (l.bedrooms ?? 0) >= f.minBeds);
  if (f.maxPrice) out = out.filter(l => l.priceAed <= f.maxPrice!);
  return out;
}

function pricePin(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  return `${Math.round(n / 1000)}K`;
}

// ─── Chip bar ────────────────────────────────────────────────────────────────

function ChipBar({
  chip,
  onChange,
  onOpenFilters,
  filterCount,
}: {
  chip: ChipKey;
  onChange: (k: ChipKey) => void;
  onOpenFilters: () => void;
  filterCount: number;
}) {
  return (
    <div
      className="absolute inset-x-0 top-0 z-20 bg-paper/90 backdrop-blur-md"
      style={{ paddingTop: 'calc(env(safe-area-inset-top) + 10px)' }}
    >
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3 pt-1">
        {CHIPS.map(c => (
          <button
            key={c.key}
            type="button"
            onClick={() => onChange(c.key)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-[13px] font-medium transition-all active:scale-95 ${
              chip === c.key
                ? 'bg-ink text-white shadow-md'
                : 'border border-ink/10 bg-white text-ink/65 shadow-sm'
            }`}
          >
            {c.label}
          </button>
        ))}

        <button
          type="button"
          onClick={onOpenFilters}
          className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium shadow-sm transition-all active:scale-95 ${
            filterCount > 0 ? 'bg-ink text-white' : 'border border-ink/10 bg-white text-ink/65'
          }`}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
          {filterCount > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-ink">
              {filterCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Filters sheet ────────────────────────────────────────────────────────────

function FiltersSheet({
  open,
  initial,
  resultCount,
  onApply,
  onClose,
}: {
  open: boolean;
  initial: Filters;
  resultCount: (f: Filters) => number;
  onApply: (f: Filters) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<Filters>(initial);

  // Reset the draft each time the sheet opens.
  useEffect(() => {
    if (open) setDraft(initial);
  }, [open, initial]);

  const toggleType = (t: PropertyType) =>
    setDraft(d => ({
      ...d,
      types: d.types.includes(t) ? d.types.filter(x => x !== t) : [...d.types, t],
    }));

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="absolute inset-0 z-40 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 z-50 rounded-t-[24px] bg-paper pb-[max(20px,env(safe-area-inset-bottom))]"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-2 pt-4">
              <span className="text-[18px] font-semibold tracking-tight text-ink">Filters</span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/8 active:scale-90"
              >
                <X className="h-4 w-4 text-ink/55" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto px-5 pt-2">
              {/* Property type */}
              <p className="mb-2.5 text-[14px] font-semibold text-ink">Property type</p>
              <div className="mb-6 flex flex-wrap gap-2">
                {TYPE_OPTIONS.map(t => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => toggleType(t.key)}
                    className={`rounded-full px-4 py-2 text-[13px] font-medium transition-all active:scale-95 ${
                      draft.types.includes(t.key)
                        ? 'bg-ink text-white'
                        : 'border border-ink/12 bg-white text-ink/70'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Bedrooms */}
              <p className="mb-2.5 text-[14px] font-semibold text-ink">Bedrooms</p>
              <div className="mb-6 flex gap-2">
                {BED_OPTIONS.map(b => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setDraft(d => ({ ...d, minBeds: b }))}
                    className={`flex-1 rounded-xl py-2.5 text-[13px] font-medium transition-all active:scale-95 ${
                      draft.minBeds === b
                        ? 'bg-ink text-white'
                        : 'border border-ink/12 bg-white text-ink/70'
                    }`}
                  >
                    {b === 0 ? 'Any' : `${b}+`}
                  </button>
                ))}
              </div>

              {/* Max price */}
              <p className="mb-2.5 text-[14px] font-semibold text-ink">Max price</p>
              <div className="mb-4 flex flex-wrap gap-2">
                {PRICE_OPTIONS.map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setDraft(d => ({ ...d, maxPrice: d.maxPrice === p ? null : p }))}
                    className={`rounded-full px-4 py-2 text-[13px] font-medium transition-all active:scale-95 ${
                      draft.maxPrice === p
                        ? 'bg-ink text-white'
                        : 'border border-ink/12 bg-white text-ink/70'
                    }`}
                  >
                    Up to {formatAed(p)}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer actions */}
            <div className="flex items-center gap-3 px-5 pt-3">
              <button
                type="button"
                onClick={() => setDraft(EMPTY_FILTERS)}
                className="text-[14px] font-medium text-ink/55 active:opacity-70"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => onApply(draft)}
                className="flex-1 rounded-full bg-ink py-3.5 text-[15px] font-semibold text-white active:scale-[0.99]"
              >
                Show {resultCount(draft)} home{resultCount(draft) !== 1 ? 's' : ''}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Listing card (shared row) ────────────────────────────────────────────────

function ListingRow({ l, highlighted }: { l: ExperienceListing; highlighted?: boolean }) {
  return (
    <Link
      href={`/experience/property/${l.reference}`}
      className={`flex gap-3.5 rounded-2xl border bg-white p-3 shadow-sm transition-colors active:scale-[0.99] ${
        highlighted ? 'border-ink/25 shadow-[0_2px_12px_rgba(0,0,0,0.10)]' : 'border-ink/[0.07]'
      }`}
    >
      <div className="relative h-[68px] w-[68px] shrink-0 overflow-hidden rounded-xl">
        <SmartImage src={l.cover} alt="" fill sizes="68px" className="object-cover" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div>
          <p className="line-clamp-1 text-[14px] font-semibold text-ink">{l.title}</p>
          <p className="mt-0.5 text-[12px] text-ink/45">{l.community ?? l.city}</p>
        </div>
        <p className="text-[15px] font-bold text-ink">{formatAed(l.priceAed)}</p>
      </div>
    </Link>
  );
}

// ─── Live Google Map ──────────────────────────────────────────────────────────

function LiveMap({
  listings,
  active,
  onSelect,
  onDeselect,
}: {
  listings: ExperienceListing[];
  active: ExperienceListing | null;
  onSelect: (l: ExperienceListing) => void;
  onDeselect: () => void;
}) {
  return (
    <APIProvider apiKey={API_KEY}>
      <Map
        mapId={MAP_ID}
        defaultCenter={DUBAI}
        defaultZoom={11}
        gestureHandling="greedy"
        disableDefaultUI
        className="h-full w-full"
        onClick={onDeselect}
      >
        {listings.map(l => {
          if (l.latitude == null || l.longitude == null) return null;
          const sel = active?.reference === l.reference;
          return (
            <AdvancedMarker
              key={l.reference}
              position={{ lat: l.latitude, lng: l.longitude }}
              onClick={() => onSelect(l)}
              zIndex={sel ? 10 : 1}
            >
              <span
                className={`whitespace-nowrap rounded-full px-2.5 py-[5px] text-[11px] font-semibold shadow-md transition-all ${
                  sel ? 'scale-110 bg-ink text-white' : 'bg-white text-ink ring-1 ring-ink/10'
                }`}
              >
                {pricePin(l.priceAed)}
              </span>
            </AdvancedMarker>
          );
        })}
      </Map>
    </APIProvider>
  );
}

function MapPlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-ink/5">
      <p className="text-[13px] font-medium text-ink/30">Map loads with a Google Maps API key</p>
    </div>
  );
}

// ─── Draggable bottom sheet ───────────────────────────────────────────────────

function BottomSheet({
  listings,
  active,
  y,
  vh,
  expanded,
  onToggle,
  dragControls,
  onDragEnd,
}: {
  listings: ExperienceListing[];
  active: ExperienceListing | null;
  y: ReturnType<typeof useMotionValue<number>>;
  vh: number;
  expanded: boolean;
  onToggle: () => void;
  dragControls: ReturnType<typeof useDragControls>;
  onDragEnd: (e: unknown, info: { offset: { y: number }; velocity: { y: number } }) => void;
}) {
  return (
    <motion.div
      className="absolute inset-x-0 top-0 z-30 flex flex-col overflow-hidden rounded-t-[24px] bg-paper"
      style={{ y, height: vh, boxShadow: '0 -4px 32px rgba(0,0,0,0.13)' }}
      drag="y"
      dragControls={dragControls}
      dragListener={false}
      dragConstraints={{ top: CHIP_BAR_H, bottom: vh - SHEET_PEEK }}
      dragElastic={0.06}
      onDragEnd={onDragEnd}
    >
      {/* Handle + header initiate the drag */}
      <div className="shrink-0 touch-none select-none" onPointerDown={(e) => dragControls.start(e)}>
        <div className="flex justify-center py-3">
          <div className="h-1 w-10 rounded-full bg-ink/12" />
        </div>
        <div className="flex items-center justify-between px-5 pb-3">
          <span className="text-[15px] font-semibold text-ink">
            {listings.length} home{listings.length !== 1 ? 's' : ''}
          </span>
          <button
            type="button"
            className="text-[13px] font-medium text-accent active:opacity-70"
            onClick={onToggle}
          >
            {expanded ? 'Show map' : 'Show list'}
          </button>
        </div>
      </div>

      {/* Scrollable cards */}
      <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-[calc(env(safe-area-inset-bottom)+80px)]">
        <div className="flex flex-col gap-3">
          {listings.map(l => (
            <ListingRow key={l.reference} l={l} highlighted={active?.reference === l.reference} />
          ))}
          {listings.length === 0 && (
            <p className="py-10 text-center text-[14px] text-ink/40">No homes match these filters.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function MapExplore() {
  const { listings } = useExperience();
  const [chip, setChip] = useState<ChipKey>('all');
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [active, setActive] = useState<ExperienceListing | null>(null);

  const [vh, setVh] = useState(812);
  const [expanded, setExpanded] = useState(false);
  const dragControls = useDragControls();
  const y = useMotionValue(0);
  const initialised = useRef(false);

  useEffect(() => {
    const h = window.innerHeight;
    setVh(h);
    if (!initialised.current) {
      y.set(h - SHEET_PEEK);
      initialised.current = true;
    }
  }, [y]);

  const peekY = vh - SHEET_PEEK;
  const expandY = CHIP_BAR_H;

  const snapTo = useCallback(
    (target: number) => {
      animate(y, target, { type: 'spring', damping: 30, stiffness: 280 });
      setExpanded(target === expandY);
    },
    [y, expandY],
  );

  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
      const collapse = info.velocity.y > 400 || (info.offset.y > 80 && info.velocity.y >= 0);
      snapTo(collapse ? peekY : expandY);
    },
    [snapTo, peekY, expandY],
  );

  const visible = useMemo(() => applyAll(listings, chip, filters), [listings, chip, filters]);
  const previewCount = useCallback(
    (f: Filters) => applyAll(listings, chip, f).length,
    [listings, chip],
  );

  const handleChip = useCallback((k: ChipKey) => {
    setChip(k);
    setActive(null);
  }, []);

  // Tapping a pin collapses the sheet to peek so the floating card is visible.
  const handleSelect = useCallback(
    (l: ExperienceListing) => {
      setActive(l);
      snapTo(peekY);
    },
    [snapTo, peekY],
  );

  return (
    <div className="relative h-[100svh] w-full overflow-hidden bg-paper">
      {/* Map layer */}
      <div className="absolute inset-0">
        {API_KEY ? (
          <LiveMap
            listings={visible}
            active={active}
            onSelect={handleSelect}
            onDeselect={() => setActive(null)}
          />
        ) : (
          <MapPlaceholder />
        )}
      </div>

      <ChipBar
        chip={chip}
        onChange={handleChip}
        onOpenFilters={() => setFiltersOpen(true)}
        filterCount={filtersActive(filters)}
      />

      {/* Floating card for the tapped pin — sits above the collapsed sheet */}
      <AnimatePresence>
        {active && !expanded && (
          <motion.div
            key={active.reference}
            className="absolute inset-x-4 z-40"
            style={{ bottom: SHEET_PEEK + 14 }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          >
            <div className="relative">
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="Close"
                className="absolute -top-2 right-1 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md active:scale-90"
              >
                <X className="h-3.5 w-3.5 text-ink/55" />
              </button>
              <ListingRow l={active} highlighted />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomSheet
        listings={visible}
        active={active}
        y={y}
        vh={vh}
        expanded={expanded}
        onToggle={() => snapTo(expanded ? peekY : expandY)}
        dragControls={dragControls}
        onDragEnd={handleDragEnd}
      />

      <FiltersSheet
        open={filtersOpen}
        initial={filters}
        resultCount={previewCount}
        onApply={(f) => {
          setFilters(f);
          setFiltersOpen(false);
        }}
        onClose={() => setFiltersOpen(false)}
      />
    </div>
  );
}
