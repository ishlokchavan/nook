'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { Logo } from '@/components/ui/logo';
import { ICloseFooter } from '@/components/sections/iclose-landing/iclose-footer';
import styles from './persona.module.css';

type PersonaShellProps = {
  variant: 'broker' | 'collaborator';
  tagLabel: string;
  heroImage: string;
  heroAlt: string;
  headline: ReactNode;
  sub: ReactNode;
  pillars: { title: string; body: string }[];
  outcomes: { stat: string; label: string }[];
  testimonial: { quote: string; name: string; role: string };
  ctaLabel?: string;
};

export function PersonaShell({
  variant,
  tagLabel,
  heroImage,
  heroAlt,
  headline,
  sub,
  pillars,
  outcomes,
  testimonial,
  ctaLabel = 'Join the waitlist',
}: PersonaShellProps) {
  const tagCls =
    variant === 'broker' ? styles.personaTag : styles.personaTagAlt;

  return (
    <div className={styles.root}>
      <nav className={styles.nav}>
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
        <button type="button" className={styles.navCta} data-get-started>
          Get started
        </button>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <span className={tagCls}>{tagLabel}</span>
            <h1>{headline}</h1>
            <p>{sub}</p>
            <div className={styles.heroCtas}>
              <button
                type="button"
                className={styles.btnBlue}
                data-get-started
              >
                {ctaLabel}
              </button>
              <Link href="/" className={styles.btnLink}>
                Back to overview
              </Link>
            </div>
          </div>
          <div className={styles.heroMedia}>
            <Image
              src={heroImage}
              alt={heroAlt}
              fill
              sizes="(max-width: 820px) 100vw, 560px"
              className={styles.heroImg}
              priority
            />
          </div>
        </div>
      </section>

      <section className={styles.pillars}>
        <div className={styles.wrap}>
          <h2 className={styles.sectionHeading}>What you get.</h2>
          <div className={styles.pillarGrid}>
            {pillars.map((p, i) => (
              <article key={p.title} className={styles.pillar}>
                <div className={styles.pillarNum}>0{i + 1}</div>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.outcomes}>
        <div className={styles.wrap}>
          <h2 className={styles.sectionHeading}>What changes.</h2>
          <div className={styles.outcomeGrid}>
            {outcomes.map((o) => (
              <div key={o.label} className={styles.outcome}>
                <div className={styles.outcomeStat}>{o.stat}</div>
                <div className={styles.outcomeLabel}>{o.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.quote}>
        <div className={styles.wrap}>
          <blockquote className={styles.quoteBody}>
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>
          <figcaption className={styles.quoteMeta}>
            <span className={styles.quoteName}>{testimonial.name}</span>
            <span className={styles.quoteRole}>{testimonial.role}</span>
          </figcaption>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.wrap}>
          <h2 className={styles.ctaHeading}>{ctaLabel}.</h2>
          <p className={styles.ctaSub}>
            Be one of the first to get access.
          </p>
          <button
            type="button"
            className={styles.btnBlueLg}
            data-get-started
          >
            {ctaLabel}
          </button>
        </div>
      </section>

      <ICloseFooter />
    </div>
  );
}
