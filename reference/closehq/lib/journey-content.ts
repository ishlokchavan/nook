/**
 * Content for the shared journey-page template (Buy / Sell / List / Close and
 * their children). One template, swapped copy — per the product sketch
 * ("same layout for Sell / List / Close"). Each page is data only here.
 */

import type { JourneyKey } from './portal-config';

export interface ExplainerCard {
  title: string;
  body: string;
  cta?: { label: string; href: string };
}

export interface JourneyFaq {
  q: string;
  a: string;
}

export interface JourneyContent {
  /** Brand tint key — drives the gradient wash + accents. */
  tint: JourneyKey;
  eyebrow: string;
  h1: string;
  h2: string;
  primaryCta: { label: string; href: string };
  /** Whether to show the Ready ⇄ Off-Plan toggle (buyer/seller journeys). */
  showReadyToggle: boolean;
  explainerTitle: string;
  explainer: ExplainerCard[];
  kpis: { value: string; label: string }[];
  faqs: JourneyFaq[];
  finalCta: { title: string; body: string; cta: { label: string; href: string } };
}

export const JOURNEY_CONTENT: Record<string, JourneyContent> = {
  buy: {
    tint: 'buy',
    eyebrow: 'For buyers',
    h1: 'Buy property in Dubai — and keep the commission.',
    h2: 'Browse ready and off-plan homes, and get 100% of the agent commission back on every deal.',
    primaryCta: { label: 'Browse properties', href: '/properties' },
    showReadyToggle: true,
    explainerTitle: 'How buying with iClose works',
    explainer: [
      { title: 'Search transparently', body: 'Explore ready and off-plan listings with real prices and no inflated fees.', cta: { label: 'Search properties', href: '/properties' } },
      { title: 'Buy direct', body: 'Deal directly through the platform — no commission padded onto your purchase.', cta: { label: 'See how', href: '/buy' } },
      { title: 'Get cashback & credits', body: 'Earn 100% cashback on agent commission, plus credits on off-plan investments.', cta: { label: 'Credits explained', href: '/credits' } },
    ],
    kpis: [
      { value: '0%', label: 'Commission to buy' },
      { value: '100%', label: 'Cashback on agent fees' },
      { value: '7', label: 'Top developers covered' },
    ],
    faqs: [
      { q: 'Do I really pay no commission?', a: 'Yes. Buyers never pay commission on iClose, and you get 100% of the agent commission back as cashback.' },
      { q: 'Can I buy off-plan?', a: 'Yes — browse New Releases for off-plan launches with special pricing, payment plans and credits.' },
      { q: 'Is this only for Dubai?', a: 'We focus on Dubai and the wider UAE secondary and off-plan markets.' },
    ],
    finalCta: { title: 'Ready to buy with zero commission?', body: 'Start browsing ready and off-plan homes across Dubai.', cta: { label: 'Browse properties', href: '/properties' } },
  },
  sell: {
    tint: 'sell',
    eyebrow: 'For sellers',
    h1: 'Sell your property without paying commission.',
    h2: 'List as the owner, reach serious buyers, and close on your terms.',
    primaryCta: { label: 'List your property', href: '/sell/list/new' },
    showReadyToggle: false,
    explainerTitle: 'How selling with iClose works',
    explainer: [
      { title: 'List as the owner', body: 'Create a compliant listing as the owner or power of attorney, with ownership verification.', cta: { label: 'List your property', href: '/sell/list/new' } },
      { title: 'Reach real buyers', body: 'Your property is shown to verified buyers searching across the platform.' },
      { title: 'Close on your terms', body: 'Sell directly, or sell now through iClose — without paying commission.', cta: { label: 'Sell now', href: '/sell/sell-now' } },
    ],
    kpis: [
      { value: '0%', label: 'Seller commission' },
      { value: 'Verified', label: 'Ownership-checked listings' },
      { value: 'Direct', label: 'Buyer connections' },
    ],
    faqs: [
      { q: 'Who can list a property?', a: 'Property owners or holders of a power of attorney. We verify ownership to keep listings genuine.' },
      { q: 'What about agents?', a: 'Agents list under Close using a RERA Form A (Contract A) listing agreement.' },
      { q: 'Is there a Trakheesi permit requirement?', a: 'Public advertising of Dubai listings generally requires a Trakheesi permit. We confirm how this applies before your listing goes live.' },
    ],
    finalCta: { title: 'List your property today', body: 'Reach verified buyers and sell without commission.', cta: { label: 'List your property', href: '/sell/list/new' } },
  },
  close: {
    tint: 'close',
    eyebrow: 'For agents & agencies',
    h1: 'Close deals and keep 100% of your commission.',
    h2: 'Freelancers, agents and agencies list, manage and close — without giving commission away.',
    primaryCta: { label: 'List with Contract A', href: '/close/list-with-ca/new' },
    showReadyToggle: false,
    explainerTitle: 'How closing with iClose works',
    explainer: [
      { title: 'List with Contract A', body: 'List compliantly using a RERA Form A broker listing agreement.', cta: { label: 'List with Contract A', href: '/close/list-with-ca/new' } },
      { title: 'Manage in the portal', body: 'Run your listings, leads and deals from the brokerage portal.', cta: { label: 'Open brokerage portal', href: '/close/brokerage' } },
      { title: 'Keep 100% commission', body: 'Close deals on the platform and keep all of your commission.' },
    ],
    kpis: [
      { value: '100%', label: 'Commission kept' },
      { value: 'RERA', label: 'Form A compliant' },
      { value: 'All-in-one', label: 'Brokerage portal' },
    ],
    faqs: [
      { q: 'Who is Close for?', a: 'Freelance brokers, RERA agents and agencies who want to keep all of their commission.' },
      { q: 'What is Contract A?', a: 'The RERA Form A broker listing agreement required to list a property as an agent in Dubai.' },
      { q: 'Do I need a brokerage license?', a: 'Agent listings require valid RERA credentials. We verify these as part of onboarding.' },
    ],
    finalCta: { title: 'Start closing with iClose', body: 'List with Contract A and keep 100% of your commission.', cta: { label: 'List with Contract A', href: '/close/list-with-ca/new' } },
  },
};

