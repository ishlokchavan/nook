/**
 * Portal information architecture.
 *
 * Decisions locked with product:
 *  - List lives UNDER Sell (nav = Buy · Sell · Close). `List w/ CA` lives under Close.
 *  - Auth is the existing Supabase-backed flow.
 *  - Transactions = DLD-style sold-price explorer.
 *  - Developer / "talk to an expert" handoffs are form → CRM/email for now.
 *
 * Keep this as the single source of truth for portal nav + search verticals so
 * the header, the home search tabs, and per-route pages stay in sync.
 */

export type JourneyKey = 'buy' | 'sell' | 'close';

export interface NavChild {
  label: string;
  href: string;
  description?: string;
  /** Key into Messages['nav'] for localized label/description. */
  i18nKey?: 'sellList' | 'sellNow' | 'listWithCa' | 'brokerage';
}

export interface NavItem {
  /** Journey key — drives the brand tint via JOURNEY_ACCENT. */
  key: JourneyKey;
  label: string;
  href: string;
  children?: NavChild[];
}

/** Top-level journey nav. List is a child of Sell; List w/ CA a child of Close. */
export const PORTAL_NAV: NavItem[] = [
  {
    key: 'buy',
    label: 'Buy',
    href: '/buy',
  },
  {
    key: 'sell',
    label: 'Sell',
    href: '/sell',
    children: [
      { label: 'List your property', href: '/sell/list', description: 'List as the owner or POA', i18nKey: 'sellList' },
      { label: 'Sell now', href: '/sell/sell-now', description: 'Sell directly through iClose', i18nKey: 'sellNow' },
    ],
  },
  {
    key: 'close',
    label: 'Close',
    href: '/close',
    children: [
      { label: 'List with Contract A', href: '/close/list-with-ca', description: 'RERA Form A broker listing', i18nKey: 'listWithCa' },
      { label: 'Brokerage portal', href: '/close/brokerage', description: 'For agents, agencies & freelancers', i18nKey: 'brokerage' },
    ],
  },
];

/** Tailwind text/border/bg tint per journey (uses the `journey.*` palette). */
export const JOURNEY_ACCENT: Record<JourneyKey, { text: string; ring: string; wash: string }> = {
  buy: { text: 'text-ink', ring: 'ring-journey-buyer', wash: 'bg-journey-buyer/10' },
  sell: { text: 'text-ink', ring: 'ring-journey-seller', wash: 'bg-journey-seller/10' },
  close: { text: 'text-ink', ring: 'ring-journey-agent', wash: 'bg-journey-agent/10' },
};

export type SearchTabKey = 'properties' | 'new-releases' | 'transactions' | 'agents';

export interface SearchTab {
  key: SearchTabKey;
  label: string;
  href: string;
  /** Accent color used on the search bar / submit button for this vertical. */
  accent: 'red' | 'green';
}

/** Home search verticals — order matches the Figma tab strip. */
export const SEARCH_TABS: SearchTab[] = [
  { key: 'properties', label: 'Properties', href: '/properties', accent: 'red' },
  { key: 'new-releases', label: 'New Releases', href: '/new-releases', accent: 'green' },
  { key: 'transactions', label: 'Transactions', href: '/transactions', accent: 'red' },
  { key: 'agents', label: 'Agents', href: '/agents', accent: 'red' },
];

/** Supported locales. Arabic forces full RTL. */
export const LOCALES = [
  { code: 'en', label: 'English', dir: 'ltr' as const },
  { code: 'ru', label: 'Русский', dir: 'ltr' as const },
  { code: 'ar', label: 'العربية', dir: 'rtl' as const },
  { code: 'zh', label: '中文', dir: 'ltr' as const },
  { code: 'hi', label: 'हिन्दी', dir: 'ltr' as const },
];
