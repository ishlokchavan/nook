'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import { trackEvent } from '@/lib/analytics';

export function Referral() {
  return (
    <section className="bg-mist py-16 sm:py-20 md:py-24 lg:py-32">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <Reveal>
              <h2 className="display-lg text-balance">
                Bring an agent. Earn for life.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="subhead mt-6 max-w-lg">
                Refer another agent or connector to the platform and earn{' '}
                <span className="text-ink font-medium">5% of every commission they generate</span>{' '}
               , for as long as they keep closing.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <a
                href="#apply"
                onClick={() => trackEvent('cta_click', { source: 'referral_section' })}
                className="applelink-lg mt-8"
              >
                Join &amp; refer
                <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
              </a>
            </Reveal>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="card-surface aspect-square max-w-md mx-auto flex flex-col items-center justify-center p-10">
              <p className="text-sm font-medium text-graphite tracking-tight mb-4">
                Lifetime payout
              </p>
              <div
                className="font-display font-semibold text-ink leading-none"
                style={{ fontSize: 'clamp(5.5rem, 14vw, 13rem)', letterSpacing: '-0.05em' }}
              >
                5%
              </div>
              <p className="mt-6 text-base text-graphite-dark text-center max-w-[14rem]" style={{ letterSpacing: '-0.012em' }}>
                on every deal they close, forever.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
