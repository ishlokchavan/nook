'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  BadgePercent,
  Coins,
  ShieldCheck,
  Building2,
  Home,
  Tag,
  Handshake,
} from 'lucide-react';
import { SmartImage } from './smart-image';

const INTRO_KEY = 'closehq.glass.intro.v1';
const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_373qi3JTSvYmXjqMPJT9idOjFt7';

const BUY_IMG = `${CDN}/hf_20260616_222225_d0f4e2b8-36a6-46aa-9625-324f1714414c.png`;
const SELL_IMG = `${CDN}/hf_20260616_222230_e9003974-fd28-47cb-9667-44b1485ce165.png`;
const CLOSE_IMG = `${CDN}/hf_20260616_222236_b69f84e1-cbcb-452d-841d-63c07a0ada81.png`;

const DO_CARDS = [
  { img: BUY_IMG, Icon: Home, label: 'Buy', badge: '0% commission · 100% cashback', line: 'Earn credits worth real money on every home.' },
  { img: SELL_IMG, Icon: Tag, label: 'Sell', badge: 'List free', line: 'Sell direct to buyers, without paying commission.' },
  { img: CLOSE_IMG, Icon: Handshake, label: 'Close', badge: 'Keep 100%', line: 'List or close a deal and keep the full commission.' },
];

const USPS = [
  { Icon: BadgePercent, title: 'Zero commission', line: 'Buy, sell or close — you never pay a cut.' },
  { Icon: Coins, title: 'Cashback credits', line: 'Earn iClose credits worth real money on every deal.' },
  { Icon: ShieldCheck, title: 'Verified listings', line: 'Real, RERA-checked homes. No fake leads.' },
  { Icon: Building2, title: 'Off-plan launches', line: 'Early access and special pricing on new launches.' },
];

const STEPS = 3;
const EASE = [0.25, 0.1, 0.25, 1] as const;

const stagger = (delay = 0.06) => ({
  hidden: {},
  show: { transition: { staggerChildren: delay, delayChildren: 0.1 } },
});

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: EASE } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.25, ease: EASE } },
};

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.34, ease: EASE } },
};

/** Mesh gradient matching the portal homepage hero. */
function HeroMesh() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 blur-3xl"
        style={{
          background: [
            'radial-gradient(38% 50% at 82% 18%, rgba(56,108,255,0.80) 0%, rgba(56,108,255,0) 60%)',
            'radial-gradient(34% 46% at 90% 36%, rgba(124,58,237,0.75) 0%, rgba(124,58,237,0) 62%)',
            'radial-gradient(40% 52% at 8%  72%, rgba(124,58,237,0.65) 0%, rgba(124,58,237,0) 60%)',
            'radial-gradient(36% 48% at 2%  55%, rgba(255,45,85,0.60)  0%, rgba(255,45,85,0)  58%)',
            'radial-gradient(30% 40% at 20% 90%, rgba(56,108,255,0.50) 0%, rgba(56,108,255,0) 60%)',
          ].join(','),
        }}
      />
      {/* white core for text legibility */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(55% 50% at 50% 42%, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.35) 55%, rgba(255,255,255,0) 80%)',
        }}
      />
    </div>
  );
}

/**
 * First-run brand intro — three slides shown once before the taste picker.
 * Light-themed throughout. Self-contained (localStorage flag, no route dep).
 */
