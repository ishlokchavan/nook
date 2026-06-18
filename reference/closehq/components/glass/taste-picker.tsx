'use client';

import { useEffect, useMemo, useState } from 'react';
import { Sparkles, Check, Heart, ArrowRight, Home, Building2, Compass } from 'lucide-react';
import { useExperience } from './experience-provider';
import { useSignals } from './signal-store';
import { facetsOf } from '@/lib/glass/recommender';
import { formatAed, type ExperienceListing } from '@/lib/glass/experience-data';
import { SmartImage } from './smart-image';

const ONBOARDED_KEY = 'closehq.glass.onboarded.v1';

const INTENTS = [
  { id: 'ready', label: 'Move-in ready', sub: 'Buy and live now', Icon: Home, facet: 'completion:ready' },
  { id: 'off_plan', label: 'New launch', sub: 'Off-plan, payment plans', Icon: Building2, facet: 'completion:off_plan' },
  { id: 'explore', label: 'Just exploring', sub: 'Show me everything', Icon: Compass, facet: '' },
] as const;

const BUDGETS = [
  { label: 'Under 1M', band: '<1M' },
  { label: '1 – 2M', band: '1-2M' },
  { label: '2 – 5M', band: '2-5M' },
  { label: '5 – 10M', band: '5-10M' },
  { label: '10M +', band: '10M+' },
] as const;

/**
 * Cold-start taste picker. Three quick taps (intent · budget · love a few homes)
 * seed the recommender's affinity so the very first feed is personalised. Shown
 * once, skippable, no reading required — TikTok-style onboarding.
 */
