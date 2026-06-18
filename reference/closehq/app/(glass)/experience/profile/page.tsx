'use client';

import Link from 'next/link';
import {
  Heart,
  Eye,
  Flame,
  Wallet,
  FileText,
  Settings,
  ChevronRight,
  RotateCcw,
  Coins,
  Plus,
  LogIn,
  LogOut,
} from 'lucide-react';
import { useSaved } from '@/components/glass/saved-store';
import { useSignals } from '@/components/glass/signal-store';
import { useExperience } from '@/components/glass/experience-provider';
import { useAuth } from '@/components/portal/auth-provider';
import { formatCredits } from '@/lib/glass/experience-data';

export default function ProfilePage() {
  const { listings } = useExperience();
  const { decisions, savedRefs, reset } = useSaved();
  const { reset: resetSignals } = useSignals();
  const { user, signOut } = useAuth();

  const seen = Object.keys(decisions).length;
  const pendingCredits = listings
    .filter((l) => decisions[l.reference] === 'saved')
    .reduce((sum, l) => sum + l.credit.credits, 0);

  const name =
    (user?.user_metadata?.full_name as string | undefined) ||
    user?.email?.split('@')[0] ||
    'Guest';
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="no-scrollbar h-[100svh] overflow-y-scroll bg-mist px-4 pb-40 pt-[max(20px,env(safe-area-inset-top))]">
      {/* Identity */}
      <header className="mb-5 mt-2 flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ink text-[22px] font-semibold text-white">
          {initial}
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-[22px] font-semibold tracking-tight text-ink">{name}</h1>
          <p className="truncate text-[14px] text-graphite">
            {user ? user.email : 'Sign in to sync your shortlist & credits'}
          </p>
        </div>
      </header>

      {!user && (
        <Link
          href="/experience/login"
          className="mb-4 flex items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-[15px] font-semibold text-white active:scale-[0.98]"
        >
          <LogIn className="h-[18px] w-[18px]" /> Sign in or create account
        </Link>
      )}

      {/* List your property */}
      <Link
        href="/experience/sell"
        className="mb-4 flex items-center gap-3 rounded-[22px] bg-gradient-to-r from-ink to-graphite-dark p-4 text-white active:scale-[0.99]"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
          <Plus className="h-6 w-6" />
        </span>
        <div className="flex-1">
          <p className="text-[15px] font-semibold">List your property</p>
          <p className="text-[13px] text-white/65">Sell direct · commission-free</p>
        </div>
        <ChevronRight className="h-5 w-5 text-white/60" />
      </Link>

      {/* Credits balance */}
      <section className="mb-4 rounded-[22px] bg-paper p-5">
        <div className="flex items-center gap-2 text-graphite">
          <Coins className="h-4 w-4 text-accent" />
          <span className="text-[13px]">iClose credits balance</span>
        </div>
        <p className="mt-1.5 text-[34px] font-semibold leading-none tracking-tight text-ink">0</p>
        <div className="mt-3 flex items-center justify-between border-t border-hairline/70 pt-3">
          <span className="text-[13px] text-graphite">
            {formatCredits(pendingCredits)} credits across your shortlist
          </span>
          <Link href="/experience/saved" className="text-[13px] font-medium text-accent">
            View
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-4 grid grid-cols-2 gap-2.5">
        <Stat icon={<Heart className="h-5 w-5" />} value={savedRefs.length} label="Saved" />
        <Stat icon={<Eye className="h-5 w-5" />} value={seen} label="Viewed" />
      </section>

      {/* Menu */}
      <section className="card-surface overflow-hidden">
        <Row href="/experience/saved" icon={<Heart className="h-[18px] w-[18px]" />} label="My shortlist" trailing={`${savedRefs.length}`} />
        <Divider />
        <Row href="/experience/trending" icon={<Flame className="h-[18px] w-[18px]" />} label="Trending launches" />
        <Divider />
        <Row soon icon={<FileText className="h-[18px] w-[18px]" />} label="My deals" />
        <Divider />
        <Row href="/credits" icon={<Wallet className="h-[18px] w-[18px]" />} label="Credits & rewards" />
        <Divider />
        <Row soon icon={<Settings className="h-[18px] w-[18px]" />} label="Settings" />
      </section>

      {user ? (
        <button
          type="button"
          onClick={() => signOut()}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-hairline bg-paper py-3.5 text-[14px] font-medium text-graphite-dark active:scale-[0.98]"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            reset();
            resetSignals();
          }}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-hairline bg-paper py-3.5 text-[14px] font-medium text-graphite-dark active:scale-[0.98]"
        >
          <RotateCcw className="h-4 w-4" /> Reset my activity
        </button>
      )}

      <p className="mt-5 text-center text-[12px] text-graphite-light">
        Liquid Glass concept · iClose experience
      </p>
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="card-surface flex flex-col items-center gap-1 py-4">
      <span className="text-graphite">{icon}</span>
      <span className="text-[22px] font-semibold leading-none text-ink">{value}</span>
      <span className="text-[12px] text-graphite">{label}</span>
    </div>
  );
}

function Row({
  href,
  icon,
  label,
  trailing,
  soon,
}: {
  href?: string;
  icon: React.ReactNode;
  label: string;
  trailing?: string;
  /** Feature not shipped yet — render a non-interactive "Soon" row. */
  soon?: boolean;
}) {
  if (soon || !href) {
    return (
      <div className="flex items-center gap-3 px-4 py-3.5 text-ink/40" aria-disabled>
        <span>{icon}</span>
        <span className="flex-1 text-[15px] font-medium">{label}</span>
        <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[11px] font-semibold text-graphite">Soon</span>
      </div>
    );
  }
  return (
    <Link href={href} className="flex items-center gap-3 px-4 py-3.5 text-ink active:bg-mist">
      <span className="text-graphite-dark">{icon}</span>
      <span className="flex-1 text-[15px] font-medium">{label}</span>
      {trailing && <span className="text-[14px] text-graphite">{trailing}</span>}
      <ChevronRight className="h-4 w-4 text-graphite-light" />
    </Link>
  );
}

function Divider() {
  return <div className="mx-4 h-px bg-hairline/70" />;
}
