import { Header } from '@/components/header';
import { Footer } from '@/components/sections/footer';
import { SpecialistForm } from '@/components/specialist-form';
import { Reveal } from '@/components/ui/reveal';
import { Check, ChevronRight, MapPin, Users, BadgeCheck, Megaphone, Handshake } from 'lucide-react';

export const metadata = {
  title: 'Apply as a Specialist, iClose',
  description:
    'Apply to join iClose as a Specialist. Share deep area knowledge, development intelligence, and community expertise that powers the deal desk and iClose Academy.',
};

const WHAT_YOU_DO = [
  {
    icon: MapPin,
    title: 'Own your area.',
    body: 'Your deep knowledge of a specific community, building, or asset class becomes structured content, the kind that changes how a Member walks into a deal.',
  },
  {
    icon: Megaphone,
    title: 'Stay active in every transaction.',
    body: "When a Member has a buyer requirement, the Specialist who knows that area best is matched directly. Your expertise doesn't sit idle, it closes deals.",
  },
  {
    icon: BadgeCheck,
    title: 'Get recognised for what you know.',
    body: 'Specialists are vetted. That mark means something on a platform where credibility is earned, you become the first and only call when a Member needs your domain.',
  },
];

const PERKS = [
  {
    icon: Users,
    label: 'Direct buyer access',
    body: 'Connect with a growing pool of agents, lawyers, accountants, family offices, etc. who have active, serious buyers.',
  },
  {
    icon: Megaphone,
    label: 'Platform amplification',
    body: 'iClose publishes and promotes your knowledge. Your expertise reaches Members every week, positioning you as the authority in your domain.',
  },
  {
    icon: Handshake,
    label: 'Matched inquiries, not cold leads',
    body: 'When a requirement falls within your area, you are the only Specialist notified. No competition, no noise, just the right buyer at the right time.',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Apply',
    body: 'Fill in the form with your area of expertise, active inventory, and professional background. Takes under five minutes.',
  },
  {
    num: '02',
    title: 'Get vetted',
    body: "Our team reviews your application. We look for genuine depth, transaction history, area knowledge, and real skin in the game.",
  },
  {
    num: '03',
    title: 'Go live',
    body: "Once approved, your profile is published and your domain is activated. When a Member's requirement matches your area, you're the call.",
  },
];

const TESTIMONIALS = [
  {
    initials: 'A.R.',
    name: 'Ahmad R.',
    role: 'Downtown Dubai Expert',
    quote:
      'Turning what I know into structured content made me sharper. My expertise went from something I carried in my head to something that reaches active brokers every week.',
  },
  {
    initials: 'S.K.',
    name: 'Sarah K.',
    role: 'Palm Jumeirah Expert',
    quote:
      "I used to share my knowledge over the phone, one person at a time. Now it reaches serious buyers across the platform every week. That kind of leverage changes how you think about what you know.",
  },
];

