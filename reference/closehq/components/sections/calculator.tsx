'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Reveal } from '@/components/ui/reveal';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

export function Calculator() {
  const [unitPrice, setUnitPrice] = useState(2000000);
  const [commissionRate, setCommissionRate] = useState(2);
  const [theirSplit, setTheirSplit] = useState(50);

  const calculations = useMemo(() => {
    const grossCommission = (unitPrice * commissionRate) / 100;
    const theirPayout = (grossCommission * theirSplit) / 100;
    const iclosePayout = grossCommission;
    const youLose = iclosePayout - theirPayout;
    return { grossCommission, theirPayout, iclosePayout, youLose };
  }, [unitPrice, commissionRate, theirSplit]);

  const formatAED = (value: number) =>
    new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <section className="bg-paper py-16 sm:py-20 md:py-24 lg:py-32">
      <div className="container-wide">
        <div className="max-w-3xl mb-14 md:mb-20 text-center mx-auto">
          <Reveal>
            <h2 className="display-lg text-balance">
              See what your split is costing you.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="subhead mt-6 max-w-2xl mx-auto">
              Run the numbers on a typical Dubai deal. The difference is real money.
            </p>
          </Reveal>
        </div>

        <div className="card-mist p-5 sm:p-8 md:p-12 lg:p-14">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Inputs */}
            <div className="space-y-7">
              <Field label="Unit price (AED)">
                <input
                  type="number"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(Number(e.target.value))}
                  className="w-full h-12 px-4 bg-paper border border-hairline rounded-xl text-ink text-[17px] focus:outline-none focus:border-accent transition-colors"
                  style={{ letterSpacing: '-0.012em' }}
                />
              </Field>

              <Field label="Commission rate (%)">
                <input
                  type="number"
                  step="0.1"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                  className="w-full h-12 px-4 bg-paper border border-hairline rounded-xl text-ink text-[17px] focus:outline-none focus:border-accent transition-colors"
                  style={{ letterSpacing: '-0.012em' }}
                />
              </Field>

              <Field
                label="Your current split"
                trailing={<span className="text-[17px] font-medium text-ink tabular-nums">{theirSplit}%</span>}
              >
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={theirSplit}
                  onChange={(e) => setTheirSplit(Number(e.target.value))}
                  className="w-full accent-accent"
                />
                <div className="flex justify-between text-xs text-graphite mt-2">
                  <span>40%</span>
                  <span>100%</span>
                </div>
              </Field>
            </div>

            {/* Result */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="card-surface p-6 sm:p-8 md:p-10 flex flex-col"
            >
              <p className="text-sm text-graphite font-medium tracking-tight mb-2">
                Gross commission
              </p>
              <p className="display-sm tabular-nums text-ink">
                {formatAED(calculations.grossCommission)}
              </p>

              <div className="hairline my-7" />

              <Row label={`Your payout (${theirSplit}%)`} value={formatAED(calculations.theirPayout)} muted />
              <Row label="On iClose Ultra (100%)" value={formatAED(calculations.iclosePayout)} />

              <div className="hairline my-7" />

              <p className="text-sm text-graphite font-medium tracking-tight mb-2">
                You leave behind, every deal
              </p>
              <motion.p
                key={`loss-${calculations.youLose}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="display-md tabular-nums text-ink"
              >
                {formatAED(calculations.youLose)}
              </motion.p>

              <div className="mt-8">
                <a href="#apply">
                  <Button variant="primary" size="lg" className="w-full">
                    Stop leaving money behind
                    <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  children,
  trailing,
}: {
  label: string;
  children: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <label className="text-sm font-medium text-graphite-dark tracking-tight">
          {label}
        </label>
        {trailing}
      </div>
      {children}
    </div>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-baseline justify-between py-2">
      <span className="text-[15px] text-graphite tracking-tight">{label}</span>
      <span
        className={`text-[20px] tabular-nums font-display ${muted ? 'text-graphite-dark font-normal' : 'text-ink font-medium'}`}
        style={{ letterSpacing: '-0.015em' }}
      >
        {value}
      </span>
    </div>
  );
}
