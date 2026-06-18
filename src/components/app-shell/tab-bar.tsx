"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Home, Search, ClipboardList, Heart, User } from "lucide-react";

const TABS = [
  { href: "/app", label: "Feed", Icon: Home, match: (p: string) => p === "/app" },
  {
    href: "/app/search",
    label: "Search",
    Icon: Search,
    match: (p: string) => p.startsWith("/app/search"),
  },
  {
    href: "/app/requests",
    label: "Requests",
    Icon: ClipboardList,
    match: (p: string) => p.startsWith("/app/requests"),
  },
  {
    href: "/app/saved",
    label: "Saved",
    Icon: Heart,
    match: (p: string) => p.startsWith("/app/saved"),
  },
  {
    href: "/app/profile",
    label: "Profile",
    Icon: User,
    match: (p: string) => p.startsWith("/app/profile"),
  },
];

/** Full-screen surfaces (e.g. post detail) can hide the bar via this prefix list. */
const HIDE_ON = ["/app/post"];

/**
 * Floating glass bottom tab bar — the primary app-shell navigation. Adapted
 * from closehq's GlassTabBar: optimistic active highlight, route prefetching
 * and safe-area inset, restyled to Nook's honey accent.
 */
export function TabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [target, setTarget] = useState<string | null>(null);

  // Warm every tab route so switching is a client mount, not a round-trip.
  useEffect(() => {
    for (const t of TABS) router.prefetch(t.href);
  }, [router]);

  useEffect(() => {
    setTarget(null);
  }, [pathname]);

  if (HIDE_ON.some((p) => pathname.startsWith(p))) return null;

  const activePath = target ?? pathname;

  function navigate(href: string) {
    if (href === pathname) return;
    setTarget(href);
    startTransition(() => router.push(href));
  }

  return (
    <nav
      className="pointer-events-none absolute inset-x-0 bottom-0 z-50 flex justify-center pb-[max(14px,env(safe-area-inset-bottom))]"
      aria-label="Primary"
    >
      <div className="lg-glass-light pointer-events-auto flex items-center gap-0.5 rounded-full p-1.5">
        {TABS.map(({ href, label, Icon, match }) => {
          const active = match(activePath);
          return (
            <button
              key={href}
              type="button"
              onClick={() => navigate(href)}
              onPointerEnter={() => router.prefetch(href)}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={`relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 active:scale-90 ${
                active
                  ? "bg-primary text-primary-foreground shadow-[0_4px_14px_rgba(190,127,51,0.4)]"
                  : "text-muted-foreground"
              }`}
            >
              <Icon
                className="h-[22px] w-[22px]"
                strokeWidth={active ? 2.4 : 1.9}
                fill={active && label === "Saved" ? "currentColor" : "none"}
                aria-hidden
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
