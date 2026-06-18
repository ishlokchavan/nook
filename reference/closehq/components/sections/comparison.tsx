'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';

const ROWS = [
  { label: 'Commission split', us: 'Up to 100%', them: 'Typically 50%' },
  { label: 'Anonymity', us: 'Complete', them: 'None, your name is on everything' },
  { label: 'Desk / monthly fees', us: 'None', them: 'AED 2,000–5,000+' },
  { label: 'Commission timing', us: 'Paid when buyer signs', them: 'After developer pays' },
  { label: 'Payout speed', us: '~24 hours', them: '30–90+ days' },
  { label: 'Schedule', us: 'Fully flexible', them: 'Office hours' },
  { label: 'Closing tools', us: 'Yacht, chauffeur, rentals', them: 'Pay out of pocket' },
  { label: 'Lifetime referrals', us: '5% forever', them: 'One-off bonus, if any' },
];

export function Comparison() {
  return (
    <section id="vs" className="bg-paper py-16 sm:py-20 md:py-24 lg:py-32">
      <div className="container-wide">
        <div className="max-w-3xl mb-14 md:mb-20 text-center mx-auto">
          <Reveal>
            <h2 className="display-lg text-balance">
              We removed everything expensive.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="subhead mt-6 max-w-2xl mx-auto">
              Traditional brokerages were built for a different era. We rebuilt from scratch for modern, independent agents.
            </p>
          </Reveal>
        </div>

        {/* Mobile: two simple cards, iClose then Traditional */}
        <div className="md:hidden space-y-4">
          <Reveal>
            <div className="card-surface ring-2 ring-ink p-6">
              <p className="text-sm font-medium text-graphite tracking-tight mb-1">iClose</p>
              <h3 className="display-sm mb-5">The new way.</h3>
              <ul className="space-y-3">
                {ROWS.map((row) => (
                  <li
                    key={row.label}
                    className="flex items-start gap-3 text-[15px] text-ink"
                    style={{ letterSpacing: '-0.012em' }}
                  >
                    <Check className="h-5 w-5 mt-0.5 text-ink flex-shrink-0" strokeWidth={2.5} />
                    <span>
                      <span className="text-graphite">{row.label}: </span>
                      <span className="font-medium">{row.us}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="card-mist p-6">
              <p className="text-sm font-medium text-graphite tracking-tight mb-1">Traditional brokerage</p>
              <h3 className="display-sm mb-5">The old way.</h3>
              <ul className="space-y-3">
                {ROWS.map((row) => (
                  <li
                    key={row.label}
                    className="flex items-start gap-3 text-[15px] text-graphite-dark"
                    style={{ letterSpacing: '-0.012em' }}
                  >
                    <X className="h-5 w-5 mt-0.5 text-graphite-light flex-shrink-0" strokeWidth={2.5} />
                    <span>
                      <span className="text-graphite">{row.label}: </span>
                      <span>{row.them}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Tablet+: full grid table */}
        <Reveal delay={0.15}>
          <div className="hidden md:block card-mist overflow-hidden">
            <div className="grid grid-cols-[1.2fr_1fr_1fr]">
              <div className="p-5 md:p-7 text-sm font-medium text-graphite tracking-tight border-b border-hairline">
                Compare
              </div>
              <div className="p-5 md:p-7 text-sm font-medium text-ink tracking-tight border-b border-hairline border-l border-hairline bg-paper">
                iClose
              </div>
              <div className="p-5 md:p-7 text-sm font-medium text-graphite tracking-tight border-b border-hairline border-l border-hairline">
                Traditional brokerage
              </div>

              {ROWS.map((row, i) => (
                <motion.div
                  key={row.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: i * 0.04 }}
                  className="contents"
                >
                  <div
                    className={`p-5 md:p-7 text-[15px] lg:text-[17px] text-ink border-hairline ${i < ROWS.length - 1 ? 'border-b' : ''}`}
                    style={{ letterSpacing: '-0.012em' }}
                  >
                    {row.label}
                  </div>
                  <div
                    className={`p-5 md:p-7 text-[15px] lg:text-[17px] text-ink border-l border-hairline bg-paper flex items-start gap-2.5 ${i < ROWS.length - 1 ? 'border-b' : ''}`}
                    style={{ letterSpacing: '-0.012em' }}
                  >
                    <Check className="h-5 w-5 mt-0.5 text-ink flex-shrink-0" strokeWidth={2} />
                    <span className="font-medium">{row.us}</span>
                  </div>
                  <div
                    className={`p-5 md:p-7 text-[15px] lg:text-[17px] text-graphite border-l border-hairline flex items-start gap-2.5 ${i < ROWS.length - 1 ? 'border-b' : ''}`}
                    style={{ letterSpacing: '-0.012em' }}
                  >
                    <X className="h-5 w-5 mt-0.5 text-graphite-light flex-shrink-0" strokeWidth={2} />
                    <span>{row.them}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
