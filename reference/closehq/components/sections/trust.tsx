'use client';

import { motion } from 'framer-motion';

const TRUST_ITEMS = [
  'Off-Plan Specialists',
  'Emaar · Damac · Sobha',
  'Palm Jumeirah · Downtown · Marina',
  'RERA Compliant',
  'Advance on SPA',
  'Multilingual Support',
  'Yacht & Chauffeur Concierge',
  'Verified Buyers Only',
];

export function Trust() {
  return (
    <section
      aria-label="Trusted by Dubai's deal makers"
      className="bg-mist border-y border-hairline py-12 md:py-14 overflow-hidden"
    >
      <div className="container-wide mb-6 text-center">
        <p
          className="text-sm font-medium text-graphite tracking-tight"
          style={{ letterSpacing: '-0.01em' }}
        >
          Trusted by 500+ brokers across Dubai
        </p>
      </div>

      <div className="relative mask-fade-x overflow-hidden">
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: '-50%' }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="flex gap-14 md:gap-20 whitespace-nowrap will-change-transform"
          aria-hidden
        >
          {[...TRUST_ITEMS, ...TRUST_ITEMS, ...TRUST_ITEMS].map((item, i) => (
            <span
              key={i}
              className="shrink-0 font-display text-base md:text-lg text-graphite font-normal tracking-tight"
              style={{ letterSpacing: '-0.012em' }}
            >
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
