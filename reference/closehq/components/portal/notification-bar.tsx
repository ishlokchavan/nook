'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '@/components/i18n/locale-provider';

/**
 * Off-plan / credits promo bar. Sits ABOVE the nav (per Figma) and is one of
 * several entry points into the credits / developer-discounts flow.
 */
export function NotificationBar() {
  const { messages } = useI18n();
  const notif = messages.home.notif;
  // Bold the value half (after the first question mark) for emphasis.
  const m = notif.match(/^(.*?[?؟])\s*(.*)$/);
  const lead = m ? m[1] : notif;
  const tail = m ? m[2] : '';

  return (
    <Link href="/credits" className="block bg-[#ffd9dc] hover:bg-[#ffcdd1] transition-colors">
      <div className="container-wide py-3 sm:py-3.5 flex items-center justify-center gap-1.5 text-center text-[13px] sm:text-[14px] text-ink">
        <span>
          {lead} {tail && <strong className="font-semibold">{tail}</strong>}
        </span>
        <span className="text-accent inline-flex items-center gap-0.5 font-semibold whitespace-nowrap">
          {messages.home.learnMore} <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
        </span>
      </div>
    </Link>
  );
}
