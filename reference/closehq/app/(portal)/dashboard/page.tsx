'use client';

import Link from 'next/link';
import { Building2, Heart, Wallet, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/portal/auth-provider';

const TILES = [
  { href: '/sell/list', icon: Building2, title: 'My listings', body: 'List a property or manage your submissions.' },
  { href: '/properties', icon: Heart, title: 'Saved properties', body: 'Properties you’ve shortlisted.' },
  { href: '/credits', icon: Wallet, title: 'Credits', body: 'Track and redeem your iClose credits.' },
  { href: '/developers/enquire', icon: FileText, title: 'My enquiries', body: 'Off-plan and developer enquiries.' },
];

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="container-wide py-24 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-graphite" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-wide py-24 text-center">
        <h1 className="display-sm">You’re signed out</h1>
        <p className="subhead mt-3">Sign in to view your dashboard.</p>
        <Link href="/login" className="inline-block mt-6">
          <Button variant="primary" size="lg">Sign in</Button>
        </Link>
      </div>
    );
  }

  const meta = user.user_metadata ?? {};
  const name = (meta.full_name as string) || (meta.name as string) || user.email?.split('@')[0] || 'there';
  const role = ((user.app_metadata as Record<string, unknown>)?.role as string) || 'member';

  return (
    <div className="container-wide py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[13px] uppercase tracking-[0.12em] text-graphite">Dashboard</p>
          <h1 className="display-sm mt-1">Welcome, {name}.</h1>
        </div>
        <span className="inline-flex items-center rounded-full bg-mist px-3.5 py-1.5 text-[13px] text-ink capitalize">
          {role}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
        {TILES.map((t) => (
          <Link key={t.href} href={t.href} className="card-surface p-6 group hover:shadow-card-hover transition-shadow">
            <span className="flex items-center justify-center h-11 w-11 rounded-full bg-journey-buyer/15 mb-4">
              <t.icon className="h-5 w-5 text-ink" />
            </span>
            <h2 className="text-[16px] font-semibold text-ink" style={{ letterSpacing: '-0.015em' }}>{t.title}</h2>
            <p className="text-[14px] text-graphite-dark mt-1.5">{t.body}</p>
          </Link>
        ))}
      </div>

      <div className="card-mist rounded-apple px-6 py-5 mt-8 text-[13px] text-graphite-dark">
        Role-specific dashboards (buyer / seller, agent, agency, admin) are coming next — this is your
        starting view.
      </div>
    </div>
  );
}
