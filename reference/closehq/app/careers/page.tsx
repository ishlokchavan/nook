import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { ICloseFooter } from '@/components/sections/iclose-landing/iclose-footer';
import { CareersForm } from '@/components/sections/iclose-landing/careers-form';

export const metadata: Metadata = {
  title: 'Careers, iClose',
  description:
    'Paid internship opportunities at iClose. Content Creation, Marketing, Copywriting, Investment Analysis, Research, and Investor Relations.',
};

const ROLES: { title: string; meta: string }[] = [
  { title: 'Content Creation', meta: 'Paid internship · Dubai' },
  { title: 'Marketing', meta: 'Paid internship · Dubai' },
  { title: 'Copywriter', meta: 'Paid internship · Dubai / Remote' },
  { title: 'Investment Analysis', meta: 'Paid internship · Dubai' },
  { title: 'Research', meta: 'Paid internship · Dubai / Remote' },
  { title: 'Investor Relations', meta: 'Paid internship · Dubai' },
];

const WHAT_YOULL_DO = [
  'Film, edit, and produce engaging digital content in our in-house studio.',
  'Host our videos and engage with our audience as the face of our content.',
  'Write copy for social media, ads, and marketing campaigns.',
  'Conduct research and analyse market trends.',
  'Contribute to strategic decision-making.',
];

const WHATS_IN_IT = [
  'High-paying, performance-based commission.',
  'Hands-on mentorship and real-world training.',
  'Exposure to high-level business environments.',
  'Fast-track learning across multiple domains.',
  'See how a real business operates, end to end.',
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />
        <Link href="/" className="text-[14px] text-graphite hover:text-ink transition-colors">← Back to home</Link>
      </nav>

      <main className="max-w-6xl mx-auto px-6">
        {/* Hero */}
        <section className="pt-16 sm:pt-24 pb-16 border-b border-hairline">
          <p className="text-[13px] uppercase tracking-[0.14em] text-graphite font-medium">Careers — iClose</p>
          <h1 className="mt-6 font-medium tracking-tight leading-[0.92] text-[clamp(52px,10vw,128px)]">
            Come build<br />with us.
          </h1>
          <p className="mt-10 max-w-2xl text-[19px] sm:text-[21px] leading-relaxed text-graphite-dark">
            iClose is reinventing how people buy, sell and close real estate in Dubai — without commission.
            We&apos;re a small, fast team that ships. These are paid internships with real mentorship,
            real responsibility, and real growth.
          </p>
        </section>

        {/* Open positions — editorial list */}
        <section className="py-16">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-[22px] font-medium tracking-tight">Open positions</h2>
            <span className="text-[14px] text-graphite">{ROLES.length} roles</span>
          </div>
          <ul className="border-t border-hairline">
            {ROLES.map((role) => (
              <li key={role.title}>
                <a
                  href="#apply"
                  className="group flex items-center justify-between gap-6 py-7 border-b border-hairline transition-colors"
                >
                  <span className="font-medium tracking-tight leading-none text-[clamp(26px,4.5vw,44px)] text-ink group-hover:text-accent transition-colors">
                    {role.title}
                  </span>
                  <span className="flex items-center gap-5 shrink-0">
                    <span className="hidden sm:block text-[14px] text-graphite">{role.meta}</span>
                    <ArrowUpRight className="h-6 w-6 text-graphite group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* What you'll do / What's in it for you */}
        <section className="py-16 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-hairline">
          {[
            { heading: 'What you’ll do', items: WHAT_YOULL_DO },
            { heading: 'What’s in it for you', items: WHATS_IN_IT },
          ].map((col) => (
            <div key={col.heading}>
              <h3 className="text-[13px] uppercase tracking-[0.14em] text-graphite font-medium mb-6">{col.heading}</h3>
              <ul className="space-y-4 text-[17px] leading-relaxed text-graphite-dark">
                {col.items.map((t) => (
                  <li key={t} className="flex gap-3">
                    <span className="text-ink shrink-0">—</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Apply */}
        <section id="apply" className="py-16 border-t border-hairline scroll-mt-20">
          <h2 className="font-medium tracking-tight leading-[0.95] text-[clamp(34px,6vw,64px)]">Apply in a minute.</h2>
          <p className="mt-4 mb-10 max-w-xl text-[18px] text-graphite-dark">
            Tell us who you are and what you&apos;d love to work on. We read every application.
          </p>
          <CareersForm />
        </section>
      </main>

      <ICloseFooter />
    </div>
  );
}
