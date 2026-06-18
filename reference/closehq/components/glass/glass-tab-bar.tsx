'use client';

import { useEffect, useState, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Flame, Search, Map, User } from 'lucide-react';

const TABS = [
  { href: '/experience',          label: 'Home',    Icon: Home,  match: (p: string) => p === '/experience' },
  { href: '/experience/trending', label: 'Trending', Icon: Flame, match: (p: string) => p.startsWith('/experience/trending') },
  { href: '/experience/search',   label: 'Search',  Icon: Search, match: (p: string) => p.startsWith('/experience/search') },
  { href: '/experience/map',      label: 'Map',     Icon: Map,   match: (p: string) => p.startsWith('/experience/map') },
  { href: '/experience/profile',  label: 'Profile', Icon: User,  match: (p: string) => p.startsWith('/experience/profile') },
];

/** Full-screen surfaces hide the tab bar so it can't overlap their own chrome. */
const HIDE_ON = [
  '/experience/property',
  '/experience/launches',
  '/experience/login',
  '/experience/sell',
];

export function GlassTabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [, startTransition] = useTransition();
  // Optimistic target — highlight the tapped tab instantly, before the route
  // has finished mounting, so taps feel native even on a heavier screen.
  const [target, setTarget] = useState<string | null>(null);

  // Warm every tab route up-front so switching is just a client mount, not a
  // server round-trip.
  useEffect(() => {
    for (const t of TABS) router.prefetch(t.href);
  }, [router]);

  // Clear the optimistic target once the real route catches up.
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
              aria-current={active ? 'page' : undefined}
              className={`relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 active:scale-90 ${
                active ? 'bg-ink text-white shadow-[0_4px_14px_rgba(0,0,0,0.25)]' : 'text-graphite-dark'
              }`}
            >
              <Icon
                className="h-[22px] w-[22px]"
                strokeWidth={active ? 2.4 : 1.9}
                fill={active && label === 'Home' ? 'currentColor' : 'none'}
                aria-hidden
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
