import type { ReactNode } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import styles from './iclose-landing.module.css';
import { ICloseFooter } from './iclose-footer';

type LegalShellProps = {
  title: string;
  eyebrow?: string;
  lastUpdated: string;
  children: ReactNode;
  prev?: { href: string; label: string };
  next?: { href: string; label: string };
};

export function LegalShell({
  title,
  eyebrow = 'Legal',
  lastUpdated,
  children,
  prev,
  next,
}: LegalShellProps) {
  return (
    <div className={styles.root}>
      <nav className={styles.legalNav}>
        <Logo />
        <Link href="/" className={styles.legalBackLink}>
          ← Back to home
        </Link>
      </nav>

      <main className={styles.legalMain}>
        <header className={styles.legalHeader}>
          <div className={styles.legalEyebrow}>{eyebrow}</div>
          <h1 className={styles.legalTitle}>{title}</h1>
          <p className={styles.legalLastUpdated}>Last updated: {lastUpdated}</p>
        </header>

        <div className={styles.legalSections}>{children}</div>

        {(prev || next) && (
          <div className={styles.legalPagination}>
            {prev ? (
              <Link href={prev.href}>← {prev.label}</Link>
            ) : (
              <span />
            )}
            {next ? <Link href={next.href}>{next.label} →</Link> : <span />}
          </div>
        )}
      </main>

      <ICloseFooter />
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className={styles.legalSection}>
      <h2>{title}</h2>
      <div className={styles.legalBody}>{children}</div>
    </section>
  );
}

export function LegalAddress({
  brand,
  email,
  locality = 'Dubai, UAE',
}: {
  brand: string;
  email: string;
  locality?: string;
}) {
  return (
    <address className={styles.legalAddress}>
      <strong>{brand}</strong>
      <span className={styles.legalAddressMeta}>{locality}</span>
      <a href={`mailto:${email}`}>{email}</a>
    </address>
  );
}
