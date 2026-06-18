import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, ArrowRight, MessageCircle, Building2, CalendarClock, Layers, Tag, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDeveloperBySlug, getDeveloperSlugs } from '@/lib/developers-data';

export function generateStaticParams() {
  return getDeveloperSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const dev = getDeveloperBySlug(slug);
  if (!dev) return { title: 'Developer not found' };
  return {
    title: `${dev.name} — Off-Plan Projects & Credits`,
    description: `${dev.name}: ${dev.tagline} Explore projects and unlock iClose credits — talk to an off-plan expert.`,
  };
}

function aed(n: number): string {
  return n >= 1_000_000 ? `AED ${(n / 1_000_000).toFixed(2)}M` : `AED ${n.toLocaleString('en-US')}`;
}

export default async function DeveloperDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dev = getDeveloperBySlug(slug);
  if (!dev) notFound();

  const isGovernment = dev.tier === 'government';
  const stats = [
    { icon: CalendarClock, label: 'Founded', value: dev.foundedYear ?? '—' },
    { icon: Building2, label: 'Active projects', value: dev.projects },
    { icon: Layers, label: 'Available units', value: dev.units },
    { icon: Tag, label: 'From', value: aed(dev.minPriceAed) },
  ];

  return (
    <div>
      {/* Banner */}
      <div className="relative h-48 sm:h-64 bg-mist overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={dev.bannerUrl} alt={`${dev.name} banner`} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <div className="container-wide">
        <Link href="/developers" className="inline-flex items-center gap-1 text-[14px] text-graphite hover:text-ink mt-5">
          <ChevronLeft className="h-4 w-4 rtl:rotate-180" /> All developers
        </Link>

        {/* Header: logo + name + credits */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 -mt-2 mt-6">
          <div className="flex items-center gap-4">
            <span className="flex items-center justify-center h-20 w-20 rounded-2xl bg-white border border-hairline shadow-card shrink-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={dev.logoUrl} alt={`${dev.name} logo`} className="h-14 w-14 object-contain" />
            </span>
            <div>
              <h1 className="display-sm">{dev.name}</h1>
              <p className="text-[15px] text-graphite-dark mt-1 max-w-xl">{dev.tagline}</p>
            </div>
          </div>
          {!isGovernment && dev.creditPct != null && (
            <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-journey-offplan/20 px-4 py-2 shrink-0">
              <span className="text-[14px] text-ink">Up to</span>
              <span className="text-[18px] text-ink font-semibold">{dev.creditPct}%</span>
              <span className="text-[14px] text-ink">credits with iClose</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {stats.map((s) => (
            <div key={s.label} className="card-surface p-5">
              <s.icon className="h-5 w-5 text-graphite mb-2" />
              <div className="text-[12px] text-graphite">{s.label}</div>
              <div className="text-[18px] font-semibold text-ink mt-0.5">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Projects → Enquire */}
        <section className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 card-surface p-6">
            <h2 className="text-[18px] font-semibold text-ink mb-2" style={{ letterSpacing: '-0.015em' }}>Projects</h2>
            <p className="text-[14px] text-graphite-dark mb-5">
              Explore {dev.name}&apos;s off-plan launches{!isGovernment && dev.creditPct != null ? <> and unlock up to {dev.creditPct}% in iClose credits</> : null}.
            </p>
            <Link href={`/new-releases?q=${encodeURIComponent(dev.name)}`}>
              <Button variant="outline" size="md" className="w-full sm:w-auto justify-between">
                View {dev.name} projects <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Button>
            </Link>
            {dev.website && (
              <a href={dev.website} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-graphite hover:text-ink">
                <Globe className="h-3.5 w-3.5" /> Official website
              </a>
            )}
          </div>

          {/* Talk to an expert (internal team handoff) */}
          <aside className="card-surface p-6 bg-ink text-white flex flex-col">
            <MessageCircle className="h-6 w-6 mb-3" />
            <h2 className="text-[18px] font-semibold">Talk to an expert</h2>
            <p className="text-[14px] text-white/70 mt-2 flex-1">
              Our off-plan team negotiates {dev.name} pricing and confirms your credits — no commission.
            </p>
            <Link href={`/developers/enquire?dev=${encodeURIComponent(dev.name)}`} className="mt-5">
              <Button variant="primary" size="md" className="w-full">Enquire about {dev.name}</Button>
            </Link>
          </aside>
        </section>

        <div className="pb-16" />
      </div>
    </div>
  );
}
