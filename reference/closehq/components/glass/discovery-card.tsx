'use client';

import { memo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  Share2,
  X,
  Info,
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  BadgeCheck,
  Coins,
  Sparkles,
} from 'lucide-react';
import type { ExperienceListing } from '@/lib/glass/experience-data';
import { formatAed, formatCredits } from '@/lib/glass/experience-data';
import { deterministicReason, likedPhrases } from '@/lib/glass/explain';
import { useSignals } from './signal-store';
import { SwipeGallery } from './swipe-gallery';

function haptic(ms = 12) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(ms);
    } catch {
      /* no-op */
    }
  }
}

function DiscoveryCardImpl({
  listing,
  active,
  saved,
  onToggleSave,
  onDislike,
  onShare,
  onDetails,
  headerOffset,
}: {
  listing: ExperienceListing;
  active: boolean;
  saved: boolean;
  onToggleSave: () => void;
  onDislike: () => void;
  onShare: () => void;
  onDetails: () => void;
  headerOffset: string;
}) {
  const href = `/experience/property/${listing.reference}`;

  const { getAffinity } = useSignals();
  const [whyOpen, setWhyOpen] = useState(false);
  const [aiReason, setAiReason] = useState<string | null>(null);
  const fetched = useRef(false);

  async function openWhy() {
    setWhyOpen((o) => !o);
    if (fetched.current) return;
    fetched.current = true;
    try {
      const res = await fetch('/api/glass/why', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          liked: likedPhrases(getAffinity()),
          listing: {
            title: listing.title,
            community: listing.community,
            city: listing.city,
            type: listing.propertyType,
            beds: listing.bedrooms,
            price: formatAed(listing.priceAed),
            hook: listing.hook,
            credits: formatCredits(listing.credit.credits),
          },
        }),
      });
      const data = (await res.json()) as { reason: string | null };
      if (data.reason) setAiReason(data.reason);
    } catch {
      /* keep the deterministic reason */
    }
  }

  return (
    <article className="lg-snap-start relative h-[100svh] w-full snap-start overflow-hidden bg-paper">
      <div
        className={`flex h-full flex-col transition-[transform,opacity] duration-300 [will-change:transform,opacity] ${
          active ? '' : 'scale-[0.96] opacity-50'
        }`}
        style={{ paddingTop: headerOffset }}
      >
        {/* Media (≈3/4 height) — swipe left/right for photos */}
        <div className="relative flex-1 overflow-hidden bg-mist">
          <SwipeGallery
            images={listing.images}
            videos={listing.videos}
            alt={listing.title}
            priority={active}
            active={active}
            indicator="bars"
            poster={listing.cover}
            onDoubleTap={() => {
              if (!saved) {
                onToggleSave();
                haptic(18);
              }
            }}
          />

          <div className="pointer-events-none absolute inset-x-0 top-0 h-20 lg-scrim-t" />

          {/* chips */}
          <div className="pointer-events-none absolute inset-x-4 top-9 flex items-center gap-2">
            <span className="lg-glass-dark rounded-full px-2.5 py-1 text-[11.5px] font-medium text-white">
              {listing.hook}
            </span>
            {listing.isVerified && (
              <span className="lg-glass-dark flex items-center gap-1 rounded-full px-2 py-1 text-[11.5px] font-medium text-white">
                <BadgeCheck className="h-3.5 w-3.5 text-journey-listing" /> Verified
              </span>
            )}
          </div>

          {/* TikTok-style right action rail — dark glass chips stay readable on any bg */}
          <div className="absolute bottom-5 right-3 flex flex-col items-center gap-3.5">
            <RailButton
              label={saved ? 'Saved' : 'Save'}
              active={saved}
              onClick={() => {
                onToggleSave();
                haptic(14);
              }}
            >
              <Heart className={`h-6 w-6 ${saved ? 'fill-white' : ''}`} />
            </RailButton>
            <RailButton label="Share" onClick={onShare}>
              <Share2 className="h-[22px] w-[22px]" />
            </RailButton>
            <RailButton label="Pass" onClick={onDislike}>
              <X className="h-6 w-6" strokeWidth={2.4} />
            </RailButton>
            <Link
              href={href}
              onClick={onDetails}
              aria-label="Details"
              className="flex flex-col items-center gap-1 active:scale-90"
            >
              <span className="lg-glass-dark flex h-11 w-11 items-center justify-center rounded-full text-white">
                <Info className="h-[22px] w-[22px]" />
              </span>
              <span className="text-[11px] font-medium text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
                Info
              </span>
            </Link>
          </div>
        </div>

        {/* Info sheet (≈1/4) */}
        <div className="shrink-0 px-4 pb-[max(96px,calc(env(safe-area-inset-bottom)+88px))] pt-3">
          <Link href={href} onClick={onDetails}>
            <div className="flex items-center gap-2.5">
              <p className="text-[24px] font-semibold leading-none tracking-tight text-ink">
                {formatAed(listing.priceAed)}
              </p>
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-[12.5px] font-semibold text-accent">
                <Coins className="h-3.5 w-3.5" /> {formatCredits(listing.credit.credits)} credits
              </span>
            </div>
            <h2 className="mt-1.5 line-clamp-1 text-[15px] font-medium text-ink">
              {listing.title}
            </h2>
            <p className="mt-0.5 flex items-center gap-1 text-[13px] text-graphite">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="line-clamp-1">
                {[listing.building, listing.community, listing.city]
                  .filter(Boolean)
                  .join(', ')}
              </span>
            </p>
            <div className="mt-2 flex items-center gap-4 text-[13px] text-graphite-dark">
              {listing.bedrooms !== null && (
                <span className="inline-flex items-center gap-1.5">
                  <BedDouble className="h-4 w-4" />
                  {listing.bedrooms === 0 ? 'Studio' : listing.bedrooms}
                </span>
              )}
              {listing.bathrooms !== null && (
                <span className="inline-flex items-center gap-1.5">
                  <Bath className="h-4 w-4" />
                  {listing.bathrooms}
                </span>
              )}
              {listing.areaSqft !== null && (
                <span className="inline-flex items-center gap-1.5">
                  <Maximize className="h-4 w-4" />
                  {listing.areaSqft.toLocaleString('en-US')} sqft
                </span>
              )}
            </div>
          </Link>

          {/* Why this fits you */}
          <button
            type="button"
            onClick={openWhy}
            aria-expanded={whyOpen}
            className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-mist px-3 py-1.5 text-[12.5px] font-medium text-graphite-dark active:scale-95"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Why this fits you
          </button>
          {whyOpen && (
            <p className="mt-2 rounded-2xl border border-accent/15 bg-accent/[0.06] px-3 py-2 text-[13px] leading-snug text-ink">
              {aiReason ?? deterministicReason(getAffinity(), listing)}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

/**
 * Memoised so recording signals / re-renders of the deck don't re-render every
 * mounted card — only the cards whose own props (active / saved) actually change.
 */
export const DiscoveryCard = memo(DiscoveryCardImpl);

function RailButton({
  label,
  onClick,
  active,
  children,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex flex-col items-center gap-1 active:scale-90"
    >
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-full text-white ${
          active ? 'bg-rose-500' : 'lg-glass-dark'
        }`}
      >
        {children}
      </span>
      <span className="text-[11px] font-medium text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
        {label}
      </span>
    </button>
  );
}
