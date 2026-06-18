'use client';

import { motion } from 'framer-motion';
import { LeadForm } from '@/components/lead-form';

export function FinalCTA() {
  return (
    <section id="apply" className="relative overflow-hidden bg-paper border-t border-hairline" style={{ minHeight: 'calc(100vh - 48px)' }}>

      <div
        className="relative container-wide flex flex-col items-center lg:flex-row lg:items-center gap-4 lg:gap-20 pt-10 pb-12 lg:py-0"
        style={{ minHeight: 'calc(100vh - 48px)' }}
      >

        {/* Left: heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="lg:flex-1 text-center lg:text-left"
        >
          <h2
            className="text-ink font-display font-semibold text-balance leading-[1.05]"
            style={{ fontSize: 'clamp(1.6rem, 7vw, 5.5rem)', letterSpacing: '-0.03em' }}
          >
            Join the<br />community.
          </h2>
          <p className="mt-2 text-graphite text-[13px] sm:text-[17px] leading-[1.5] max-w-xs mx-auto lg:mx-0" style={{ letterSpacing: '-0.012em' }}>
            Free to join. No card required. Apply as a Specialist separately.
          </p>
        </motion.div>

        {/* Right: form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="w-full lg:w-[420px] shrink-0"
        >
          <div className="bg-white rounded-apple border border-hairline p-5 sm:p-8 shadow-elevated">
            <LeadForm />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
