import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export const metadata = { title: "Offline · Nook" };

/**
 * Offline fallback served by the service worker when a navigation fails with no
 * network. Kept dependency-free so it renders from cache alone.
 */
export default function OfflinePage() {
  return (
    <main className="container flex min-h-dvh flex-col items-center justify-center gap-4 py-16 text-center">
      <h1 className="text-2xl font-bold tracking-tight">You&apos;re offline</h1>
      <p className="max-w-sm text-muted-foreground">
        Nook can&apos;t reach the network right now. Check your connection — your
        saved pages are still here.
      </p>
      <Link href="/app" className={buttonVariants()}>
        Back to the feed
      </Link>
    </main>
  );
}
