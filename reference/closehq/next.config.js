/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // Allow ngrok/tunneled dev URLs so HMR/asset requests aren't rejected
  // as cross-origin. Tighten to a specific subdomain when sharing externally.
  allowedDevOrigins: [
    '*.ngrok-free.dev',
    '*.ngrok-free.app',
    '*.ngrok.io',
    '*.trycloudflare.com',
  ],
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      // Generated persona photography for the "Who is this for?" cards.
      // Vercel + local dev both reach this CDN; only the sandbox build
      // container does not, which is why these aren't vendored to /public.
      {
        protocol: 'https',
        hostname: 'd8j0ntlcm91z4.cloudfront.net',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    qualities: [70, 75, 80, 85, 90],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
  // Permanently redirect the old broker slug so any bookmark, share
  // link, or stale referral that points to /for-brokers lands on the
  // new /for-closers route.
  async redirects() {
    return [
      {
        source: '/for-brokers',
        destination: '/for-closers',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
