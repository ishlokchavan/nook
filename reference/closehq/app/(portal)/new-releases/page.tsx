import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { ResultsFilterBar } from '@/components/portal/search/results-filter-bar';
import { ProjectResults } from '@/components/portal/project-results';
import type { FilterParams } from '@/components/portal/use-listing-filters';
import { getListings } from '@/lib/portal/listings';
import { getFilterOptions } from '@/lib/portal/filters';
import { getRandomExpert } from '@/lib/portal/experts';
import { getLocale } from '@/lib/i18n/server';

export const metadata: Metadata = {
  title: 'New Releases & Off-Plan Projects in Dubai',
  description:
    'Discover new off-plan launches in Dubai. Filter by handover date, payment plan and completion. Invest in off-plan for special pricing and credits.',
};

const FILTER_KEYS = ['q', 'type', 'handover', 'paymentPlan', 'minPrice', 'maxPrice', 'city'] as const;

export default async function NewReleasesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const params: FilterParams = {};
  for (const k of FILTER_KEYS) {
    const v = sp[k];
    if (typeof v === 'string' && v) params[k] = v;
  }

  const locale = await getLocale();
  const q = params.q;
  const [projects, options] = await Promise.all([
    getListings({ completion: 'off_plan', q }, locale),
    getFilterOptions(),
  ]);

  return (
    <>
      <ResultsFilterBar active="new-releases" defaultQuery={q ?? ''} params={params} options={options} />
      <section className="container-wide py-6">
        {/* Ask iExpert — connects to the internal iClose team (not a third party). */}
        <Link href="/developers/enquire" className="mb-6 flex items-center gap-3 card-surface px-5 py-4 hover:shadow-card-hover transition-shadow">
          <span className="flex items-center justify-center h-9 w-9 rounded-full bg-journey-offplan/20 shrink-0">
            <Sparkles className="h-4 w-4 text-ink" />
          </span>
          <div className="flex-1">
            <p className="text-[15px] text-ink font-medium" style={{ letterSpacing: '-0.01em' }}>
              Ask iExpert — talk to our team
            </p>
            <p className="text-[13px] text-graphite">
              Our in-house experts match you to off-plan projects and confirm credits — no third parties.
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-graphite rtl:rotate-180 shrink-0" />
        </Link>

        <ProjectResults projects={projects} params={params} expert={getRandomExpert()} />
      </section>
    </>
  );
}
