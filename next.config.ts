import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Supabase Storage serves project images; allow remote patterns once the
  // project URL is known. Tighten the hostname when env is wired.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
