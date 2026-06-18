import type { Metadata } from 'next';
import { ResultsFilterBar } from '@/components/portal/search/results-filter-bar';
import type { AgentOption } from '@/components/portal/search/property-filter-dropdowns';
import { PropertyResults } from '@/components/portal/property-results';
import type { FilterParams } from '@/components/portal/use-listing-filters';
import { getListings } from '@/lib/portal/listings';
import { getFilterOptions } from '@/lib/portal/filters';
import { getAgents, getAgencies } from '@/lib/portal/agents';
import { getDevelopers } from '@/lib/developers-data';
import { getLocale } from '@/lib/i18n/server';

export const metadata: Metadata = {
  title: 'Properties for Sale in Dubai',
  description:
    'Search ready and secondary-market properties across Dubai and the UAE. Filter by community, property type, beds, price, developer, agent and keywords.',
};

const FILTER_KEYS = [
  'q', 'source', 'type', 'category', 'beds', 'baths', 'minPrice', 'maxPrice', 'minSize', 'maxSize',
  'completion', 'verified', 'keywords', 'developers', 'agents', 'amenities',
] as const;

export default async function PropertiesPage({
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
  const [listings, options, agents, agencies] = await Promise.all([
    getListings({ purpose: 'sale', q }, locale),
    getFilterOptions(),
    getAgents(),
    getAgencies(),
  ]);

  const developerOptions = getDevelopers().map((d) => d.name);
  const agentOptions: AgentOption[] = [
    ...agencies.map((a) => ({ name: a.name, type: 'company' as const })),
    ...agents.map((a) => ({ name: a.fullName, type: 'person' as const })),
  ];

  return (
    <>
      <ResultsFilterBar
        active="properties"
        defaultQuery={q ?? ''}
        params={params}
        options={options}
        developerOptions={developerOptions}
        agentOptions={agentOptions}
      />
      <section className="container-wide py-6">
        <PropertyResults
          listings={listings}
          title={q ? `Properties for “${q}”` : 'Properties for sale in Dubai'}
          params={params}
        />
      </section>
    </>
  );
}
