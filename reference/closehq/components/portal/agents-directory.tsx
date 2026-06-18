'use client';

import { useState } from 'react';
import { User, Building2, BadgeCheck, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FilterParams } from '@/components/portal/use-listing-filters';
import type { Agent, Agency } from '@/lib/portal/agents';

type Tab = 'agents' | 'companies';

/** Agents | Companies sub-tab toggle + result cards (filtered by language/nationality). */
export function AgentsDirectory({ agents, agencies, params = {} }: { agents: Agent[]; agencies: Agency[]; params?: FilterParams }) {
  const [tab, setTab] = useState<Tab>('agents');

  const { language, nationality } = params;
  const filteredAgents = agents.filter((a) => {
    if (language && !a.languages.includes(language)) return false;
    if (nationality && a.nationality !== nationality) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-6 border-b border-hairline">
        {(['agents', 'companies'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'pb-3 -mb-px text-[15px] capitalize border-b-2 transition-colors',
              tab === t ? 'border-accent text-ink font-medium' : 'border-transparent text-graphite hover:text-ink',
            )}
          >
            {t} <span className="text-graphite">({t === 'agents' ? filteredAgents.length : agencies.length})</span>
          </button>
        ))}
      </div>

      {tab === 'agents' ? (
        filteredAgents.length === 0 ? (
          <div className="card-mist rounded-apple px-6 py-10 text-center text-[14px] text-graphite-dark">
            No agents match these filters.
          </div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAgents.map((agent) => (
            <article key={agent.id} className="card-surface p-5">
              <div className="flex items-center gap-4">
                <span className="flex items-center justify-center h-14 w-14 rounded-full bg-mist text-hairline shrink-0">
                  <User className="h-6 w-6" />
                </span>
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-[15px] text-ink font-medium" style={{ letterSpacing: '-0.01em' }}>
                    <span className="truncate">{agent.fullName}</span>
                    {agent.isVerified && <BadgeCheck className="h-4 w-4 text-journey-listing shrink-0" />}
                  </p>
                  {agent.agencyName && <p className="text-[13px] text-graphite truncate">{agent.agencyName}</p>}
                  {agent.reraNo && <p className="text-[12px] text-graphite mt-0.5">BRN {agent.reraNo.replace('BRN-', '')}</p>}
                </div>
              </div>
              {agent.areas.length > 0 && (
                <p className="flex items-center gap-1.5 text-[13px] text-graphite-dark mt-3">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{agent.areas.join(', ')}</span>
                </p>
              )}
              {agent.languages.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {agent.languages.map((l) => (
                    <span key={l} className="rounded-full border border-hairline px-2.5 py-1 text-[12px] text-ink/70">{l}</span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
        )
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {agencies.map((agency) => (
            <article key={agency.id} className="card-surface p-5 flex items-center gap-4">
              <span className="flex items-center justify-center h-14 w-14 rounded-full bg-mist text-hairline shrink-0">
                <Building2 className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <p className="text-[15px] text-ink font-medium truncate" style={{ letterSpacing: '-0.01em' }}>{agency.name}</p>
                <p className="text-[13px] text-graphite">{agency.agentsCount} agents</p>
                {agency.areas.length > 0 && (
                  <p className="text-[12px] text-graphite mt-0.5 truncate">{agency.areas.join(', ')}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
