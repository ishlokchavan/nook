import type { Metadata } from 'next';
import Link from 'next/link';
import { Building2, Users, Tag, BadgeCheck, Wallet, Gift, Receipt, Landmark, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CREDIT_AED_RATE, REDEEM_METHODS, type IconKey } from '@/lib/portal/credits';

export const metadata: Metadata = {
  title: 'Redeem iClose Credits',
  description:
    'Redeem iClose Credits as cashback to your bank, off-plan payments, service-fee offsets, or gift them to a friend. 1 credit = 0.5 AED.',
};

const ICONS: Record<IconKey, React.ComponentType<{ className?: string }>> = {
  building: Building2, users: Users, tag: Tag, badge: BadgeCheck,
  wallet: Wallet, gift: Gift, receipt: Receipt, bank: Landmark,
};

export default function CreditsRedeemPage() {
  return (
    <div className="container-wide py-12">
      <Link href="/credits" className="inline-flex items-center gap-1 text-[14px] text-graphite hover:text-ink mb-5">
        <ChevronLeft className="h-4 w-4 rtl:rotate-180" /> Back to credits
      </Link>

      <header className="mb-10">
        <h1 className="display-md">Redeem your credits</h1>
        <p className="subhead mt-3 max-w-2xl">
          Every credit is worth {CREDIT_AED_RATE} AED. Choose how you want to use them.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {REDEEM_METHODS.map((method) => {
          const Icon = ICONS[method.iconKey];
          return (
            <article key={method.title} className="card-surface p-6 flex items-start gap-4">
              <span className="flex items-center justify-center h-12 w-12 rounded-full bg-journey-offplan/15 shrink-0">
                <Icon className="h-5 w-5 text-ink" />
              </span>
              <div>
                <h2 className="text-[17px] font-semibold text-ink" style={{ letterSpacing: '-0.015em' }}>{method.title}</h2>
                <p className="text-[14px] text-graphite-dark mt-1.5">{method.body}</p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="card-mist rounded-apple px-6 py-5 mt-8 text-[13px] text-graphite-dark">
        Redemption availability and minimums depend on your account verification and the transaction
        type. Sign in to see your live balance and redeem.
      </div>

      <div className="mt-8">
        <Link href="/login">
          <Button variant="primary" size="lg">Sign in to redeem</Button>
        </Link>
      </div>
    </div>
  );
}
