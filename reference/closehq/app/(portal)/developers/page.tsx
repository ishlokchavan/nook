import type { Metadata } from 'next';
import Link from 'next/link';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDevelopers, type Developer } from '@/lib/developers-data';

export const metadata: Metadata = {
  title: 'Off-Plan Developer Discounts in Dubai',
  description:
    'Exclusive off-plan pricing and credits across Dubai developers. Talk to an iClose expert for special pricing on Emaar, Damac, Sobha, Binghatti and more.',
};

export default function DevelopersPage() {
  const developers = getDevelopers();

  return (
    <div className="container-wide py-12">
      {/* Talk-to-an-expert banner */}
      <div className="rounded-apple bg-journey-offplan/15 px-6 py-5 sm:px-8 sm:py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div className="flex items-start gap-3">
          <span className="flex items-center justify-center h-10 w-10 rounded-full bg-paper shrink-0">
            <MessageCircle className="h-5 w-5 text-ink" />
          </span>
          <div>
            <p className="text-[17px] text-ink font-medium" style={{ letterSpacing: '-0.015em' }}>
              Need off-plan advice? Talk to an expert
            </p>
            <p className="text-[14px] text-graphite-dark mt-0.5">
              Our team negotiates special pricing and credits across Dubai developers.
            </p>
          </div>
        </div>
        <Link href="/developers/enquire" className="shrink-0">
          <Button variant="primary" size="md">Talk to an expert</Button>
        </Link>
      </div>

      <header className="mb-8">
        <h1 className="display-md">Developer discounts</h1>
        <p className="subhead mt-3 max-w-2xl">
          Invest in off-plan and unlock special pricing and credits. Discounts vary by developer and
          project — our team confirms the latest on every enquiry.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {developers.map((dev) => (
          <DeveloperCard key={dev.slug} developer={dev} />
        ))}
      </div>
    </div>
  );
}

function DeveloperCard({ developer }: { developer: Developer }) {
  const isGovernment = developer.tier === 'government';

  return (
    <Link href={`/developers/${developer.slug}`} className="card-surface p-6 flex flex-col group hover:shadow-card-hover transition-shadow">
      <div className="flex items-center gap-3 mb-5">
        <span className="flex items-center justify-center h-12 w-12 rounded-xl bg-white border border-hairline/60 shrink-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={developer.logoUrl} alt={`${developer.name} logo`} className="h-9 w-9 object-contain" />
        </span>
        <div className="min-w-0">
          <span className="block text-[17px] text-ink font-medium truncate" style={{ letterSpacing: '-0.015em' }}>{developer.name}</span>
          {developer.foundedYear && <span className="text-[12px] text-graphite">Since {developer.foundedYear}</span>}
        </div>
      </div>

      {/* Credit pill (private) or "Pricing on request" (government). */}
      {isGovernment || developer.creditPct == null ? (
        <div className="rounded-xl bg-mist px-4 py-3 mb-4">
          <span className="text-[14px] text-graphite-dark">Pricing on request</span>
        </div>
      ) : (
        <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-journey-offplan/20 px-3.5 py-1.5 mb-4">
          <span className="text-[13px] text-ink">Up to</span>
          <span className="text-[15px] text-ink font-semibold">{developer.creditPct}%</span>
          <span className="text-[13px] text-ink">credits</span>
        </div>
      )}

      <p className="text-[13px] text-graphite-dark line-clamp-2 mb-5">{developer.tagline}</p>

      <span className="mt-auto inline-flex items-center justify-between text-[14px] text-accent font-medium">
        {isGovernment ? 'View developer' : 'View projects & credits'}
        <ArrowRight className="h-4 w-4 rtl:rotate-180 group-hover:translate-x-0.5 transition-transform" />
      </span>
    </Link>
  );
}
