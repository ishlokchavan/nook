'use client';

import { motion } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';

const OFFPLAN_BENEFITS = [
  'Paid the day buyer signs',
  'Up to 100% commission',
  'Developer access',
  'Early launch priority',
];

const SECONDARY_BENEFITS = [
  'Up to 100% commission',
  'Paid in 24 hours',
  'Yacht, car & rentals',
  'No capital required',
];

function PathCard({
  eyebrow,
  title,
  benefits,
  delay = 0,
}: {
  eyebrow: string;
  title: string;
  benefits: string[];
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className="card-surface p-8 sm:p-10 md:p-12 lg:p-14 flex flex-col"
    >
      <p className="text-base font-medium text-graphite tracking-tight">{eyebrow}</p>
      <h3 className="display-md mt-3 mb-8">{title}</h3>

      <ul className="space-y-4 mb-10">
        {benefits.map((benefit) => (
          <li key={benefit} className="flex items-start gap-3 text-[17px] text-ink" style={{ letterSpacing: '-0.012em' }}>
            <Check className="h-5 w-5 mt-0.5 flex-shrink-0 text-ink" strokeWidth={2} />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>

      <a href="#apply" className="applelink mt-auto">
        Get started
        <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
      </a>
    </motion.div>
  );
}

export function AgentTypes() {
  return (
    <section className="bg-mist py-16 sm:py-20 md:py-24 lg:py-32">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto text-center mb-14 md:mb-20">
          <Reveal>
            <h2 className="display-lg text-balance">
              Off-plan or secondary. Same 100%.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="subhead mt-6 mx-auto max-w-2xl">
              Pick the lane that matches how you work today. The economics are identical.
            </p>
          </Reveal>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
          <PathCard
            eyebrow="Off-Plan"
            title="Pre-launch units, developer networks."
            benefits={OFFPLAN_BENEFITS}
          />
          <PathCard
            eyebrow="Secondary"
            title="Resale homes, quick closings."
            benefits={SECONDARY_BENEFITS}
            delay={0.1}
          />
        </div>
      </div>
    </section>
  );
}
