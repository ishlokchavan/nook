import type { MetadataRoute } from "next";

/**
 * PWA manifest — makes Nook installable to the home screen on Android and
 * desktop (and complements the apple-touch-icon for iOS). Icons are generated
 * by scripts/gen-pwa-icons.mjs into /public/icons.
 *
 * start_url points at the app experience so launching the installed icon drops
 * straight into the feed, while scope stays at the origin so links out still
 * open inside the installed app.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nook — Dubai interiors marketplace",
    short_name: "Nook",
    description:
      "Find Dubai's best carpenters, contractors and interior designers through their work.",
    start_url: "/app",
    id: "/app",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FAFAF8",
    theme_color: "#FAFAF8",
    categories: ["business", "lifestyle", "shopping"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
