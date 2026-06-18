'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { useExperience } from './experience-provider';
import { useSaved } from './saved-store';
import { useSignals } from './signal-store';
import { DiscoveryCard } from './discovery-card';
import { TastePicker } from './taste-picker';
import { IntroStory } from './intro-story';
import type { ExperienceListing } from '@/lib/glass/experience-data';

const HEADER_OFFSET = 'calc(env(safe-area-inset-top) + 52px)';
const QUICK_SKIP_MS = 2500;

export function DiscoveryDeck() {
  const router = useRouter();
  const { listings } = useExperience();
  const { isSaved, toggleSave } = useSaved();
  const { rank, track, score, dismissed, seedVersion } = useSignals();

  // Initial personalised order (computed once from stored affinity).
  const [order, setOrder] = useState<ExperienceListing[]>(() => rank(listings));
  const [activeIndex, setActiveIndex] = useState(0);
  // Mirror for stable callbacks that shouldn't re-run on every scroll step.
  const activeIndexRef = useRef(0);
  activeIndexRef.current = activeIndex;

  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dwell = useRef<{ ref: string; since: number } | null>(null);

  // Finalise the dwell on a card we're leaving: long look = positive, quick
  // flick = a skip (rejection-engine signal).
  const closeDwell = useCallback(
    (nextRef: string | null) => {
      const prev = dwell.current;
      if (prev && prev.ref !== nextRef) {
        const ms = Date.now() - prev.since;
        const listing = order.find((l) => l.reference === prev.ref);
        if (listing) {
          if (ms < QUICK_SKIP_MS) track('skip', listing);
          else track('dwell', listing, ms);
        }
      }
    },
    [order, track],
  );

  // Observe which card is centred → active.
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio >= 0.6) {
            const idx = Number((e.target as HTMLElement).dataset.idx);
            setActiveIndex(idx);
          }
        }
      },
      { root, threshold: [0.6] },
    );
    cardRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [order]);

  // When the active card changes, record the dwell on the previous one.
  useEffect(() => {
    const current = order[activeIndex];
    if (!current) return;
    closeDwell(current.reference);
    dwell.current = { ref: current.reference, since: Date.now() };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  // Warm the detail route for the current + next card so tapping through is
  // instant instead of waiting on a server round-trip.
  useEffect(() => {
    const cur = order[activeIndex];
    const nxt = order[activeIndex + 1];
    if (cur) router.prefetch(`/experience/property/${cur.reference}`);
    if (nxt) router.prefetch(`/experience/property/${nxt.reference}`);
  }, [activeIndex, order, router]);

  // Re-rank the *upcoming* cards as affinity shifts, without disturbing the
  // card the user is currently on.
  const reorderUpcoming = useCallback(() => {
    setOrder((prev) => {
      const cut = activeIndexRef.current + 1;
      const head = prev.slice(0, cut);
      const headRefs = new Set(head.map((l) => l.reference));
      const tail = prev
        .slice(cut)
        .filter((l) => !dismissed.has(l.reference) && !headRefs.has(l.reference))
        .sort((a, b) => score(b) - score(a) + (Math.random() - 0.5) * 4);
      return [...head, ...tail];
    });
  }, [dismissed, score]);

  function handleSave(listing: ExperienceListing) {
    const wasSaved = isSaved(listing.reference);
    toggleSave(listing.reference);
    if (!wasSaved) track('save', listing);
    reorderUpcoming();
  }

  function handleDislike(listing: ExperienceListing, idx: number) {
    track('dislike', listing);
    // Drop it from the deck and advance to the next card.
    setOrder((prev) => prev.filter((l) => l.reference !== listing.reference));
    const next = cardRefs.current[idx + 1] ?? cardRefs.current[idx];
    next?.scrollIntoView({ behavior: 'smooth' });
  }

  function handleShare(listing: ExperienceListing) {
    track('share', listing);
    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}/experience/property/${listing.reference}`
        : '';
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      navigator.share?.({ title: listing.title, url }).catch(() => {});
    }
  }

  const showHint = useMemo(() => order.length > 0, [order.length]);

  // Re-rank once when the taste picker seeds affinity (or activity is reset),
  // so the cold-start feed reflects the chosen taste immediately.
  useEffect(() => {
    if (seedVersion === 0) return;
    setOrder(rank(listings));
    setActiveIndex(0);
    scrollerRef.current?.scrollTo({ top: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seedVersion]);

  return (
    <div className="relative h-[100svh] w-full overflow-hidden bg-paper">
      {/* Flat top header — logo left, search right, content begins below it. */}
      <header
        className="lg-glass-light absolute inset-x-0 top-0 z-30 flex items-center justify-between rounded-none border-x-0 border-t-0 px-4"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 8px)', paddingBottom: 8 }}
      >
        <span className="text-[20px] font-semibold tracking-tight text-ink">iClose</span>
        <Link
          href="/experience/search"
          aria-label="Search"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/[0.06] text-ink active:scale-90"
        >
          <Search className="h-[20px] w-[20px]" strokeWidth={2} />
        </Link>
      </header>

      {/* Full-screen snap deck */}
      <div
        ref={scrollerRef}
        className="lg-snap-y no-scrollbar h-full w-full overflow-y-scroll overscroll-y-contain"
      >
        {order.map((listing, idx) => {
          // Windowing: only mount the heavy card (gallery, video, images) for
          // the cards near the viewport. Off-window slots keep their full
          // height so scroll position and snap points stay exact.
          const inWindow = idx >= activeIndex - 1 && idx <= activeIndex + 2;
          return (
            <div
              key={listing.reference}
              data-idx={idx}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              className="h-[100svh] w-full snap-start"
            >
              {inWindow ? (
                <DiscoveryCard
                  listing={listing}
                  active={idx === activeIndex}
                  saved={isSaved(listing.reference)}
                  headerOffset={HEADER_OFFSET}
                  onToggleSave={() => handleSave(listing)}
                  onDislike={() => handleDislike(listing, idx)}
                  onShare={() => handleShare(listing)}
                  onDetails={() => track('details', listing)}
                />
              ) : null}
            </div>
          );
        })}

        {/* End cap */}
        <section className="lg-snap-start flex h-[100svh] snap-start flex-col items-center justify-center gap-3 bg-paper px-8 text-center">
          <p className="text-[22px] font-semibold tracking-tight text-ink">
            That&rsquo;s everything for now
          </p>
          <p className="max-w-xs text-[14px] text-graphite">
            Your feed reorders as you save, skip and explore. Come back for fresh
            matches.
          </p>
          <Link
            href="/experience/saved"
            className="mt-2 rounded-full bg-ink px-6 py-3 text-[15px] font-medium text-white active:scale-95"
          >
            Review saved
          </Link>
          <button
            type="button"
            onClick={() => {
              setOrder(rank(listings));
              cardRefs.current[0]?.scrollIntoView();
            }}
            className="text-[14px] font-medium text-accent"
          >
            Start over
          </button>
        </section>
      </div>

      {/* one-time swipe-up hint */}
      {showHint && activeIndex === 0 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-24 z-20 flex justify-center">
          <span className="lg-glass-light rounded-full px-3.5 py-1.5 text-[12px] font-medium text-graphite-dark">
            Swipe up for the next home
          </span>
        </div>
      )}

      {/* First run: brand intro (what & why) → taste picker (personalise) */}
      <TastePicker />
      <IntroStory />
    </div>
  );
}
