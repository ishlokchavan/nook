import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { ICloseFooter } from '@/components/sections/iclose-landing/iclose-footer';
import styles from '@/components/persona/persona.module.css';

export const metadata: Metadata = {
  title: 'Team · iClose',
  description:
    'Meet the people building iClose. A UAE real estate platform for closers, collaborators, and buyers.',
};

export default function TeamPage() {
  return (
    <div className={styles.root}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.backLink} aria-label="Back to home">
          <span aria-hidden="true">←</span>
          <Logo />
        </Link>
        <Link href="/#waitlist" className={styles.navCta}>
          Get started
        </Link>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroInner} style={{ display: 'block', textAlign: 'center', maxWidth: 720 }}>
          <span className={styles.personaTag} style={{ alignSelf: 'center' }}>
            The team
          </span>
          <h1 style={{ margin: '24px auto 18px' }}>
            Built by closers,
            <br />
            <span>for closers.</span>
          </h1>
          <p style={{ margin: '0 auto', maxWidth: 580 }}>
            We&apos;re a small team of UAE real estate operators, engineers,
            and designers building iClose from Dubai. Full bios and the
            founder story are coming soon. For now, the fastest way to meet
            us is to book a call.
          </p>
          <div className={styles.heroCtas} style={{ justifyContent: 'center', marginTop: 28 }}>
            <a
              href={
                process.env.NEXT_PUBLIC_CALENDLY_URL ||
                'https://calendly.com/hello-iclose/30min'
              }
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnBlue}
            >
              Book a call
            </a>
            <Link href="/" className={styles.btnLink}>
              Back to home
            </Link>
          </div>
        </div>
      </section>

      <ICloseFooter />
    </div>
  );
}
