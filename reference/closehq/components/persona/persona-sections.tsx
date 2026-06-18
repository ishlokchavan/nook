'use client';

import { useState, useRef, useEffect, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { Logo } from '@/components/ui/logo';
import { ICloseFooter } from '@/components/sections/iclose-landing/iclose-footer';
import { WaitlistForm } from '@/components/sections/iclose-landing/waitlist-form';
import styles from './persona.module.css';

const ease = [0.22, 1, 0.36, 1] as const;
const inView = { once: true, margin: '-10% 0px' };

const animFromLeft = {
  initial: { opacity: 0, x: -56 },
  whileInView: { opacity: 1, x: 0 },
  viewport: inView,
  transition: { duration: 0.6, ease },
};
const animFromRight = {
  initial: { opacity: 0, x: 56 },
  whileInView: { opacity: 1, x: 0 },
  viewport: inView,
  transition: { duration: 0.6, ease },
};
const animRise = {
  initial: { opacity: 0, y: 48 },
  whileInView: { opacity: 1, y: 0 },
  viewport: inView,
  transition: { duration: 0.6, ease },
};
const animScale = {
  initial: { opacity: 0, scale: 0.92 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: inView,
  transition: { duration: 0.55, ease },
};

/* ------- Shared chrome (nav + footer) ------- */
export function PersonaChrome({ children }: { children: ReactNode }) {
  return (
    <div className={styles.root}>
      <nav className={styles.nav}>
        {/* Logo already links to "/", so wrapping it in another <Link>
            produced <a><a></a></a> and broke hydration. Render the
            back arrow as a separate <Link>. */}
        <span className={styles.backLink}>
          <Link
            href="/"
            aria-label="Back to home"
            className={styles.backArrow}
          >
            <span aria-hidden="true">←</span>
          </Link>
          <Logo />
        </span>
        <ul className={styles.navLinks}>
          <li>
            <Link href="/for-closers">For Closers</Link>
          </li>
          <li>
            <Link href="/for-buyers">For Buyers</Link>
          </li>
          <li>
            <button type="button" className={styles.navCta} data-get-started>
              Get started
            </button>
          </li>
        </ul>
      </nav>
      {children}
      <ICloseFooter />
    </div>
  );
}

/* ------- Hero ------- */
type HeroProps = {
  variant: 'broker' | 'collaborator' | 'buyer';
  tagLabel: string;
  heroImage: string;
  heroAlt: string;
  headline: ReactNode;
  sub: ReactNode;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  chips?: string[];
};

export function PersonaHero({
  variant,
  tagLabel,
  heroImage,
  heroAlt,
  headline,
  sub,
  primaryCta,
  secondaryCta,
  chips,
}: HeroProps) {
  const tagCls =
    variant === 'collaborator' ? styles.personaTagAlt : styles.personaTag;

  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        {/* Copy slides in from LEFT, image from BOTTOM. Same pairing
            as the landing's HowItWorks slides. */}
        <motion.div
          className={styles.heroCopy}
          initial={{ opacity: 0, x: -48 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          <span className={tagCls}>{tagLabel}</span>
          <h1>{headline}</h1>
          <p>{sub}</p>
          {chips && chips.length > 0 && (
            <div className={styles.heroChips}>
              {chips.map((c) => (
                <span className={styles.heroChip} key={c}>
                  {c}
                </span>
              ))}
            </div>
          )}
          <div className={styles.heroCtas}>
            <button
              type="button"
              className={styles.btnBlue}
              data-get-started
            >
              {primaryCta.label}
            </button>
            {secondaryCta && (
              <Link href={secondaryCta.href} className={styles.btnLink}>
                {secondaryCta.label}
              </Link>
            )}
          </div>
        </motion.div>
        <motion.div
          className={styles.heroMedia}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.1 }}
        >
          <Image
            src={heroImage}
            alt={heroAlt}
            fill
            sizes="(max-width: 820px) 100vw, 560px"
            className={styles.heroImg}
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}

/* ------- Intro / value-prop block ------- */
export function PersonaIntro({
  eyebrow,
  heading,
  body,
  items,
}: {
  eyebrow: string;
  heading: ReactNode;
  body: ReactNode;
  items: { tag: string; title: string; body: string }[];
}) {
  return (
    <section className={styles.intro}>
      {/* Intro heading enters from the RIGHT. */}
      <motion.div className={styles.introLead} {...animFromRight}>
        <div className={styles.introEyebrow}>{eyebrow}</div>
        <h2 className={styles.introHeading}>{heading}</h2>
        <p className={styles.introBody}>{body}</p>
      </motion.div>
      <div className={styles.valueGrid}>
        {items.map((it, i) => (
          <motion.article
            className={styles.valueCard}
            key={it.title}
            initial={{ opacity: 0, y: 44 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.55, delay: i * 0.08, ease }}
          >
            <div className={styles.valueCardHead}>{it.tag}</div>
            <h3>{it.title}</h3>
            <p>{it.body}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

/* ------- Steps block ------- */
export function PersonaSteps({
  eyebrow,
  heading,
  body,
  steps,
}: {
  eyebrow?: string;
  heading: ReactNode;
  body?: ReactNode;
  steps: { title: string; body: string }[];
}) {
  return (
    <section className={styles.steps}>
      {/* Steps heading slides in from LEFT (matches landing workflow). */}
      <motion.div className={styles.stepsHeader} {...animFromLeft}>
        {eyebrow && <div className={styles.introEyebrow}>{eyebrow}</div>}
        <h2 className={styles.introHeading}>{heading}</h2>
        {body && <p className={styles.introBody}>{body}</p>}
      </motion.div>
      <div className={styles.stepsList}>
        {steps.map((s, i) => (
          <motion.div
            className={styles.stepRow}
            key={s.title}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={inView}
            transition={{ duration: 0.55, delay: i * 0.08, ease }}
          >
            <div className={styles.stepNum}>
              {String(i + 1).padStart(2, '0')}
            </div>
            <div className={styles.stepBody}>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ------- Math card block ------- */
export function PersonaMath({
  eyebrow,
  heading,
  body,
  rows,
  footnote,
}: {
  eyebrow?: string;
  heading: ReactNode;
  body?: ReactNode;
  rows: { label: string; value: string; hi?: boolean }[];
  footnote?: string;
}) {
  return (
    <section className={styles.math}>
      {/* Math heading rises from the bottom; the card scale-pops in. */}
      <motion.div className={styles.mathHeader} {...animRise}>
        {eyebrow && <div className={styles.introEyebrow}>{eyebrow}</div>}
        <h2 className={styles.introHeading}>{heading}</h2>
        {body && <p className={styles.introBody}>{body}</p>}
      </motion.div>
      <motion.div className={styles.mathCard} {...animScale}>
        {rows.map((r) => (
          <div className={styles.mathRow} key={r.label}>
            <span className={styles.mathLabel}>{r.label}</span>
            <span
              className={`${styles.mathValue} ${r.hi ? styles.mathValueHi : ''}`}
            >
              {r.value}
            </span>
          </div>
        ))}
      </motion.div>
      {footnote && <p className={styles.mathFoot}>{footnote}</p>}
    </section>
  );
}

/* ------- Side-by-side comparison ------- */
export function PersonaCompare({
  eyebrow,
  heading,
  body,
  left,
  right,
  footnote,
  badge = 'vs',
}: {
  eyebrow?: string;
  heading: ReactNode;
  body?: ReactNode;
  left: { title: string; rows: { label: string; value: string }[]; takeLabel: string; takeValue: ReactNode };
  right: { title: string; rows: { label: string; value: string }[]; takeLabel: string; takeValue: ReactNode };
  footnote?: string;
  badge?: string;
}) {
  return (
    <section className={styles.math}>
      {/* Compare heading rises; the two cards fly in from opposite sides
          so the "vs" comparison literally clashes on entry. */}
      <motion.div className={styles.mathHeader} {...animRise}>
        {eyebrow && <div className={styles.introEyebrow}>{eyebrow}</div>}
        <h2 className={styles.introHeading}>{heading}</h2>
        {body && <p className={styles.introBody}>{body}</p>}
      </motion.div>
      <div className={styles.compareGrid}>
        <motion.article
          className={`${styles.compareCard} ${styles.compareCardMuted}`}
          {...animFromLeft}
        >
          <div className={styles.compareTitle}>{left.title}</div>
          <div className={styles.compareRows}>
            {left.rows.map((r) => (
              <div className={styles.compareRow} key={r.label}>
                <span>{r.label}</span>
                <span>{r.value}</span>
              </div>
            ))}
          </div>
          <div className={styles.compareTake}>
            <span>{left.takeLabel}</span>
            <span className={styles.compareTakeValue}>{left.takeValue}</span>
          </div>
        </motion.article>

        <motion.div
          className={styles.compareVs}
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={inView}
          transition={{ duration: 0.45, delay: 0.25, ease }}
        >
          {badge}
        </motion.div>

        <motion.article
          className={`${styles.compareCard} ${styles.compareCardHero}`}
          {...animFromRight}
        >
          <div className={styles.compareTitle}>{right.title}</div>
          <div className={styles.compareRows}>
            {right.rows.map((r) => (
              <div className={styles.compareRow} key={r.label}>
                <span>{r.label}</span>
                <span>{r.value}</span>
              </div>
            ))}
          </div>
          <div className={`${styles.compareTake} ${styles.compareTakeHi}`}>
            <span>{right.takeLabel}</span>
            <span className={styles.compareTakeValue}>{right.takeValue}</span>
          </div>
        </motion.article>
      </div>
      {footnote && <p className={styles.mathFoot}>{footnote}</p>}
    </section>
  );
}

/* ------- Scenarios block — two side-by-side cards, no vs ------- */
/* Used when the two cards are *complementary* situations a buyer
   can be in (off-plan vs secondary), not a head-to-head competitor
   comparison. Same card chrome as PersonaCompare but no clashing
   entry animation and no center badge. */
export function PersonaScenarios({
  eyebrow,
  heading,
  body,
  cards,
  footnote,
}: {
  eyebrow?: string;
  heading: ReactNode;
  body?: ReactNode;
  cards: {
    title: string;
    tag?: string;
    rows: { label: string; value: string }[];
    takeLabel: string;
    takeValue: ReactNode;
  }[];
  footnote?: string;
}) {
  return (
    <section className={styles.math}>
      <motion.div className={styles.mathHeader} {...animRise}>
        {eyebrow && <div className={styles.introEyebrow}>{eyebrow}</div>}
        <h2 className={styles.introHeading}>{heading}</h2>
        {body && <p className={styles.introBody}>{body}</p>}
      </motion.div>
      <div className={styles.scenariosGrid}>
        {cards.map((c, i) => (
          <motion.article
            key={c.title}
            className={`${styles.compareCard} ${styles.compareCardHero}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.55, delay: 0.05 * i, ease }}
          >
            {c.tag && <div className={styles.scenarioTag}>{c.tag}</div>}
            <div className={styles.compareTitle}>{c.title}</div>
            <div className={styles.compareRows}>
              {c.rows.map((r) => (
                <div className={styles.compareRow} key={r.label}>
                  <span>{r.label}</span>
                  <span>{r.value}</span>
                </div>
              ))}
            </div>
            <div className={`${styles.compareTake} ${styles.compareTakeHi}`}>
              <span>{c.takeLabel}</span>
              <span className={styles.compareTakeValue}>{c.takeValue}</span>
            </div>
          </motion.article>
        ))}
      </div>
      {footnote && <p className={styles.mathFoot}>{footnote}</p>}
    </section>
  );
}

/* ------- Audience block ------- */
export function PersonaAudience({
  heading,
  body,
  items,
}: {
  heading: ReactNode;
  body?: ReactNode;
  items: { title: string; body: string }[];
}) {
  return (
    <section className={styles.audience}>
      {/* Audience heading from the LEFT, items stagger-rise. */}
      <motion.div className={styles.stepsHeader} {...animFromLeft}>
        <h2 className={styles.introHeading}>{heading}</h2>
        {body && <p className={styles.introBody}>{body}</p>}
      </motion.div>
      <div className={styles.audienceList}>
        {items.map((it, i) => (
          <motion.div
            className={styles.audienceItem}
            key={it.title}
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.5, delay: i * 0.07, ease }}
          >
            <span className={styles.audienceCheck} aria-hidden="true">
              ✓
            </span>
            <div className={styles.audienceBody}>
              <h3>{it.title}</h3>
              <p>{it.body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ------- Features grid ------- */
export function PersonaFeatures({
  eyebrow,
  heading,
  body,
  items,
}: {
  eyebrow?: string;
  heading: ReactNode;
  body?: ReactNode;
  items: { title: string; body: string }[];
}) {
  return (
    <section className={styles.features}>
      {/* Features heading from RIGHT, cards rise with stagger. */}
      <motion.div className={styles.stepsHeader} {...animFromRight}>
        {eyebrow && <div className={styles.introEyebrow}>{eyebrow}</div>}
        <h2 className={styles.introHeading}>{heading}</h2>
        {body && <p className={styles.introBody}>{body}</p>}
      </motion.div>
      <div className={styles.featureGrid}>
        {items.map((it, i) => (
          <motion.article
            className={styles.featureCard}
            key={it.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.55, delay: i * 0.06, ease }}
          >
            <h3>{it.title}</h3>
            <p>{it.body}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

/* ------- Market facts ------- */
export function PersonaFacts({
  heading,
  items,
}: {
  heading: ReactNode;
  items: { stat: string; label: string }[];
}) {
  return (
    <section className={styles.facts}>
      {/* Facts heading rises; stat cards scale-in with stagger so each
          number "lands" individually. */}
      <motion.div className={styles.stepsHeader} {...animRise}>
        <h2 className={styles.introHeading}>{heading}</h2>
      </motion.div>
      <div className={styles.factGrid}>
        {items.map((it, i) => (
          <motion.div
            className={styles.factCard}
            key={it.label}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={inView}
            transition={{ duration: 0.5, delay: i * 0.08, ease }}
          >
            <div className={styles.factStat}>{it.stat}</div>
            <div className={styles.factLabel}>{it.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ------- Quote block ------- */
export function PersonaQuote({
  quote,
  name,
  role,
}: {
  quote: string;
  name: string;
  role: string;
}) {
  return (
    <section className={styles.quote}>
      {/* Quote scale-pops in. A "moment" beat in the page rhythm. */}
      <motion.blockquote className={styles.quoteBody} {...animScale}>
        &ldquo;{quote}&rdquo;
      </motion.blockquote>
      <motion.figcaption
        className={styles.quoteMeta}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={inView}
        transition={{ duration: 0.5, delay: 0.2, ease }}
      >
        <span className={styles.quoteName}>{name}</span>
        <span className={styles.quoteRole}>{role}</span>
      </motion.figcaption>
    </section>
  );
}

/* ------- Final CTA ------- */
export function PersonaCta({
  heading,
  body,
  cta,
}: {
  heading: ReactNode;
  body?: ReactNode;
  cta: { label: string; href: string };
}) {
  return (
    <section className={styles.cta}>
      {/* Final CTA: heading rises, button scale-pops in. */}
      <motion.h2 className={styles.ctaHeading} {...animRise}>
        {heading}
      </motion.h2>
      {body && (
        <motion.p
          className={styles.ctaSub}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inView}
          transition={{ duration: 0.5, delay: 0.1, ease }}
        >
          {body}
        </motion.p>
      )}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={inView}
        transition={{ duration: 0.5, delay: 0.2, ease }}
      >
        <button
          type="button"
          className={styles.btnBlueLg}
          data-get-started
        >
          {cta.label}
        </button>
      </motion.div>
    </section>
  );
}

/* ------- FAQ ------- */
/* ------- Inline waitlist (embeds the homepage Typeform on a
   persona page so users can sign up without going back home) ------- */
export function PersonaWaitlist({
  heading,
  body,
  defaultIntent,
  hideIntent,
}: {
  heading: ReactNode;
  body?: ReactNode;
  defaultIntent?: 'buyer' | 'closer';
  hideIntent?: boolean;
}) {
  return (
    <section className={styles.personaWaitlist} id="waitlist">
      <motion.h2 className={styles.ctaHeading} {...animRise}>
        {heading}
      </motion.h2>
      {body && (
        <motion.p
          className={styles.ctaSub}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inView}
          transition={{ duration: 0.5, delay: 0.1, ease }}
        >
          {body}
        </motion.p>
      )}
      <motion.div
        className={styles.personaWaitlistInner}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={inView}
        transition={{ duration: 0.6, delay: 0.2, ease }}
      >
        <WaitlistForm defaultIntent={defaultIntent} hideIntent={hideIntent} />
      </motion.div>
    </section>
  );
}

export function PersonaFaq({
  heading,
  items,
}: {
  heading: ReactNode;
  items: { q: string; a: string }[];
}) {
  const [open, setOpen] = useState<number | null>(null);
  const answerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleToggle = (index: number) => {
    const isCurrentlyOpen = open === index;
    setOpen(isCurrentlyOpen ? null : index);

    // Smooth height reveal with staggered effects
    if (!isCurrentlyOpen && answerRefs.current[index]) {
      const answerDiv = answerRefs.current[index];
      const buttonDiv = buttonRefs.current[index];

      // Animate the container height
      gsap.fromTo(
        answerDiv,
        {
          opacity: 0,
          height: 0,
          paddingTop: 0,
          paddingBottom: 0,
        },
        {
          opacity: 1,
          height: 'auto',
          paddingTop: 22,
          paddingBottom: 22,
          duration: 0.5,
          ease: 'power3.out'
        }
      );

      // Animate the answer text with stagger
      const paragraphs = answerDiv.querySelectorAll('p');
      gsap.fromTo(
        paragraphs,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          delay: 0.1,
          ease: 'power2.out',
        }
      );

      // Button background animation
      gsap.to(buttonDiv, {
        backgroundColor: 'rgba(0, 113, 227, 0.08)',
        duration: 0.3,
        ease: 'power2.out',
      });
    } else if (isCurrentlyOpen && buttonRefs.current[index]) {
      // Reset button background when closing
      gsap.to(buttonRefs.current[index], {
        backgroundColor: 'transparent',
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  return (
    <section className={styles.faq}>
      <div className={styles.faqInner}>
        {/* FAQ heading from LEFT, items stagger-rise. */}
        <motion.div className={styles.faqHeader} {...animFromLeft}>
          <h2 className={styles.introHeading}>{heading}</h2>
        </motion.div>
        <div className={styles.faqList}>
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={it.q}
                className={`${styles.faqItem} ${
                  isOpen ? styles.faqItemOpen : ''
                }`}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inView}
                transition={{ duration: 0.45, delay: i * 0.05, ease }}
              >
                <button
                  ref={(el) => {
                    buttonRefs.current[i] = el;
                  }}
                  type="button"
                  className={styles.faqQ}
                  onClick={() => handleToggle(i)}
                  aria-expanded={isOpen}
                >
                  <span>{it.q}</span>
                  <span className={styles.faqChev} aria-hidden="true">
                    ›
                  </span>
                </button>
                {isOpen && (
                  <div
                    ref={(el) => {
                      answerRefs.current[i] = el;
                    }}
                    className={styles.faqA}
                  >
                    <p>{it.a}</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
