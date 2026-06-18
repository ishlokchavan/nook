'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

const PILLS = [
  { label: 'Real Estate Agent', x: '8%', y: '6%' },
  { label: 'Investor', x: '52%', y: '2%' },
  { label: 'Mortgage Broker', x: '2%', y: '22%' },
  { label: 'Accountant', x: '44%', y: '18%' },
  { label: 'Lawyer', x: '16%', y: '38%' },
  { label: 'Asset Manager', x: '55%', y: '35%' },
  { label: 'Financial Advisor', x: '4%', y: '54%' },
  { label: 'Fund Manager', x: '46%', y: '52%' },
  { label: 'Wealth Manager', x: '14%', y: '68%' },
  { label: 'Private Banker', x: '52%', y: '66%' },
  { label: 'Family Office', x: '2%', y: '82%' },
  { label: 'Broker', x: '38%', y: '80%' },
  { label: 'Tax Advisor', x: '64%', y: '84%' },
  { label: 'POA', x: '72%', y: '48%' },
  { label: 'Insurance Advisor', x: '66%', y: '16%' },
  { label: 'Corporate Treasurer', x: '28%', y: '92%' },
];

/* First two rows shown on mobile as a compact wrap */
const MOBILE_PILLS = [
  'Real Estate Agent', 'Investor', 'Mortgage Broker',
  'Lawyer', 'Asset Manager', 'Fund Manager',
  'Wealth Manager', 'Private Banker', 'Broker',
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-paper flex items-center min-h-screen pt-12">

      {/* Subtle dot-grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #d2d2d7 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.4,
        }}
      />

      {/* Right-side mist gradient (desktop only) */}
      <div className="absolute inset-y-0 right-0 w-1/2 pointer-events-none hidden lg:block bg-gradient-to-l from-mist/60 to-transparent" />

      <div
        className="relative container-wide w-full flex flex-col justify-center lg:flex-row lg:items-center gap-10 lg:gap-0 py-12 lg:py-0"
      >

        {/* ── Left: copy ── */}
        <div className="lg:w-[52%] lg:pr-12 flex flex-col justify-center">

          <h1
            className="font-display font-semibold text-ink text-balance"
            style={{ fontSize: 'clamp(2.5rem, 5.5vw, 5rem)', lineHeight: 1.04, letterSpacing: '-0.032em' }}
          >
            <motion.span
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              The real estate
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              community for
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className="block text-graphite"
            >
              professionals.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.48, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-graphite-dark leading-[1.5] text-balance max-w-lg"
            style={{ fontSize: 'clamp(1rem, 1.3vw, 1.15rem)', letterSpacing: '-0.015em' }}
          >
            Whether you're an agent building expertise in the secondary market, a professional whose clients need the right asset, or a specialist with inventory to move and knowledge to share, iClose is where it all happens!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.58, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex items-center gap-4 flex-wrap"
          >
            <a
              href="#apply"
              onClick={() => trackEvent('cta_click', { source: 'hero_primary' })}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ink text-white text-[15px] font-medium hover:bg-ink/85 transition-colors"
              style={{ letterSpacing: '-0.01em' }}
            >
              Join now
              <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
            </a>
            <a
              href="/specialists"
              className="inline-flex items-center gap-2 text-graphite hover:text-ink transition-colors text-[15px]"
              style={{ letterSpacing: '-0.01em' }}
            >
              Apply as a Specialist
              <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
            </a>
          </motion.div>

          {/* ── Mobile: pill cloud (below CTAs) ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden mt-10 flex flex-wrap gap-2"
          >
            {MOBILE_PILLS.map((label) => (
              <span
                key={label}
                className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white border border-hairline shadow-card text-ink text-[12px] font-medium whitespace-nowrap"
                style={{ letterSpacing: '-0.01em' }}
              >
                {label}
              </span>
            ))}
          </motion.div>
        </div>

        {/* ── Right: absolute-positioned pills (desktop only) ── */}
        <div className="hidden lg:block lg:w-[48%] relative" style={{ height: 'calc(100vh - 48px)' }}>
          {PILLS.map((pill, i) => (
            <motion.div
              key={pill.label}
              className="absolute"
              style={{ left: pill.x, top: pill.y }}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.5 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.08, y: -4, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
            >
              <span
                className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-hairline shadow-card hover:shadow-elevated text-ink text-[13px] font-medium whitespace-nowrap cursor-default transition-shadow"
                style={{ letterSpacing: '-0.01em' }}
              >
                {pill.label}
              </span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
