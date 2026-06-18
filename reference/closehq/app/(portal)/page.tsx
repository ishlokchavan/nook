import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { SearchPanel } from '@/components/portal/search/search-panel';
import { MeshGradient } from '@/components/portal/mesh-gradient';
import { getFilterOptions } from '@/lib/portal/filters';
import { getI18n } from '@/lib/i18n/server';
import type { LocaleCode } from '@/lib/i18n/config';
import type { Messages } from '@/lib/i18n/dictionaries';

export const metadata: Metadata = {
  title: 'iClose — Never Pay Commission to Buy, Sell, or Close',
  description:
    'Search Dubai property, off-plan new releases, transactions and agents. Buy, sell and close real estate in the UAE without paying commission.',
};

// Generated Dubai real-estate imagery. To move to owned storage:
//   1) run `bash scripts/fetch-home-images.sh` (downloads to public/images/home)
//   2) commit the PNGs and set LOCAL_IMAGES = true below.
const LOCAL_IMAGES = false;
const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_373qi3JTSvYmXjqMPJT9idOjFt7';
const IMG = (local: string, remote: string) => (LOCAL_IMAGES ? `/images/home/${local}` : `${CDN}/${remote}`);
const HOME_CARDS: { href: string; title: string; badge: string; image: string }[] = [
  { href: '/buy', title: 'Looking to buy?', badge: '0% commission · 100% cashback', image: IMG('buy.png', 'hf_20260616_222225_d0f4e2b8-36a6-46aa-9625-324f1714414c.png') },
  { href: '/sell', title: 'Looking to sell?', badge: 'List free · sell without commission', image: IMG('sell.png', 'hf_20260616_222230_e9003974-fd28-47cb-9667-44b1485ce165.png') },
  { href: '/close', title: 'Want to list or close?', badge: 'Agents keep 100% of the commission', image: IMG('close.png', 'hf_20260616_222236_b69f84e1-cbcb-452d-841d-63c07a0ada81.png') },
];

/** The commission headline — bold Buy/Sell/Close in English, plain otherwise. */
function CommissionHeadline({ locale, t, className }: { locale: LocaleCode; t: Messages['home']; className?: string }) {
  if (locale === 'en') {
    return (
      <span className={`font-normal ${className ?? ''}`}>
        Never Pay Commission to <span className="font-bold">Buy</span>,{' '}
        <span className="font-bold">Sell</span>, Or <span className="font-bold">Close</span> Ever Again!
      </span>
    );
  }
  return <span className={className}>{t.heroTitle}</span>;
}

export default async function PortalHomePage() {
  const { locale, messages } = await getI18n();
  const filterOptions = await getFilterOptions();
  const t = messages.home;

  return (
    <>
      {/* Hero + tabbed search over the mesh-gradient wash (Figma mid-fi) */}
      {/* Clip only the gradient layer (not the section) so open search dropdowns aren't cut off. */}
      <section className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <MeshGradient className="-top-24" />
        </div>
        <div className="relative container-wide pt-20 pb-20 text-center">
          <h1 className="display-lg max-w-4xl mx-auto text-balance">
            <CommissionHeadline locale={locale} t={t} />
          </h1>
          <p className="subhead mt-5 max-w-2xl mx-auto">
            {t.heroSub}
            <Link href="/credits" className="applelink ms-1.5 text-[15px] align-baseline">
              {t.learnMore} <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
            </Link>
          </p>
          <div className="mt-6">
            <Link
              href="/experience"
              className="inline-flex items-center gap-2 rounded-full bg-ink text-white px-5 py-2.5 text-[14px] font-medium shadow-card hover:shadow-card-hover transition-shadow"
            >
              <Sparkles className="h-4 w-4" />
              Explore homes the new way
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>
          <div className="mt-10">
            <SearchPanel initial="properties" options={filterOptions} />
          </div>
        </div>
      </section>

      {/* Journey cards — each its own question + incentive */}
      <section className="container-wide pb-24 -mt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {HOME_CARDS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group relative overflow-hidden rounded-apple min-h-[240px] flex flex-col justify-between p-6 shadow-card hover:shadow-card-hover transition-shadow"
            >
              {/* Generated Dubai imagery + dark overlay for legibility */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={card.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20 group-hover:from-black/75 transition-colors" />

              {/* Incentive pill */}
              <span className="relative w-fit rounded-full bg-white/90 backdrop-blur text-ink text-[12px] font-medium px-3 py-1">
                {card.badge}
              </span>

              {/* Title + Learn more */}
              <div className="relative">
                <h2 className="text-[24px] sm:text-[26px] font-semibold text-white" style={{ letterSpacing: '-0.02em' }}>
                  {card.title}
                </h2>
                <span className="mt-2 inline-flex items-center gap-1 text-[15px] text-white font-medium">
                  {t.learnMore}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
