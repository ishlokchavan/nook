import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Supabase Storage serves project images; allow remote patterns once the
  // project URL is known. Tighten the hostname when env is wired.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      // Demo feed imagery (seed data). Real posts use Supabase Storage.
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