export default function SpecialistsPage() {
  return (
    <>
      <Header />
      <main id="top">

        {/* ── Hero + Form ─────────────────────────────────────────────── */}
        <section className="bg-paper border-b border-hairline min-h-screen flex items-center pt-12">
          <div className="container-wide w-full flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-20 py-12 lg:py-0">

            {/* Left */}
            <div className="lg:flex-1 flex flex-col justify-center">
              <Reveal>
                <span className="inline-flex items-center px-3 py-1 rounded-full border border-hairline bg-mist text-[11px] font-medium tracking-[0.08em] uppercase text-graphite mb-6">
                  Specialists
                </span>
              </Reveal>
              <Reveal delay={0.05}>
                <h1
                  className="font-display font-semibold text-ink text-balance"
                  style={{ fontSize: 'clamp(2.2rem, 5vw, 4.5rem)', lineHeight: 1.06, letterSpacing: '-0.03em' }}
                >
                  Turn what you know into a revenue stream.
                </h1>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-5 text-graphite-dark leading-[1.55] max-w-lg" style={{ fontSize: 'clamp(1rem, 1.3vw, 1.15rem)', letterSpacing: '-0.012em' }}>
                  iClose Specialists build the market intelligence that active Members rely on to close, area playbooks, development deep-dives, and community analysis from people still in the market.
                </p>
              </Reveal>
              {/* <Reveal delay={0.15}>
                <ul className="mt-8 space-y-3">
                  {[
                    'Vetted and recognised by the platform',
                    'Matched directly to buyers in your domain',
                    'Earn up to 100% on every transaction',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-[15px] text-ink" style={{ letterSpacing: '-0.01em' }}>
                      <Check className="h-4 w-4 text-ink flex-shrink-0" strokeWidth={2.5} />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal> */}
            </div>

            {/* Right: form */}
            <Reveal delay={0.1} className="w-full lg:w-[440px] shrink-0">
              <div className="bg-white rounded-apple border border-hairline p-6 sm:p-8 shadow-elevated">
                {/* <p className="text-[13px] font-medium text-graphite tracking-tight mb-6">Apply as a Specialist</p> */}
                <SpecialistForm />
              </div>
            </Reveal>

          </div>
        </section>

        {/* ── What you do ─────────────────────────────────────────────── */}
        <section className="bg-mist py-16 sm:py-20 md:py-24 lg:py-28">
          <div className="container-wide">
            <Reveal>
              <h2
                className="font-display font-semibold text-ink text-balance mb-14 md:mb-16"
                style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)', lineHeight: 1.1, letterSpacing: '-0.025em' }}
              >
                What it means to be a Specialist on iClose.
              </h2>
            </Reveal>
            <div className="grid md:grid-cols-3 gap-4">
              {WHAT_YOU_DO.map((item, i) => {
                const Icon = item.icon;
                return (
                  <Reveal key={item.title} delay={i * 0.08}>
                    <div className="card-surface p-8 sm:p-10 h-full flex flex-col">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-mist border border-hairline mb-6">
                        <Icon className="h-5 w-5 text-ink" strokeWidth={1.5} />
                      </div>
                      <h3
                        className="font-display font-semibold text-ink mb-3"
                        style={{ fontSize: 'clamp(1.1rem, 1.5vw, 1.4rem)', letterSpacing: '-0.02em', lineHeight: 1.15 }}
                      >
                        {item.title}
                      </h3>
                      <p className="text-[16px] text-graphite-dark leading-[1.5] flex-1" style={{ letterSpacing: '-0.012em' }}>
                        {item.body}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Perks ───────────────────────────────────────────────────── */}
        <section className="bg-paper py-16 sm:py-20 md:py-24 lg:py-28">
          <div className="container-wide">
            <div className="flex flex-col lg:flex-row lg:gap-20 gap-12">

              {/* Left: heading */}
              <div className="lg:w-80 xl:w-96 shrink-0">
                <Reveal>
                  <h2
                    className="font-display font-semibold text-ink text-balance"
                    style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)', lineHeight: 1.1, letterSpacing: '-0.025em' }}
                  >
                    What you get out of it.
                  </h2>
                </Reveal>
                <Reveal delay={0.05}>
                  <p className="mt-4 text-[16px] text-graphite-dark leading-[1.55]" style={{ letterSpacing: '-0.012em' }}>
                    iClose gives Specialists the reach, the recognition, and the revenue that comes with being the best in your domain.
                  </p>
                </Reveal>
              </div>

              {/* Right: perk grid */}
              <div className="flex-1 grid sm:grid-cols-3 gap-4">
                {PERKS.map((perk, i) => {
                  const Icon = perk.icon;
                  return (
                    <Reveal key={perk.label} delay={i * 0.07}>
                      <div className="card-mist p-6 sm:p-8 h-full flex flex-col">
                        <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white border border-hairline mb-4">
                          <Icon className="h-4 w-4 text-ink" strokeWidth={1.5} />
                        </div>
                        <p className="text-[13px] font-medium text-graphite tracking-tight mb-2">{perk.label}</p>
                        <p className="text-[15px] text-graphite-dark leading-[1.5] flex-1" style={{ letterSpacing: '-0.012em' }}>
                          {perk.body}
                        </p>
                      </div>
                    </Reveal>
                  );
                })}
              </div>

            </div>
          </div>
        </section>

        {/* ── How to join ─────────────────────────────────────────────── */}
        <section className="bg-mist py-16 sm:py-20 md:py-24 lg:py-28">
          <div className="container-wide">
            <Reveal>
              <h2
                className="font-display font-semibold text-ink text-balance mb-14 md:mb-16"
                style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)', lineHeight: 1.1, letterSpacing: '-0.025em' }}
              >
                How it works.
              </h2>
            </Reveal>
            <div className="grid md:grid-cols-3 gap-4">
              {STEPS.map((step, i) => (
                <Reveal key={step.num} delay={i * 0.08}>
                  <div className="card-surface p-8 sm:p-10 h-full flex flex-col">
                    <span
                      className="font-display font-semibold text-graphite-light mb-8 block"
                      style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.03em', lineHeight: 1 }}
                    >
                      {step.num}
                    </span>
                    <h3
                      className="font-display font-semibold text-ink mb-3"
                      style={{ fontSize: 'clamp(1.1rem, 1.5vw, 1.4rem)', letterSpacing: '-0.02em', lineHeight: 1.15 }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-[16px] text-graphite-dark leading-[1.5] flex-1" style={{ letterSpacing: '-0.012em' }}>
                      {step.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ─────────────────────────────────────────────── */}
        <section className="bg-paper py-16 sm:py-20 md:py-24 lg:py-28">
          <div className="container-wide">
            <Reveal>
              <h2
                className="font-display font-semibold text-ink text-balance mb-14 md:mb-16"
                style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)', lineHeight: 1.1, letterSpacing: '-0.025em' }}
              >
                Experts who turned expertise into leverage.
              </h2>
            </Reveal>
            <div className="grid md:grid-cols-2 gap-4">
              {TESTIMONIALS.map((t, i) => (
                <Reveal key={t.initials} delay={i * 0.08}>
                  <figure className="card-surface p-8 sm:p-10 flex flex-col h-full">
                    <blockquote
                      className="text-[17px] text-ink leading-[1.55] text-balance flex-1"
                      style={{ letterSpacing: '-0.012em' }}
                    >
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-8 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-mist border border-hairline">
                        <span className="text-[12px] font-medium text-ink">{t.initials}</span>
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-ink tracking-tight">{t.name}</p>
                        <p className="text-[12px] text-graphite tracking-tight">{t.role}</p>
                      </div>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ───────────────────────────────────────────────── */}
        <section className="bg-mist border-t border-hairline py-16 sm:py-20 md:py-24">
          <div className="container-wide flex flex-col items-center text-center">
            <Reveal>
              <h2
                className="font-display font-semibold text-ink text-balance max-w-2xl"
                style={{ fontSize: 'clamp(1.8rem, 4vw, 3.5rem)', lineHeight: 1.06, letterSpacing: '-0.028em' }}
              >
                Ready to put your expertise to work?
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-4 text-[17px] text-graphite-dark leading-[1.5] max-w-lg" style={{ letterSpacing: '-0.012em' }}>
                Applications take under five minutes. If you have real depth in a Dubai area or building, we want to hear from you.
              </p>
            </Reveal>
            <Reveal delay={0.14}>
              <a
                href="#top"
                className="mt-8 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-ink text-white text-[15px] font-medium hover:bg-ink/85 transition-colors"
                style={{ letterSpacing: '-0.01em' }}
              >
                Apply now
                <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
              </a>
            </Reveal>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
