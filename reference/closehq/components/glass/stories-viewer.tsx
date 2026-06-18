'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X, Heart, CalendarClock, Wallet, ArrowUpRight, Coins } from 'lucide-react';
import { formatAed, formatCredits } from '@/lib/glass/experience-data';
import type { ExperienceListing } from '@/lib/glass/experience-data';
import { useSaved } from './saved-store';
import { SmartImage } from './smart-image';

const STORY_MS = 6000;
const TICK = 50;

export function StoriesViewer({
  launches,
  startReference,
}: {
  launches: ExperienceListing[];
  startReference?: string;
}) {
  const router = useRouter();
  const { isSaved, toggleSave } = useSaved();

  const [index, setIndex] = useState(() => {
    const i = startReference
      ? launches.findIndex((l) => l.reference === startReference)
      : 0;
    return i >= 0 ? i : 0;
  });
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const elapsed = useRef(0);

  const next = useCallback(() => {
    setProgress(0);
    elapsed.current = 0;
    setIndex((i) => {
      if (i + 1 >= launches.length) {
        router.push('/experience');
        return i;
      }
      return i + 1;
    });
  }, [launches.length, router]);

  const prev = useCallback(() => {
    setProgress(0);
    elapsed.current = 0;
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  // Timed autoplay for the current story.
  useEffect(() => {
    if (paused || launches.length === 0) return;
    const id = setInterval(() => {
      elapsed.current += TICK;
      const pct = Math.min(100, (elapsed.current / STORY_MS) * 100);
      setProgress(pct);
      if (pct >= 100) next();
    }, TICK);
    return () => clearInterval(id);
  }, [index, paused, next, launches.length]);

  if (launches.length === 0) {
    return (
      <div className="flex h-[100svh] items-center justify-center bg-zinc-950 px-8 text-center text-white/70">
        No new launches right now — check back soon.
      </div>
    );
  }

  const launch = launches[index];
  const saved = isSaved(launch.reference);

  return (
    <div className="relative h-[100svh] w-full overflow-hidden bg-black">
      <SmartImage
        src={launch.cover}
        alt={launch.title}
        fill
        priority
        sizes="(max-width: 520px) 100vw, 520px"
        className="object-cover"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 lg-scrim-t" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] lg-scrim-b" />

      {/* Progress segments */}
      <div className="absolute inset-x-3 top-[max(12px,env(safe-area-inset-top))] z-30 flex gap-1.5">
        {launches.map((l, i) => (
          <span
            key={l.reference}
            className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30"
          >
            <span
              className="block h-full rounded-full bg-white"
              style={{
                width: i < index ? '100%' : i === index ? `${progress}%` : '0%',
                transition: i === index ? 'width 50ms linear' : 'none',
              }}
            />
          </span>
        ))}
      </div>

      {/* Header */}
      <div className="absolute inset-x-4 top-9 z-30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="lg-glass flex h-10 w-10 items-center justify-center overflow-hidden rounded-full">
            {launch.developerLogo ? (
              <Image
                src={launch.developerLogo}
                alt={launch.developerName ?? ''}
                width={28}
                height={28}
                className="h-7 w-7 object-contain"
              />
            ) : (
              <span className="text-[13px] font-semibold text-white">iC</span>
            )}
          </span>
          <div>
            <p className="text-[14px] font-semibold leading-tight text-white">
              {launch.developerName ?? 'New release'}
            </p>
            <p className="text-[12px] text-white/65">{launch.community}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => router.push('/experience')}
          aria-label="Close"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur active:scale-90"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Tap zones (with press-and-hold pause) */}
      <button
        type="button"
        aria-label="Previous"
        onClick={prev}
        onPointerDown={() => setPaused(true)}
        onPointerUp={() => setPaused(false)}
        onPointerLeave={() => setPaused(false)}
        className="absolute inset-y-0 left-0 z-20 w-1/3"
      />
      <button
        type="button"
        aria-label="Next"
        onClick={next}
        onPointerDown={() => setPaused(true)}
        onPointerUp={() => setPaused(false)}
        onPointerLeave={() => setPaused(false)}
        className="absolute inset-y-0 right-0 z-20 w-2/3"
      />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 z-30 px-5 pb-32">
        <span className="lg-glass-dark inline-block rounded-full px-3 py-1 text-[12px] font-medium text-white">
          Off-plan launch
        </span>
        <h1 className="mt-3 text-[26px] font-semibold leading-tight tracking-tight text-white">
          {launch.title}
        </h1>
        <p className="mt-1.5 text-[18px] font-medium text-white/90">
          from {formatAed(launch.priceAed)}
        </p>

        {/* Credits hook */}
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-2">
          <Coins className="h-4 w-4 text-accent" />
          <span className="text-[14px] font-semibold tracking-tight text-accent">
            Earn {formatCredits(launch.credit.credits)} credits
          </span>
        </div>

        <div className="mt-4 flex gap-2.5">
          {launch.paymentPlan && (
            <span className="lg-glass flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] text-white">
              <Wallet className="h-4 w-4 text-journey-offplan" />
              {launch.paymentPlan} plan
            </span>
          )}
          {launch.handoverBy && (
            <span className="lg-glass flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] text-white">
              <CalendarClock className="h-4 w-4 text-journey-offplan" />
              {launch.handoverBy}
            </span>
          )}
        </div>

        <div className="mt-5 flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => toggleSave(launch.reference)}
            className={`flex h-12 w-12 items-center justify-center rounded-full active:scale-90 ${
              saved ? 'bg-journey-buyer text-ink' : 'lg-glass-strong text-white'
            }`}
            aria-label={saved ? 'Saved' : 'Save'}
          >
            <Heart className={`h-5 w-5 ${saved ? 'fill-ink' : ''}`} />
          </button>
          <Link
            href={`/experience/property/${launch.reference}`}
            className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-full bg-white text-[15px] font-semibold text-ink active:scale-[0.98]"
          >
            View home
            <ArrowUpRight className="h-[18px] w-[18px]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