export function TastePicker() {
  const { listings } = useExperience();
  const { seed } = useSignals();

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [intent, setIntent] = useState<string | null>(null);
  const [budget, setBudget] = useState<string | null>(null);
  const [loved, setLoved] = useState<Set<string>>(new Set());

  // Decide visibility after mount to avoid an SSR flash.
  useEffect(() => {
    try {
      if (!localStorage.getItem(ONBOARDED_KEY)) setOpen(true);
    } catch {
      /* storage unavailable — skip onboarding */
    }
  }, []);

  // A diverse set of covers to react to (one per community, then fill).
  const lovePool = useMemo(() => {
    const out: ExperienceListing[] = [];
    const seenCommunity = new Set<string>();
    for (const l of listings) {
      const c = l.community ?? l.city;
      if (!seenCommunity.has(c)) {
        seenCommunity.add(c);
        out.push(l);
      }
      if (out.length >= 8) break;
    }
    for (const l of listings) {
      if (out.length >= 8) break;
      if (!out.includes(l)) out.push(l);
    }
    return out;
  }, [listings]);

  if (!open) return null;

  function finish(skip = false) {
    if (!skip) {
      const facets: Record<string, number> = {};
      const add = (k: string, v: number) => {
        if (k) facets[k] = (facets[k] ?? 0) + v;
      };
      const intentFacet = INTENTS.find((i) => i.id === intent)?.facet;
      if (intentFacet) add(intentFacet, 35);
      if (budget) add(`price:${budget}`, 45);
      for (const ref of loved) {
        const l = listings.find((x) => x.reference === ref);
        if (l) for (const f of facetsOf(l)) add(f, 45);
      }
      if (Object.keys(facets).length) seed(facets);
    }
    try {
      localStorage.setItem(ONBOARDED_KEY, '1');
    } catch {
      /* ignore */
    }
    setOpen(false);
  }

  function toggleLove(ref: string) {
    setLoved((prev) => {
      const next = new Set(prev);
      next.has(ref) ? next.delete(ref) : next.add(ref);
      return next;
    });
  }

  const canContinue = step === 0 ? !!intent : step === 1 ? !!budget : true;
  const lastStep = step === 2;

  return (
    <div className="absolute inset-0 z-[70] flex flex-col bg-paper">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-[max(18px,env(safe-area-inset-top))]">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((s) => (
            <span
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s === step ? 'w-6 bg-ink' : s < step ? 'w-1.5 bg-ink' : 'w-1.5 bg-hairline'
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => finish(true)}
          className="text-[14px] font-medium text-graphite"
        >
          Skip
        </button>
      </div>

      {/* Heading */}
      <div className="px-6 pb-2 pt-7">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-[12px] font-semibold text-accent">
          <Sparkles className="h-3.5 w-3.5" /> Let&rsquo;s tune your feed
        </span>
        <h1 className="mt-3 text-[26px] font-semibold leading-tight tracking-tight text-ink">
          {step === 0
            ? "What brings you in?"
            : step === 1
              ? "What's your budget?"
              : 'Tap the homes you love'}
        </h1>
        <p className="mt-1 text-[14px] text-graphite">
          {step === 0
            ? 'So we show the right kind of homes first.'
            : step === 1
              ? 'We’ll lead with homes in your range.'
              : 'A few taps teaches your feed your taste.'}
        </p>
      </div>

      {/* Body */}
      <div className="no-scrollbar flex-1 overflow-y-auto px-6 pb-4 pt-2">
        {step === 0 && (
          <div className="space-y-3">
            {INTENTS.map(({ id, label, sub, Icon }) => {
              const active = intent === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setIntent(id)}
                  className={`flex w-full items-center gap-4 rounded-3xl border p-4 text-left transition-all active:scale-[0.99] ${
                    active ? 'border-ink bg-ink text-white' : 'border-hairline bg-paper text-ink'
                  }`}
                >
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                      active ? 'bg-white/15' : 'bg-mist'
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-[16px] font-semibold tracking-tight">{label}</span>
                    <span className={`block text-[13px] ${active ? 'text-white/70' : 'text-graphite'}`}>
                      {sub}
                    </span>
                  </span>
                  {active && <Check className="h-5 w-5" />}
                </button>
              );
            })}
          </div>
        )}

        {step === 1 && (
          <div className="grid grid-cols-2 gap-2.5">
            {BUDGETS.map(({ label, band }) => {
              const active = budget === band;
              return (
                <button
                  key={band}
                  type="button"
                  onClick={() => setBudget(band)}
                  className={`rounded-2xl border py-5 text-[16px] font-semibold transition-all active:scale-[0.98] ${
                    active ? 'border-ink bg-ink text-white' : 'border-hairline bg-paper text-ink'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-2 gap-3">
            {lovePool.map((l) => {
              const active = loved.has(l.reference);
              return (
                <button
                  key={l.reference}
                  type="button"
                  onClick={() => toggleLove(l.reference)}
                  className="relative overflow-hidden rounded-2xl bg-mist text-left active:scale-[0.98]"
                >
                  <div className="relative aspect-[4/5]">
                    <SmartImage src={l.cover} alt={l.title} fill sizes="45vw" className="object-cover" />
                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent" />
                    <span
                      className={`absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                        active ? 'bg-rose-500 text-white' : 'lg-glass-light text-ink'
                      }`}
                    >
                      <Heart className={`h-[18px] w-[18px] ${active ? 'fill-current' : ''}`} />
                    </span>
                    <span className="absolute inset-x-2 bottom-2 text-white">
                      <span className="block text-[14px] font-semibold leading-none">
                        {formatAed(l.priceAed)}
                      </span>
                      <span className="mt-0.5 block truncate text-[11.5px] text-white/80">
                        {l.community}
                      </span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 pb-[max(20px,env(safe-area-inset-bottom))] pt-2">
        <button
          type="button"
          disabled={!canContinue}
          onClick={() => (lastStep ? finish(false) : setStep((s) => s + 1))}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-[16px] font-semibold text-white transition-opacity active:scale-[0.99] disabled:opacity-40"
        >
          {lastStep ? `Show my homes${loved.size ? ` (${loved.size})` : ''}` : 'Continue'}
          <ArrowRight className="h-[18px] w-[18px]" />
        </button>
      </div>
    </div>
  );
}
