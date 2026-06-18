'use client';

import Link from 'next/link';
import { Flame, CalendarClock, Wallet, Coins, ArrowUpRight } from 'lucide-react';
import { useExperience } from './experience-provider';
import { formatAed, formatCredits } from '@/lib/glass/experience-data';
import { SmartImage } from './smart-image';

export function TrendingView() {
  const { launches } = useExperience();

  return (
    <div className="no-scrollbar h-[100svh] overflow-y-scroll bg-mist pb-28">
      {/* Header */}
      <header className="bg-paper px-4 pb-3 pt-[max(18px,env(safe-area-inset-top))]">
        <div className="flex items-center gap-2">
          <Flame className="h-[22px] w-[22px] text-journey-offplan" />
          <h1 className="text-[26px] font-semibold tracking-tight text-ink">Trending</h1>
        </div>
        <p className="mt-1 text-[14px] text-graphite">Latest off-plan launches in the market</p>
      </header>

      {/* Stories rail — tap to open the launch story */}
      {launches.length > 0 && (
        <section className="no-scrollbar flex gap-3.5 overflow-x-auto bg-paper px-4 pb-4">
          {launches.map((l) => (
            <Link
              key={l.reference}
              href={`/experience/launches?start=${l.reference}`}
              className="flex w-[72px] shrink-0 flex-col items-center gap-1.5"
            >
              <span className="rounded-full bg-gradient-to-tr from-accent to-journey-offplan p-[2.5px]">
                <span className="block rounded-full bg-paper p-[2.5px]">
                  <span className="relative block h-[60px] w-[60px] overflow-hidden rounded-full bg-mist">
                    <SmartImage
                      src={l.cover}
                      alt={l.developerName ?? l.title}
                      fill
                      sizes="68px"
                      className="object-cover"
                    />
                  </span>
                </span>
              </span>
              <span className="w-full truncate text-center text-[11px] text-graphite-dark">
                {l.developerName ?? l.community}
              </span>
            </Link>
          ))}
        </section>
      )}

      {/* Trending project cards */}
      <div className="space-y-3 px-4 pt-4">
        {launches.map((l) => (
          <Link
            key={l.reference}
            href={`/experience/property/${l.reference}`}
            className="card-surface block overflow-hidden"
          >
            <div className="relative aspect-[16/10] bg-mist">
              <SmartImage src={l.cover} alt={l.title} fill sizes="100vw" className="object-cover" />
              <span className="lg-glass-dark absolute left-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-medium text-white">
                <Flame className="h-3.5 w-3.5 text-journey-offplan" /> Trending
              </span>
              {l.developerLogo && (
                <span className="lg-glass-light absolute right-3 top-3 flex h-9 items-center rounded-xl px-2">
                  <SmartImage
                    src={l.developerLogo}
                    alt={l.developerName ?? ''}
                    width={56}
                    height={20}
                    className="h-5 w-auto object-contain"
                  />
                </span>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[18px] font-semibold tracking-tight text-ink">
                  from {formatAed(l.priceAed)}
                </p>
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-[12px] font-semibold text-accent">
                  <Coins className="h-3.5 w-3.5" /> {formatCredits(l.credit.credits)}
                </span>
              </div>
              <h3 className="mt-1 text-[15px] font-medium text-ink">{l.title}</h3>
              <p className="text-[13px] text-graphite">
                {l.community}, {l.city}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 border-t border-hairline/60 pt-3 text-[12.5px] text-graphite-dark">
                {l.paymentPlan && (
                  <span className="inline-flex items-center gap-1.5">
                    <Wallet className="h-4 w-4 text-journey-offplan" /> {l.paymentPlan} plan
                  </span>
                )}
                {l.handoverBy && (
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarClock className="h-4 w-4 text-journey-offplan" /> {l.handoverBy}
                  </span>
                )}
                <span className="ml-auto inline-flex items-center gap-0.5 font-medium text-accent">
                  View <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </Link>
        ))}

        {launches.length === 0 && (
          <p className="py-16 text-center text-[14px] text-graphite">
            No trending launches right now — check back soon.
          </p>
        )}
      </div>
    </div>
  );
}