export function IntroStory() {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (!localStorage.getItem(INTRO_KEY)) setOpen(true);
    } catch { /* storage unavailable */ }
  }, []);

  if (!open) return null;

  function finish() {
    try { localStorage.setItem(INTRO_KEY, '1'); } catch { /* ignore */ }
    setOpen(false);
  }

  function go(n: number) {
    ref.current?.scrollTo({ left: n * (ref.current.clientWidth ?? 0), behavior: 'smooth' });
  }

  function onScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    const n = Math.round(el.scrollLeft / el.clientWidth);
    if (n !== idx) setIdx(n);
  }

  const last = idx === STEPS - 1;

  return (
    <div className="absolute inset-0 z-[80] bg-paper">
      {/* ── progress + skip ─────────────────────────────────────── */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center gap-3 px-5 pt-[max(14px,env(safe-area-inset-top))]">
        <div className="flex flex-1 gap-1.5">
          {Array.from({ length: STEPS }).map((_, i) => (
            <span
              key={i}
              className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${i <= idx ? 'bg-ink' : 'bg-ink/12'}`}
            />
          ))}
        </div>
        <button type="button" onClick={finish} className="text-[13px] font-medium text-ink/40 active:scale-95">
          Skip
        </button>
      </div>

      {/* ── slide rail ──────────────────────────────────────────── */}
      <div
        ref={ref}
        onScroll={onScroll}
        className="no-scrollbar flex h-full w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
        style={{ touchAction: 'pan-x' }}
      >

        {/* ── Slide 1 · Brand hero ────────────────────────────── */}
        <section className="relative h-full w-full shrink-0 snap-center overflow-hidden bg-paper">
          <HeroMesh />

          <motion.div
            key={`s1-${idx === 0}`}
            className="relative flex h-full flex-col px-7 pt-[max(72px,calc(env(safe-area-inset-top)+56px))]"
            variants={stagger(0.1)}
            initial="hidden"
            animate={idx === 0 ? 'show' : 'hidden'}
          >
            {/* iClose wordmark — small brand label, not competing with headline */}
            <motion.div variants={fadeIn} className="flex items-baseline gap-0" style={{ letterSpacing: '-0.01em' }}>
              <span className="font-display text-[17px] font-medium text-ink/40">i</span>
              <span className="font-display text-[17px] font-semibold text-ink/40">Close</span>
            </motion.div>

            {/* Hero headline — font-normal base, bold only on buy/sell/close */}
            <motion.h1
              variants={fadeUp}
              className="mt-8 text-[40px] font-normal leading-[1.07] text-ink"
              style={{ letterSpacing: '-0.03em' }}
            >
              Never pay commission to{' '}
              <strong className="font-bold">buy</strong>,{' '}
              <strong className="font-bold">sell</strong>, or{' '}
              <strong className="font-bold">close</strong>{' '}
              ever again.
            </motion.h1>

            {/* Subtitle */}
            <motion.p variants={fadeUp} className="mt-5 flex items-center gap-1.5 text-[14px] text-ink/50">
              Investing in Off-Plan? Get Special Pricing &amp; Credits
              <ArrowRight className="h-3.5 w-3.5 shrink-0" />
            </motion.p>
          </motion.div>
        </section>

        {/* ── Slide 2 · Three ways to win ─────────────────────── */}
        <section className="h-full w-full shrink-0 snap-center overflow-hidden bg-paper">
          <div className="flex h-full flex-col px-6 pb-36 pt-[max(64px,calc(env(safe-area-inset-top)+52px))]">
            <motion.div
              key={`s2-${idx === 1}`}
              variants={stagger(0.06)}
              initial="hidden"
              animate={idx === 1 ? 'show' : 'hidden'}
            >
              <motion.h2 variants={fadeUp} className="text-[28px] font-semibold leading-tight text-ink" style={{ letterSpacing: '-0.02em' }}>
                One app. Three ways to win.
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-2 text-[15px] text-ink/50">
                Whichever side you're on, the cut stays yours.
              </motion.p>

              <motion.div className="mt-6 flex flex-col gap-3.5" variants={stagger(0.07)}>
                {DO_CARDS.map(({ img, Icon, label, badge, line }) => (
                  <motion.div
                    key={label}
                    variants={slideUp}
                    className="relative h-[118px] overflow-hidden rounded-[22px] shadow-card"
                  >
                    <SmartImage src={img} alt="" fill sizes="(max-width: 520px) 100vw, 520px" className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />
                    <div className="absolute inset-0 flex items-center gap-4 px-5">
                      {/* Icon bubble */}
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm ring-1 ring-white/20">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[20px] font-semibold tracking-tight text-white">{label}</span>
                          <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold text-ink">{badge}</span>
                        </div>
                        <p className="mt-0.5 text-[13px] leading-snug text-white/75">{line}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── Slide 3 · Why iClose ────────────────────────────── */}
        <section className="h-full w-full shrink-0 snap-center overflow-hidden bg-paper">
          <div className="flex h-full flex-col px-6 pb-36 pt-[max(64px,calc(env(safe-area-inset-top)+52px))]">
            <motion.div
              key={`s3-${idx === 2}`}
              variants={stagger(0.07)}
              initial="hidden"
              animate={idx === 2 ? 'show' : 'hidden'}
            >
              <motion.h2 variants={fadeUp} className="text-[28px] font-semibold leading-tight text-ink" style={{ letterSpacing: '-0.02em' }}>
                Why iClose?
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-2 text-[15px] text-ink/50">
                Built to put money back in your pocket.
              </motion.p>

              <motion.div className="mt-6 flex flex-col gap-3" variants={stagger(0.07)}>
                {USPS.map(({ Icon, title, line }) => (
                  <motion.div
                    key={title}
                    variants={slideUp}
                    className="flex items-center gap-4 rounded-2xl border border-ink/[0.07] bg-white p-4 shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10">
                      <Icon className="h-[22px] w-[22px] text-accent" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[15px] font-semibold leading-snug text-ink">{title}</p>
                      <p className="mt-0.5 text-[13px] leading-snug text-ink/50">{line}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* ── CTA button ──────────────────────────────────────────── */}
      <div className="absolute inset-x-0 bottom-0 z-20 px-6 pb-[max(28px,env(safe-area-inset-bottom))]">
        <motion.button
          type="button"
          onClick={() => (last ? finish() : go(idx + 1))}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-[16px] font-semibold text-white"
          whileTap={{ scale: 0.98 }}
        >
          {last ? 'Start exploring' : 'Next'}
          <AnimatePresence mode="wait">
            <motion.span
              key={last ? 'done' : 'next'}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 4 }}
              transition={{ duration: 0.18, ease: EASE }}
            >
              <ArrowRight className="h-[18px] w-[18px]" />
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
