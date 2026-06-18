'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useMotionValue,
} from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);
import { Menu, X, Check, BadgePercent } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { ICloseFooter } from '@/components/sections/iclose-landing/iclose-footer';
import {
  PersonaQuote,
  PersonaFaq,
  PersonaWaitlist,
} from '@/components/persona/persona-sections';
import personaStyles from '@/components/persona/persona.module.css';
import { BuyerCompare, BuyerTools, BuyerSteps, BuyerFastTrack, BuyerTestimonials } from './buyer-cards';
import styles from './buyer-landing.module.css';

const ease = [0.22, 1, 0.36, 1] as const;

/* In-page navigation. Buyer-only — every link is an anchor to a section
   on this single page, so crawlers only ever see one route. */
const NAV_LINKS = [
  { href: '#top', label: 'Home' },
  { href: '#how', label: 'How it works' },
  { href: '#cashback', label: 'Cashback' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#faq', label: 'FAQ' },
];

const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL ||
  'https://calendly.com/hello-iclose/30min';

/* Developer coverage strip — official partner logos. Drop new assets into
   /public/images/developers and add an entry below. */
const DEVELOPERS: { name: string; logo: string }[] = [
  { name: 'Emaar', logo: '/images/developers/emaar.svg' },
  { name: 'DAMAC', logo: '/images/developers/damac.svg' },
  { name: 'Nakheel', logo: '/images/developers/nakheel.svg' },
  { name: 'Sobha', logo: '/images/developers/sobha.svg' },
  { name: 'Ellington', logo: '/images/developers/ellington.png' },
  { name: 'Binghatti', logo: '/images/developers/binghatti.png' },
];

function BuyerNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
        <div className={styles.navBrand}>
          <Logo />
        </div>

        <div className={styles.navCenter}>
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>

        <div className={styles.navRight}>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.navGhost}
          >
            Book a call
          </a>
          <button type="button" className={styles.navSolid} data-get-started="buyer">
            Get started
          </button>
        </div>

        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className={styles.navBurger}
          onClick={() => setOpen((s) => !s)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.mobileSheet}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
            <div className={styles.mobileSheetCtas}>
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.navGhost}
                onClick={() => setOpen(false)}
              >
                Book a call
              </a>
              <button
                type="button"
                className={styles.navSolid}
                data-get-started="buyer"
                onClick={() => setOpen(false)}
              >
                Get started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function FloatingCard({
  cls,
  icon,
  label,
  value,
  valueGreen,
  delay,
}: {
  cls: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  valueGreen?: boolean;
  delay: number;
}) {
  return (
    <motion.div
      className={`${styles.fcard} ${cls}`}
      initial={{ opacity: 0, scale: 0.85, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease }}
    >
      {icon}
      <span>
        <span className={styles.fcardLabel}>{label}</span>
        <span
          className={`${styles.fcardValue} ${valueGreen ? styles.fcardValueGreen : ''}`}
          style={{ display: 'block' }}
        >
          {value}
        </span>
      </span>
    </motion.div>
  );
}

/* Magnetic button — the element drifts toward the cursor on hover and
   springs back on leave. Renders as a real <button> so the global
   data-get-started click handler still fires. */
function MagneticButton({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16 });
  const sy = useSpring(y, { stiffness: 220, damping: 16 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.35);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      className={className}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={reset}
      whileTap={{ scale: 0.96 }}
      {...(rest as object)}
    >
      {children}
    </motion.button>
  );
}

