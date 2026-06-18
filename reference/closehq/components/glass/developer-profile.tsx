import { SmartImage } from './smart-image';
import Link from 'next/link';
import { ChevronLeft, BadgeCheck, Building2, MapPin, Coins } from 'lucide-react';
import type { ExperienceListing } from '@/lib/glass/experience-data';
import { formatAed, formatCredits } from '@/lib/glass/experience-data';

export function slugifyDeveloper(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/**
 * Developer profile — the "tap a profile" surface (Instagram pattern): tapping a
 * developer anywhere opens their projects, no separate menu. Server-rendered.
 */
export function DeveloperProfile({
  name,
  logo,
  listings,
}: {
  name: string;
  logo: string | null;
  listings: ExperienceListing[];
}) {
  const communities = Array.from(new Set(listings.map((l) => l.community).filter(Boolean)));
  const offPlan = listings.filter((l) => l.completion === 'off_plan').length;
  const priceFrom = listings.length ? Math.min(...listings.map((l) => l.priceAed)) : 0;

  return (
    <div className="no-scrollbar h-[100svh] overflow-y-scroll bg-mist pb-28">
      <header className="bg-paper px-4 pb-5 pt-[max(16px,env(safe-area-inset-top))]">
        <Link
          href="/experience/trending"
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-mist text-ink active:scale-90"
        >
          <ChevronLeft className="h-6 w-6" />
        </Link>

        <div className="mt-4 flex items-center gap-4">
          <span className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-mist ring-1 ring-hairline">
            {logo ? (
              <SmartImage src={logo} alt={name} width={72} height={72} className="h-14 w-auto object-contain" />
            ) : (
              <Building2 className="h-8 w-8 text-graphite" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h1 className="truncate text-[22px] font-semibold tracking-tight text-ink">{name}</h1>
              <BadgeCheck className="h-5 w-5 shrink-0 text-journey-listing" />
            </div>
            <p className="text-[13.5px] text-graphite">Developer · Dubai, UAE</p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 divide-x divide-hairline rounded-2xl bg-mist py-3 text-center">
          <Stat value={String(listings.length)} label="Projects" />
          <Stat value={String(communities.length)} label="Communities" />
          <Stat value={priceFrom ? formatAed(priceFrom) : '—'} label="From" />
        </div>
      </header>

      <div className="px-4 pt-4">
        <h2 className="mb-2 flex items-center gap-1.5 px-1 text-[13px] font-semibold uppercase tracking-wide text-graphite">
          {offPlan > 0 ? `${offPlan} active launches` : 'Projects'}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {listings.map((l) => (
            <Link
              key={l.reference}
              href={`/experience/property/${l.reference}`}
              className="overflow-hidden rounded-2xl border border-hairline/60 bg-paper"
            >
              <div className="relative aspect-square bg-mist">
                <SmartImage src={l.cover} alt={l.title} fill sizes="50vw" className="object-cover" />
              </div>
              <div className="p-2.5">
                <p className="text-[15px] font-semibold leading-none tracking-tight text-ink">
                  {formatAed(l.priceAed)}
                </p>
                <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-accent/10 px-1.5 py-0.5 text-[11px] font-semibold text-accent">
                  <Coins className="h-3 w-3" /> {formatCredits(l.credit.credits)}
                </span>
                <p className="mt-1 line-clamp-1 flex items-center gap-1 text-[12px] text-graphite">
                  <MapPin className="h-3 w-3" /> {l.community}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="px-1">
      <p className="text-[16px] font-semibold leading-tight text-ink">{value}</p>
      <p className="text-[11.5px] text-graphite">{label}</p>
    </div>
  );
}
