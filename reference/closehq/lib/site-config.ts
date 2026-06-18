export const siteConfig = {
  name: 'iClose',
  legalName: 'iClose Real Estate Platform',
  description:
    'Buy, sell and close Dubai real estate without ever paying commission. Search properties, off-plan new releases, transactions and agents across the UAE.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://iclose.ae',
  ogImage: '/og-image.jpg',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@iclose.ae',
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '',
  address: {
    locality: 'Dubai',
    country: 'AE',
  },
  keywords: [
    'Dubai real estate',
    'buy property Dubai',
    'sell property Dubai',
    'Dubai off-plan',
    'new projects Dubai',
    'zero commission real estate',
    'Dubai property transactions',
    'iClose',
  ],
} as const;
