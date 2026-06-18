import type { Metadata, Viewport } from 'next';
import { Inter, Inter_Tight, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import { siteConfig } from '@/lib/site-config';
import { getLocale } from '@/lib/i18n/server';
import { dirFor } from '@/lib/i18n/config';
import { CookieConsent } from '@/components/cookie-consent';
import { GetStartedProvider } from '@/components/get-started-modal';
import { PropertyInquiryProvider } from '@/components/property-inquiry-modal';
import './globals.css';

const fontDisplay = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['200', '300', '400', '500', '600'],
  display: 'swap',
});

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'iClose — Never Pay Commission to Buy, Sell or Close',
    template: '%s | iClose',
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: 'iClose' }],
  creator: 'iClose',
  openGraph: {
    type: 'website',
    locale: 'en_AE',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: 'iClose — Never Pay Commission to Buy, Sell or Close',
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'iClose — buy, sell and close Dubai real estate without commission',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'iClose — Never Pay Commission to Buy, Sell or Close',
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
  },
  category: 'Real Estate',
  // Installable-PWA / iOS add-to-home-screen.
  applicationName: 'iClose',
  appleWebApp: {
    capable: true,
    title: 'iClose',
    statusBarStyle: 'default',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const dir = dirFor(locale);
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.legalName,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.svg`,
    description: siteConfig.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dubai',
      addressCountry: 'AE',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: siteConfig.email,
      areaServed: 'AE',
      availableLanguage: ['English', 'Arabic'],
    },
    sameAs: [],
  };

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
  };

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable}`}
    >
      <body className="font-sans bg-paper text-ink antialiased">
        <GetStartedProvider>
          <PropertyInquiryProvider>{children}</PropertyInquiryProvider>
        </GetStartedProvider>

        {/* Structured Data, not tracking, always loads */}
        <Script
          id="ld-org"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <Script
          id="ld-website"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />

        {/* GA4 + Meta Pixel load only after cookie consent, see CookieConsent component */}
        <CookieConsent />
      </body>
    </html>
  );
}
