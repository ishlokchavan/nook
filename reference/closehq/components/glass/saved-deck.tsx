'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MapPin, BedDouble, Maximize, Trash2, ArrowRight, Coins } from 'lucide-react';
import { formatAed, formatCredits } from '@/lib/glass/experience-data';
import { useExperience } from './experience-provider';
import { useSaved } from './saved-store';
import { SmartImage } from './smart-image';

export function SavedDeck() {
  const { listings } = useExperience();
  const { decisions, toggleSave } = useSaved();
  const [expanded, setExpanded] = useState(true);

  const saved = listings.filter((l) => decisions[l.reference] === 'saved');
  const totalCredits = saved.reduce((sum, l) => sum + l.credit.credits, 0);

  return (
    <div className="no-scrollbar h-[100svh] overflow-y-scroll bg-mist px-4 pb-40 pt-[max(20px,env(safe-area-inset-top))]">
      <header className="mb-4 mt-2">
        <h1 className="text-[30px] font-semibold tracking-tight text-ink">Saved</h1>
        <p className="mt-1 text-[14px] text-graphite">
          {saved.length === 0
            ? 'Homes you save will stack up here'
            : `${saved.length} ${saved.length === 1 ? 'home' : 'homes'} saved`}
        </p>
      </header>

      {/* Credits balance banner */}
      {saved.length > 0 && (
        <div className="mb-4 flex items-center justify-between rounded-[22px] bg-ink px-5 py-4 text-white">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
              <Coins className="h-5 w-5 text-journey-offplan" />
            </span>
            <div>
              <p className="text-[12px] text-white/60">Credits across your shortlist</p>
              <p className="text-[22px] font-semibold leading-tight tracking-tight">
                {formatCredits(totalCredits)}
              </p>
            </div>
          </div>
          {saved.length > 1 && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="rounded-full bg-white/15 px-3.5 py-2 text-[13px] font-medium active:scale-95"
            >
              {expanded ? 'Stack' : 'Spread'}
            </button>
          )}
        </div>
      )}

      {saved.length === 0 ? (
        <EmptyState />
      ) : (
        <div
          className="relative"
          style={{ height: expanded ? 'auto' : `${168 + (saved.length - 1) * 60}px` }}
        >
          <AnimatePresence initial={false}>
            {saved.map((listing, i) => (
              <motion.div
                key={listing.reference}
                layout
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                className={expanded ? 'mb-3' : 'absolute inset-x-0'}
                style={expanded ? undefined : { top: i * 60, zIndex: i }}
              >
                <SavedCard
                  reference={listing.reference}
                  title={listing.title}
                  price={formatAed(listing.priceAed)}
                  credits={listing.credit.credits}
                  community={listing.community ?? ''}
                  city={listing.city}
                  beds={listing.bedrooms}
                  area={listing.areaSqft}
                  image={listing.cover}
                  onRemove={() => toggleSave(listing.reference)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {saved.length > 0 && (
        <Link
          href="/experience"
          className="mt-6 flex items-center justify-center gap-2 rounded-full bg-ink py-4 text-[15px] font-semibold text-white active:scale-95"
        >
          Start a commission-free deal
          <ArrowRight className="h-[18px] w-[18px]" />
        </Link>
      )}
    </div>
  );
}

function SavedCard({
  reference,
  title,
  price,
  credits,
  community,
  city,
  beds,
  area,
  image,
  onRemove,
}: {
  reference: string;
  title: string;
  price: string;
  credits: number;
  community: string;
  city: string;
  beds: number | null;
  area: number | null;
  image: string;
  onRemove: () => void;
}) {
  return (
    <div className="card-surface relative overflow-hidden">
      <Link href={`/experience/property/${reference}`} className="flex gap-3 p-3">
        <div className="relative h-[122px] w-[112px] shrink-0 overflow-hidden rounded-2xl bg-mist">
          <SmartImage src={image} alt={title} fill sizes="120px" className="object-cover" />
        </div>
        <div className="min-w-0 flex-1 py-1">
          <p className="text-[19px] font-semibold leading-none tracking-tight text-ink">
            {price}
          </p>
          <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[12px] font-semibold text-accent">
            <Coins className="h-3 w-3" /> {formatCredits(credits)} credits
          </span>
          <h3 className="mt-1.5 line-clamp-1 text-[14px] font-medium text-ink">{title}</h3>
          <p className="mt-0.5 flex items-center gap-1 text-[12px] text-graphite">
            <MapPin className="h-3 w-3" /> {community}, {city}
          </p>
          <div className="mt-1.5 flex gap-3 text-[12px] text-graphite-dark">
            {beds !== null && (
              <span className="flex items-center gap-1">
                <BedDouble className="h-3.5 w-3.5" />
                {beds === 0 ? 'Studio' : `${beds} bed`}
              </span>
            )}
            {area !== null && (
              <span className="flex items-center gap-1">
                <Maximize className="h-3.5 w-3.5" />
                {area.toLocaleString()} sqft
              </span>
            )}
          </div>
        </div>
      </Link>
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove from shortlist"
        className="lg-glass-light absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-graphite-dark active:scale-90"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="card-surface mt-2 flex flex-col items-center gap-4 px-6 py-14 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
        <Heart className="h-7 w-7 text-accent" />
      </span>
      <p className="text-[17px] font-semibold text-ink">No saved homes yet</p>
      <p className="max-w-[240px] text-[14px] text-graphite">
        Swipe right or tap the heart on a home you love and it&rsquo;ll appear here —
        along with the credits you&rsquo;d earn.
      </p>
      <Link
        href="/experience"
        className="mt-1 rounded-full bg-ink px-6 py-3 text-[15px] font-semibold text-white active:scale-95"
      >
        Start discovering
      </Link>
    </div>
  );
}
