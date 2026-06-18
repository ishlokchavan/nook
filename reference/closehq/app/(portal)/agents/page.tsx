import type { Metadata } from 'next';
import { ResultsFilterBar } from '@/components/portal/search/results-filter-bar';
import { AgentsDirectory } from '@/components/portal/agents-directory';
import type { FilterParams } from '@/components/portal/use-listing-filters';
import { getAgents, getAgencies } from '@/lib/portal/agents';
import { getFilterOptions } from '@/lib/portal/filters';

export const metadata: Metadata = {
  title: 'Find Real Estate Agents & Agencies in Dubai',
  description:
    'Browse verified Dubai real estate agents and agencies. Filter by area, property type, language and nationality.',
};

export default async function AgentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const params: FilterParams = {};
  for (const k of ['q', 'language', 'nationality']) {
    const v = sp[k];
    if (typeof v === 'string' && v) params[k] = v;
  }

  const [agents, agencies, options] = await Promise.all([getAgents(), getAgencies(), getFilterOptions()]);

  return (
    <>
      <ResultsFilterBar active="agents" defaultQuery={params.q ?? ''} params={params} options={options} />
      <section className="container-wide py-6">
        <AgentsDirectory agents={agents} agencies={agencies} params={params} />
      </section>
    </>
  );
}
