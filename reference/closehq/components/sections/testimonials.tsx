'use client';

import { motion } from 'framer-motion';
import { Reveal } from '@/components/ui/reveal';
import { MobileCarousel } from '@/components/ui/mobile-carousel';

const TESTIMONIALS = [
  {
    initials: 'T.M.',
    role: 'Secondary Market Agent',
    quote:
      'I spent four years in new developments and knew nothing about the secondary market. Six months with iClose and I can walk into any conversation about JVC, Dubai Hills, or Business Bay and hold my own. That is what the content here does.',
  },
  {
    initials: 'F.A.',
    role: 'Private Client Advisor',
    quote:
      "One of my clients had a very specific brief, Business Bay, high floor, direct canal view, quick transfer. I posted the requirement to the community. Within 24 hours a Specialist came back with three matching units. That is a network you cannot build overnight.",
  },
  {
    initials: 'K.R.',
    role: 'Downtown Dubai Specialist',
    quote:
      'I used to rely on brokers I barely knew to move my units. Now I have a community of professionals who know exactly what I specialise in. When they have a buyer for Downtown, they call me first.',
  },
];

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

function TestimonialCard({ t }: { t: typeof TESTIMONIALS[number] }) {
  return (
    <figure className="rounded-apple border border-hairline bg-white p-8 sm:p-10 flex flex-col h-full">
      <blockquote className="text-[16px] sm:text-[17px] text-ink leading-[1.5] text-balance flex-1" style={{ letterSpacing: '-0.012em' }}>
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-8 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-mist border border-hairline">
          <span className="text-[12px] font-medium text-graphite">{t.initials}</span>
        </div>
        <span className="text-sm text-graphite tracking-tight">{t.role}</span>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  const cards = TESTIMONIALS.map((t) => <TestimonialCard key={t.initials} t={t} />);

  return (
    <section className="bg-mist py-16 sm:py-20 md:py-24 lg:py-28">

      <div className="container-wide">
        <Reveal>
          {/* <h2 className="text-[28px] sm:text-[32px] font-display font-semibold text-ink text-balance max-w-xl mb-14 md:mb-16" style={{ letterSpacing: '-0.022em', lineHeight: 1.15 }}> */}
          <h2 className="display-lg text-balance max-w-xl mb-14 md:mb-16">
            {/* Three roles. One community. All winning. */}
            What our members say.
          </h2>
        </Reveal>

        {/* Mobile carousel */}
        <MobileCarousel
          items={cards}
          className="md:hidden"
          ariaLabel="Testimonials"
        />

        {/* Desktop grid */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ staggerChildren: 0.08 }}
          className="hidden md:grid grid-cols-3 gap-4"
        >
          {TESTIMONIALS.map((t) => (
            <motion.div key={t.initials} variants={item}>
              <TestimonialCard t={t} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
