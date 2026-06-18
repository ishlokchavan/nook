'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Play, Plus, Minus, ArrowRight, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { JourneyContent } from '@/lib/journey-content';
import type { JourneyKey } from '@/lib/portal-config';

/** Soft gradient wash for the explainer section, per journey tint. */
const TINT_WASH: Record<JourneyKey, string> = {
  buy: 'from-journey-buyer/40 via-journey-offplan/20 to-journey-listing/30',
  sell: 'from-journey-seller/40 via-journey-offplan/20 to-journey-buyer/20',
  close: 'from-journey-agent/40 via-journey-offplan/20 to-journey-seller/20',
};

export function JourneyPage({ content }: { content: JourneyContent }) {
  return (
    <>
      {/* Hero: eyebrow → H1 → H2 → CTA → video */}
      <section className="container-wide pt-12 pb-10 text-center">
        <p className="eyebrow mb-3">{content.eyebrow}</p>
        <h1 className="display-lg max-w-4xl mx-auto text-balance">{content.h1}</h1>
        <p className="subhead mt-4 max-w-2xl mx-auto">{content.h2}</p>
        <div className="mt-7 flex items-center justify-center gap-3">
          <Link href={content.primaryCta.href}>
            <Button variant="primary" size="lg">{content.primaryCta.label}</Button>
          </Link>
          {content.showReadyToggle && <ReadyToggle />}
        </div>

        {/* Hero video placeholder */}
        <div className="mt-10 max-w-4xl mx-auto aspect-video card-surface flex items-center justify-center">
          <span className="flex items-center justify-center h-14 w-14 rounded-full bg-mist">
            <Play className="h-6 w-6 text-graphite ms-0.5" />
          </span>
        </div>
      </section>

      {/* Graphic explainer — gradient section with image+title+text+button cards */}
      <section className="py-16">
        <div className={cn('bg-gradient-to-br', TINT_WASH[content.tint])}>
          <div className="container-wide py-14">
            <h2 className="display-sm text-center mb-10">{content.explainerTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {content.explainer.map((card) => (
                <div key={card.title} className="card-surface bg-paper p-6 flex flex-col">
                  <div className="aspect-[5/3] rounded-xl bg-mist mb-4" />
                  <h3 className="text-[18px] font-medium text-ink" style={{ letterSpacing: '-0.015em' }}>
                    {card.title}
                  </h3>
                  <p className="text-[14px] text-graphite-dark mt-2 flex-1">{card.body}</p>
                  {card.cta && (
                    <Link href={card.cta.href} className="applelink mt-4 text-[14px]">
                      {card.cta.label}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials — 4 quote cards */}
      <section className="container-wide pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card-surface p-5">
              <Quote className="h-5 w-5 text-hairline mb-3" />
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-mist" />
                <div className="h-3 w-5/6 rounded bg-mist" />
                <div className="h-3 w-2/3 rounded bg-mist" />
              </div>
              <div className="flex items-center gap-3 mt-5">
                <div className="h-9 w-9 rounded-full bg-mist" />
                <div className="space-y-1.5">
                  <div className="h-2.5 w-20 rounded bg-mist" />
                  <div className="h-2.5 w-14 rounded bg-mist" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* KPI strip */}
      <section className="container-wide pb-16">
        <div className="card-mist rounded-apple grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-hairline/60">
          {content.kpis.map((kpi) => (
            <div key={kpi.label} className="px-6 py-8 text-center">
              <div className="display-sm">{kpi.value}</div>
              <div className="text-[14px] text-graphite mt-1">{kpi.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ accordion */}
      <section className="container-wide pb-16 max-w-3xl">
        <h2 className="display-sm text-center mb-8">Frequently asked questions</h2>
        <div className="card-surface divide-y divide-hairline/60">
          {content.faqs.map((faq, i) => (
            <FaqItem key={i} faq={faq} />
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="container-wide pb-24">
        <div className="rounded-apple bg-ink text-white px-8 py-12 text-center">
          <h2 className="display-sm text-white">{content.finalCta.title}</h2>
          <p className="mt-3 text-[16px] text-white/70 max-w-xl mx-auto">{content.finalCta.body}</p>
          <Link href={content.finalCta.cta.href} className="inline-block mt-6">
            <Button variant="primary" size="lg">{content.finalCta.cta.label}</Button>
          </Link>
        </div>
      </section>
    </>
  );
}

/** Ready ⇄ Off-Plan toggle (presentational for now). */
function ReadyToggle() {
  const [mode, setMode] = useState<'ready' | 'offplan'>('ready');
  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-full bg-mist">
      {(['ready', 'offplan'] as const).map((m) => (
        <button
          key={m}
          onClick={() => setMode(m)}
          className={cn(
            'px-4 h-9 text-[14px] rounded-full transition-colors',
            mode === m ? 'bg-paper text-ink shadow-card font-medium' : 'text-ink/70 hover:text-ink',
          )}
        >
          {m === 'ready' ? 'Ready' : 'Off-Plan'}
        </button>
      ))}
    </div>
  );
}

function FaqItem({ faq }: { faq: { q: string; a: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOpen((s) => !s)}
      className="w-full text-start px-5 py-4 flex items-start gap-3"
    >
      <span className="flex-1">
        <span className="block text-[15px] text-ink font-medium" style={{ letterSpacing: '-0.01em' }}>
          {faq.q}
        </span>
        {open && <span className="block text-[14px] text-graphite-dark mt-2">{faq.a}</span>}
      </span>
      <span className="shrink-0 text-graphite mt-0.5">
        {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      </span>
    </button>
  );
}
