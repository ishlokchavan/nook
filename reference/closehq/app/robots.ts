import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        // The public site is a single buyer-focused landing page at the
        // root. Everything else (legacy persona routes, forms, internal
        // pages) is kept out of the index so crawlers only see one route.
        allow: '/',
        disallow: [
          '/api/',
          '/for-buyers',
          '/for-closers',
          '/for-collaborators',
          '/specialists',
          '/partners',
          '/team',
          '/careers',
          '/verify',
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
