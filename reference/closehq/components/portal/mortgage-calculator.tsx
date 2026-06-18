'use client';

import { useMemo, useState } from 'react';

function money(n: number): string {
  return `AED ${Math.round(n).toLocaleString('en-US')}`;
}

/** Estimate-your-monthly-payment calculator (Proffer / PF pattern). */
export function MortgageCalculator({ price }: { price: number }) {
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(3.99);
  const [years, setYears] = useState(25);

  const { monthly, loan } = useMemo(() => {
    const loanAmt = price * (1 - downPct / 100);
    const r = rate / 100 / 12;
    const n = years * 12;
    const m = r === 0 ? loanAmt / n : (loanAmt * r * (1 + r) ** n) / ((1 + r) ** n - 1);
    return { monthly: m, loan: loanAmt };
  }, [price, downPct, rate, years]);

  return (
    <section className="mt-7">
      <h2 className="text-[18px] font-semibold text-ink mb-1" style={{ letterSpacing: '-0.015em' }}>Find your ideal mortgage</h2>
      <p className="text-[14px] text-graphite mb-4">Estimate your monthly payment.</p>

      <div className="card-surface p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5">
          <Slider label="Down payment" value={`${downPct}%`} min={10} max={80} step={5} v={downPct} onChange={setDownPct} />
          <Slider label="Interest rate" value={`${rate.toFixed(2)}%`} min={1} max={8} step={0.01} v={rate} onChange={setRate} />
          <Slider label="Loan period" value={`${years} years`} min={1} max={25} step={1} v={years} onChange={setYears} />
        </div>
        <div className="rounded-apple bg-mist p-6 flex flex-col justify-center">
          <div className="text-[13px] text-graphite">Your monthly payment</div>
          <div className="display-sm text-accent mt-1">{money(monthly)}</div>
          <div className="mt-4 space-y-1.5 text-[14px]">
            <div className="flex justify-between"><span className="text-graphite">Loan amount</span><span className="text-ink font-medium">{money(loan)}</span></div>
            <div className="flex justify-between"><span className="text-graphite">Down payment</span><span className="text-ink font-medium">{money(price - loan)}</span></div>
            <div className="flex justify-between"><span className="text-graphite">Interest rate</span><span className="text-ink font-medium">{rate.toFixed(2)}%</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Slider({
  label, value, min, max, step, v, onChange,
}: {
  label: string; value: string; min: number; max: number; step: number; v: number; onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[13px] text-graphite">{label}</span>
        <span className="text-[14px] text-ink font-medium">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={v}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#0071e3]"
      />
    </div>
  );
}