/** Child journeys reuse the parent template tint + a focused copy override. */
export const JOURNEY_CONTENT_CHILDREN: Record<string, JourneyContent> = {
  'sell/list': {
    ...JOURNEY_CONTENT.sell,
    eyebrow: 'For sellers',
    h1: 'List your property as the owner.',
    h2: 'A compliant owner / power-of-attorney listing with ownership verification — no commission.',
    primaryCta: { label: 'Start your listing', href: '/sell/list/new' },
    finalCta: { title: 'Create your owner listing', body: 'Verify ownership and reach verified buyers.', cta: { label: 'Start your listing', href: '/sell/list/new' } },
  },
  'sell/sell-now': {
    ...JOURNEY_CONTENT.sell,
    eyebrow: 'For sellers',
    h1: 'Sell now, directly through iClose.',
    h2: 'Move faster with a direct sale — without paying commission.',
    primaryCta: { label: 'Request a valuation', href: '/sell/sell-now' },
    finalCta: { title: 'Sell your property now', body: 'Get started with a direct sale through iClose.', cta: { label: 'Request a valuation', href: '/sell/sell-now' } },
  },
  'close/list-with-ca': {
    ...JOURNEY_CONTENT.close,
    eyebrow: 'For agents & agencies',
    h1: 'List with Contract A (RERA Form A).',
    h2: 'List compliantly as a broker and keep 100% of your commission.',
    primaryCta: { label: 'Start a Contract A listing', href: '/close/list-with-ca/new' },
    finalCta: { title: 'List with Contract A', body: 'Compliant broker listings, 100% commission kept.', cta: { label: 'Start a Contract A listing', href: '/close/list-with-ca/new' } },
  },
  'close/brokerage': {
    ...JOURNEY_CONTENT.close,
    eyebrow: 'For agents & agencies',
    h1: 'Your brokerage portal.',
    h2: 'Manage listings, leads and deals in one place — and keep all your commission.',
    primaryCta: { label: 'Open the brokerage portal', href: '/close/brokerage' },
    finalCta: { title: 'Run your brokerage on iClose', body: 'Listings, leads and deals in one portal.', cta: { label: 'Open the brokerage portal', href: '/close/brokerage' } },
  },
};
