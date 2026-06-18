'use client';

import { motion } from 'framer-motion';
import { MapPin, UserCheck, Sparkles } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';

const ACADEMY_TOPICS = [
  'Area guides, Palm, Downtown, Marina, Hills, Creek, and more',
  'Authority playbooks, own your patch',
  'Live developer briefings & launch calendars',
];

const COACH_TOPICS = [
  'Sourced from all developers',
  'Direct line to launch allocations and priority units',
  'Handles paperwork, NOCs, and developer follow-ups for you',
  'Stays with you long-term, no churn, no handoffs',
];

const REWARDS = [
  'Loyalty rewards on retained volume',
  'Recurring performance bonuses',
  '5% lifetime referral on every agent you bring',
];

export function Training() {
  return (
    <section id="training" className="bg-paper py-16 sm:py-20 md:py-24 lg:py-32">
      <div className="container-wide">
        <div className="max-w-3xl mb-14 md:mb-20">
          <Reveal>
            <p className="text-base font-medium text-graphite tracking-tight mb-4">
              Included from Pro
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="display-lg text-balance">
              Built to make you better.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="subhead mt-6 max-w-2xl">
              Live training, area authority playbooks, and a relationship manager pulled from Dubai’s top developers. The infrastructure that turns a freelance broker into a long-term operator.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <TrainingCard
            icon={<MapPin className="h-5 w-5" strokeWidth={2} />}
            eyebrow="iClose Academy"
            title="Own your patch."
            body="Become the broker buyers ask for by name. Deep-dive area guides and the authority frameworks top performers use to dominate a community."
            topics={ACADEMY_TOPICS}
            delay={0}
          />
          <TrainingCard
            icon={<UserCheck className="h-5 w-5" strokeWidth={2} />}
            eyebrow="Your dedicated relationship manager"
            title="Direct line to every developer."
            body="A senior RM hired straight from Dubai’s top developers. They open doors to launch units, push your paperwork through, and handle whatever it takes to get the deal closed."
            topics={COACH_TOPICS}
            featured
            delay={0.08}
          />
          <TrainingCard
            icon={<Sparkles className="h-5 w-5" strokeWidth={2} />}
            eyebrow="Rewards that compound"
            title="Get rewarded for staying."
            body="The longer you operate on iClose, the more you earn, beyond the commission split. Loyalty, recurring performance, and lifetime referrals stack."
            topics={REWARDS}
            delay={0.16}
          />
        </div>
      </div>
    </section>
  );
}

function TrainingCard({
  icon,
  eyebrow,
  title,
  body,
  topics,
  featured,
  delay = 0,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  body: string;
  topics: string[];
  featured?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={
        featured
          ? 'card-surface ring-1 ring-ink p-6 sm:p-8 md:p-10 flex flex-col'
          : 'card-mist p-6 sm:p-8 md:p-10 flex flex-col'
      }
    >
      <div
        className={
          'inline-flex h-10 w-10 items-center justify-center rounded-full mb-6 ' +
          (featured ? 'bg-ink text-white' : 'bg-paper text-ink border border-hairline')
        }
      >
        {icon}
      </div>
      <p className="text-sm font-medium text-graphite tracking-tight">{eyebrow}</p>
      <h3 className="display-sm mt-2">{title}</h3>
      <p
        className="mt-4 text-[17px] text-graphite-dark leading-[1.5]"
        style={{ letterSpacing: '-0.012em' }}
      >
        {body}
      </p>
      <div className="hairline my-7" />
      <ul className="space-y-2.5">
        {topics.map((t) => (
          <li
            key={t}
            className="flex items-start gap-2.5 text-[15px] text-ink"
            style={{ letterSpacing: '-0.012em' }}
          >
            <span className="h-1 w-1 mt-2.5 rounded-full bg-ink flex-shrink-0" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
