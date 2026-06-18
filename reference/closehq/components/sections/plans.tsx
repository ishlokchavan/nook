'use client';

import { motion } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import { MobileCarousel } from '@/components/ui/mobile-carousel';
import type { MembershipPlan } from '@/lib/supabase';

interface Plan {
  key: string;
  label: string;
  tagline: string;
  price: string;
  cadence?: string;
  splitPct: number;
  features: string[];
  isStar: boolean;
}

function toDisplayPlan(p: MembershipPlan): Plan {
  const isFree = p.billing_cycle === 'free' || (!p.price_yearly_aed && !p.price_monthly_aed);
  const priceNum = p.price_yearly_aed ?? p.price_monthly_aed;
  return {
    key: p.key,
    label: p.label,
    tagline: p.tagline ?? '',
    price: isFree ? 'Free' : `AED ${Number(priceNum).toLocaleString('en-AE')}`,
    cadence: isFree ? undefined : p.billing_cycle === 'yearly' ? '/ year' : '/ month',
    splitPct: p.agent_split_pct,
    features: p.features_json ?? [],
    isStar: p.is_star,
  };
}

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div
      className={
        plan.isStar
          ? 'card-surface ring-2 ring-ink p-6 md:p-8 lg:p-7 xl:p-8 flex flex-col h-full'
          : 'card-surface p-6 md:p-8 lg:p-7 xl:p-8 flex flex-col h-full'
      }
    >
      <div className="h-6 mb-3 flex items-center">
        {plan.isStar && (
          <span className="px-3 py-1 rounded-full bg-ink text-white text-[12px] font-medium tracking-tight whitespace-nowrap">
            Most popular
          </span>
        )}
      </div>

      <p className="text-sm font-medium text-graphite tracking-tight">{plan.label}</p>

      <div className="mt-3 flex items-baseline gap-1.5 flex-wrap">
        <span
          className="font-display font-semibold text-ink"
          style={{ fontSize: 'clamp(1.625rem, 2.4vw, 2.25rem)', letterSpacing: '-0.025em', lineHeight: 1 }}
        >
          {plan.price}
        </span>
        {plan.cadence && (
          <span className="text-sm text-graphite tracking-tight">{plan.cadence}</span>
        )}
      </div>

      <p className="mt-4 text-[15px] text-graphite-dark leading-[1.45] min-h-[3em]" style={{ letterSpacing: '-0.012em' }}>
        {plan.tagline}
      </p>

      <div className="hairline my-6" />

      <ul className="space-y-2.5 mb-8 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-[15px] text-ink" style={{ letterSpacing: '-0.012em' }}>
            <Check className="h-4 w-4 mt-0.5 text-ink flex-shrink-0" strokeWidth={2.5} />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="hairline mb-6" />

      <div className="flex items-baseline justify-between mb-6">
        <span className="text-sm text-graphite tracking-tight">Transaction split</span>
        <span className="text-[17px] font-medium text-ink tabular-nums" style={{ letterSpacing: '-0.012em' }}>
          {plan.splitPct} / {100 - plan.splitPct}
        </span>
      </div>

      <a href="#apply" className="applelink mt-auto">
        Get started
        <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
      </a>
    </div>
  );
}

export function Plans({ data }: { data: MembershipPlan[] }) {
  const plans = data.map(toDisplayPlan);
  const cards = plans.map((plan) => <PlanCard key={plan.key} plan={plan} />);

  return (
    <section id="plans" className="bg-paper py-16 sm:py-20 md:py-24 lg:py-32">
      <div className="container-wide">
        <div className="max-w-3xl mb-14 md:mb-20">
          <Reveal>
            <h2 className="display-lg text-balance">
              Choose the level of access that fits where you are.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="subhead mt-5 max-w-2xl">
              Every tier starts with community access and the education platform. As you go deeper, you get more, better Specialist matching, dedicated support, and an increasing share of any transaction you close.
            </p>
          </Reveal>
        </div>

        {/* Mobile carousel */}
        <MobileCarousel
          items={cards}
          className="md:hidden"
          ariaLabel="Membership plans"
        />

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 pt-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <PlanCard plan={plan} />
            </motion.div>
          ))}
        </div>

        <p className="mt-10 text-[14px] text-graphite tracking-tight">
          Transaction splits apply when a deal closes through the platform. Community access and education are available on every plan regardless of transaction activity.
        </p>
      </div>
    </section>
  );
}
