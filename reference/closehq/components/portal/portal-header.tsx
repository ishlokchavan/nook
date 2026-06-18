'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, Globe, Menu, X, User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PORTAL_NAV, type NavItem, type JourneyKey } from '@/lib/portal-config';
import { useI18n } from '@/components/i18n/locale-provider';
import { useAuth } from '@/components/portal/auth-provider';
import { LOCALES } from '@/lib/i18n/config';

function isActive(pathname: string, item: NavItem) {
  return pathname === item.href || pathname.startsWith(item.href + '/');
}

export function PortalHeader() {
  const pathname = usePathname();
  const { messages, locale, setLocale } = useI18n();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const navLabel = (key: JourneyKey) => messages.nav[key];

  return (
    <header className="sticky top-0 z-50 bg-paper/80 backdrop-blur-2xl border-b border-hairline/60">
      <div className="container-wide flex items-center justify-between h-14">
        <Link href="/" aria-label="iClose home">
          <Logo variant="dark" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {PORTAL_NAV.map((item) => (
            <div
              key={item.href}
              className="relative"
              onMouseEnter={() => item.children && setOpenMenu(item.href)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <Link
                href={item.href}
                className={cn(
                  'inline-flex items-center gap-1 px-4 py-1.5 text-[15px] rounded-full transition-colors',
                  isActive(pathname, item)
                    ? 'text-ink font-medium'
                    : 'text-ink/80 hover:text-ink hover:bg-mist',
                )}
                style={{ letterSpacing: '-0.01em' }}
              >
                {navLabel(item.key)}
                {item.children && <ChevronDown className="h-3.5 w-3.5 opacity-60" />}
              </Link>

              <AnimatePresence>
                {item.children && openMenu === item.href && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute start-0 top-full pt-2 w-64"
                  >
                    <div className="card-surface shadow-elevated p-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block rounded-xl px-3 py-2.5 hover:bg-mist transition-colors"
                        >
                          <span className="block text-[14px] text-ink" style={{ letterSpacing: '-0.01em' }}>
                            {child.i18nKey ? messages.nav[child.i18nKey] : child.label}
                          </span>
                          {child.description && (
                            <span className="block text-[12px] text-graphite mt-0.5">
                              {child.i18nKey
                                ? messages.nav[`${child.i18nKey}Desc` as keyof typeof messages.nav]
                                : child.description}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Desktop right: language + auth */}
        <div className="hidden md:flex items-center gap-2">
          <LanguagePill />
          {user ? (
            <UserMenu />
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">{messages.nav.signIn}</Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary" size="sm">{messages.nav.signUp}</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMobileOpen((s) => !s)}
          className="md:hidden flex items-center justify-center h-9 w-9 text-ink rounded-full hover:bg-mist transition-colors"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-paper border-t border-hairline shadow-elevated"
          >
            <div className="container-wide py-2 flex flex-col">
              {PORTAL_NAV.map((item) => (
                <div key={item.href} className="border-b border-hairline/60 last:border-b-0">
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-4 text-ink text-[17px]"
                    style={{ letterSpacing: '-0.012em' }}
                  >
                    {navLabel(item.key)}
                  </Link>
                  {item.children && (
                    <div className="pb-3 ps-4 flex flex-col gap-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="text-[15px] text-graphite-dark"
                        >
                          {child.i18nKey ? messages.nav[child.i18nKey] : child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {/* Language (not available elsewhere on mobile) */}
              <div className="py-4 border-b border-hairline/60">
                <div className="flex items-center gap-1.5 text-[13px] text-graphite mb-2">
                  <Globe className="h-3.5 w-3.5" /> Language
                </div>
                <div className="flex flex-wrap gap-2">
                  {LOCALES.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => { setLocale(l.code); setMobileOpen(false); }}
                      className={cn(
                        'h-9 px-3.5 rounded-full border text-[13px] transition-colors',
                        l.code === locale ? 'border-accent text-accent bg-accent/5 font-medium' : 'border-hairline text-ink/80',
                      )}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
              {user ? (
                <div className="py-4 flex flex-col gap-2">
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" size="md" className="w-full">Dashboard</Button>
                  </Link>
                  <Button variant="ghost" size="md" className="w-full" onClick={() => { signOut(); setMobileOpen(false); }}>Sign out</Button>
                </div>
              ) : (
                <div className="py-4 flex gap-2">
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1">
                    <Button variant="outline" size="md" className="w-full">{messages.nav.signIn}</Button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileOpen(false)} className="flex-1">
                    <Button variant="primary" size="md" className="w-full">{messages.nav.signUp}</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/** Signed-in avatar + dropdown (name/email, Dashboard, Sign out). */
function UserMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  if (!user) return null;
  const meta = user.user_metadata ?? {};
  const name = (meta.full_name as string) || (meta.name as string) || user.email?.split('@')[0] || 'Account';
  const avatar = (meta.avatar_url as string) || (meta.picture as string) || null;

  return (
    <div className="relative" onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => setOpen((s) => !s)}
        onMouseEnter={() => setOpen(true)}
        className="flex items-center gap-2 h-9 ps-1 pe-2.5 rounded-full border border-hairline hover:border-ink/40 transition-colors"
      >
        <span className="flex items-center justify-center h-7 w-7 rounded-full bg-mist overflow-hidden text-graphite">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt="" className="h-full w-full object-cover" />
          ) : (
            <UserIcon className="h-4 w-4" />
          )}
        </span>
        <span className="text-[13px] text-ink max-w-[120px] truncate">{name}</span>
        <ChevronDown className="h-3.5 w-3.5 text-graphite" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute end-0 top-full pt-2 w-56"
          >
            <div className="card-surface shadow-elevated p-1.5">
              <div className="px-3 py-2 border-b border-hairline/60 mb-1">
                <p className="text-[13px] text-ink font-medium truncate">{name}</p>
                <p className="text-[12px] text-graphite truncate">{user.email}</p>
              </div>
              <Link href="/dashboard" className="flex items-center gap-2 rounded-lg px-3 py-2 text-[14px] text-ink hover:bg-mist transition-colors">
                <LayoutDashboard className="h-4 w-4 text-graphite" /> Dashboard
              </Link>
              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-[14px] text-ink hover:bg-mist transition-colors text-start"
              >
                <LogOut className="h-4 w-4 text-graphite" /> Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Language switcher pill (the pill next to Sign in in the Figma). Sets the
 * locale cookie and reloads so server content + <html dir> update (RTL for AR).
 */
function LanguagePill() {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => setOpen((s) => !s)}
        onMouseEnter={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-hairline text-[13px] text-ink/80 hover:text-ink hover:border-ink/40 transition-colors uppercase"
      >
        <Globe className="h-3.5 w-3.5" />
        {locale}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute end-0 top-full pt-2 w-40"
          >
            <div className="card-surface shadow-elevated p-1.5">
              {LOCALES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLocale(l.code)}
                  className={cn(
                    'w-full text-start rounded-lg px-3 py-2 text-[13px] hover:bg-mist transition-colors',
                    l.code === locale ? 'text-accent font-medium' : 'text-ink',
                  )}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
