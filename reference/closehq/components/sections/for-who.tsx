'use client';

import { motion } from 'framer-motion';
import { Briefcase, Award, GraduationCap } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import { MobileCarousel } from '@/components/ui/mobile-carousel';

const AUDIENCES = [
  {
    icon: Briefcase,
    tag: 'For Professionals',
    headline: 'Your Clients Deserve the Best Experts.',
    body: "As a lawyer, accountant, financial advisor, family office, etc. your clients trust you with their investments. When they need an asset, you need an expert who can assist you. iClose connects you to vetted Specialists who know the market and have the inventory, so you can serve your clients without leaving your lane.",
    cta: { label: 'Join as a Member', href: '#apply' },
  },
  {
    icon: Award,
    tag: 'For Specialists',
    headline: 'Your Knowledge. Our Reach.',
    body: "If you know a community or a building better than anyone, iClose puts you in front of a network of serious buyers. Share your knowledge, and we handle the rest. We publish it, we amplify it, and we position you as the go-to authority in your domain. When a Member inquiry falls within your expertise, you are the first and only call.",
    cta: { label: 'Apply as a Specialist', href: '/specialists' },
  },
  {
    icon: GraduationCap,
    tag: 'For Agents',
    headline: "The Inside Knowledge You've Been Missing.",
    body: "Most agents want to learn about the secondary market, but lack the tools to do so. iClose gives you structured content from Specialists who are actively working the areas you want to master, so you go in prepared, not guessing.",
    cta: { label: 'Join as a Member', href: '#apply' },
  },
];

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

function AudienceCard({ a }: { a: typeof AUDIENCES[number] }) {
  const Icon = a.icon;
  return (
    <div className="card-mist p-8 sm:p-10 flex flex-col h-full">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-paper border border-hairline mb-5">
        <Icon className="h-5 w-5 text-ink" strokeWidth={1.5} />
      </div>
      <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-graphite mb-3">
        {a.tag}
      </p>
      <h3 className="display-sm mb-4 text-balance">{a.headline}</h3>
      <p className="text-[17px] text-graphite-dark leading-[1.55] flex-1" style={{ letterSpacing: '-0.012em' }}>
        {a.body}
      </p>
      <a href={a.cta.href} className="applelink mt-8">
        {a.cta.label}
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  );
}

export function ForWho() {
  const cards = AUDIENCES.map((a) => <AudienceCard key={a.tag} a={a} />);

  return (
    <section id="who" className="bg-paper py-16 sm:py-20 md:py-24 lg:py-32">
      <div className="container-wide">
        <div className="max-w-2xl mb-14 md:mb-18">
          <Reveal>
            <h2 className="display-lg text-balance">
              One community. Three clear reasons to be in it.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="subhead mt-5 max-w-xl">
              iClose is built around three types of professionals. Each one gets something distinct from the platform, and each one makes it stronger for the others.
            </p>
          </Reveal>
        </div>

        {/* Mobile carousel */}
        <MobileCarousel
          items={cards}
          className="md:hidden"
          ariaLabel="Audience types"
        />

        {/* Desktop grid */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.05 }}
          className="hidden md:grid grid-cols-3 gap-4"
        >
          {AUDIENCES.map((a) => (
            <motion.div key={a.tag} variants={item}>
              <AudienceCard a={a} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