function BuyerHero() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;

    // Simple fade-in animation for the title
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
      }
    );
  }, []);

  return (
    <section className={styles.hero} id="top">
      <div className={styles.heroInner}>
        <motion.h1
          ref={titleRef}
          className={styles.heroTitle}
          style={{ marginTop: '40px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05, ease: 'easeOut' }}
        >
        Pay zero commission
        </motion.h1>

        <motion.p
          className={styles.heroAccentPara}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12, ease }}
        >
          100% cash back from developers
        </motion.p>

        <motion.div
          className={styles.heroCtas}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18, ease }}
        >
          <MagneticButton className={styles.btnPrimary} data-get-started="buyer">
            View Properties 
          </MagneticButton>
          <a href="#how" className={styles.btnGhost}>
           Buy Now <span aria-hidden="true">→</span>
          </a>
        </motion.div>

        {/* Abstract centerpiece + floating stat cards */}
        <div className={styles.heroStage} aria-hidden="true">
          {/* Dashed elliptical orbit rings behind the skyline (Elegostra-style) */}
          <svg
            className={styles.orbits}
            viewBox="0 0 1000 520"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <g transform="rotate(0 500 260)" fill="none" strokeWidth="1.5">
              <ellipse
                cx="500"
                cy="260"
                rx="372"
                ry="142"
                stroke="rgba(1,113,227,0.40)"
                strokeDasharray="1.5 10"
                strokeLinecap="round"
              />
              <ellipse
                cx="500"
                cy="260"
                rx="262"
                ry="98"
                stroke="rgba(1,113,227,0.40)"
                strokeDasharray="1.5 10"
                strokeLinecap="round"
              />
            </g>
          </svg>

          {/* Dubai skyline silhouette — the hero centrepiece. Anchored to the
             bottom of the stage as a full-bleed horizon line beneath the
             headline, CTAs and floating stat cards. `height: auto` keeps the
             whole skyline (incl. the Burj spire) visible at any width, while
             `pointer-events: none` keeps it purely decorative so it never
             blocks the CTAs. Transparent PNG, so the orbit arcs read through
             the gaps between buildings. */}
          <motion.img
            src="/images/dubai-skyline.png"
            alt=""
            className={styles.orbSkyline}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2, ease }}
          />

          <FloatingCard
            cls={styles.fcardA}
            delay={0.4}
            icon={
              <span className={`${styles.fcardIcon} ${styles.fcardIconGreen}`}>
                <Check size={24} strokeWidth={2.6} />
              </span>
            }
            label="Cashback received"
            value="AED 100,000"
            valueGreen
          />
          <FloatingCard
            cls={styles.fcardC}
            delay={0.5}
            icon={
              <span className={`${styles.fcardIcon} ${styles.fcardIconGreen}`}>
                <BadgePercent size={24} strokeWidth={2.2} />
              </span>
            }
            label="You pay the agent"
            value="0% commission"
            valueGreen
          />
        </div>
      </div>

      {/* Developer trust strip — floating white card with logo lockups */}
      <div className={styles.trust}>
        <div className={styles.trustBar}>
          {DEVELOPERS.map((d) => (
            <div className={styles.trustItem} key={d.name}>
              <img
                src={d.logo}
                alt={d.name}
                className={styles.trustLogo}
                loading="lazy"
              />
            </div>
          ))}
        </div>
        <div className={styles.trustLabel}>
          Coverage across the UAE&apos;s leading developers and more.
        </div>
      </div>
    </section>
  );
}

/* Thin gradient bar pinned to the top that tracks scroll progress. */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  return <motion.div className={styles.scrollProgress} style={{ scaleX }} aria-hidden="true" />;
}

export function BuyerLanding() {

  return (
    <div className={styles.root}>
      <div className={styles.blurOverlay} />
      <ScrollProgress />
      <BuyerNav />

      <BuyerHero />

      {/* The Persona* sections + footer rely on CSS custom properties
          (--text, --bg-dark, --border, etc.) defined on persona's own
          .root. PersonaChrome supplies that wrapper on /for-buyers; here
          we replicate it so the highlighted cards and footer resolve
          their colours correctly instead of rendering washed-out. */}
      <div className={personaStyles.root}>
      <div className={styles.panel}>
        <BuyerCompare />
      </div>

      <div className={styles.panel}>
        <BuyerTools />
      </div>

      <div className={styles.panel} id="how">
        <BuyerSteps />
      </div>

      <div className={styles.panel}>
        <BuyerFastTrack />
      </div>

      <div id="reviews">
        <BuyerTestimonials />
      </div>

      <div id="faq">
        <PersonaFaq
          heading={<>Frequently asked questions.</>}
          items={[
            {
              q: 'Is iClose free to use?',
              a: 'Yes. Browsing projects and market intelligence is free. You only engage a specialist when you’re ready to move, and that’s when 100% of the commission comes back to you.',
            },
            {
              q: 'How does the 100% cashback work?',
              a: 'We rebate the entire agent commission we earn on your deal back to you, confirmed in writing before you sign.',
            },
            {
              q: 'Off-plan or secondary?',
              a: 'Both. The 100% cashback applies on every deal, off-plan or ready.',
            },
          ]}
        />
      </div>

      <PersonaWaitlist
        defaultIntent="buyer"
        hideIntent
        heading={<>Ready to buy smarter?</>}
        body={<>Tell us a bit about you. We&apos;ll line up your 100% cashback.</>}
      />

      <ICloseFooter tagline="The smarter way to buy UAE property. Get 100% of the agent commission back on every deal, off-plan or ready." />
      </div>
    </div>
  );
}
