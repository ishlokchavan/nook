import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({
  className,
  variant = 'dark',
}: {
  className?: string;
  variant?: 'light' | 'dark';
}) {
  return (
    <Link
      href="/"
      aria-label="iClose, home"
      className={cn('inline-flex items-baseline', className)}
    >
      <span
        className={cn(
          'font-display text-[22px] font-medium tracking-tight',
          variant === 'light' ? 'text-white' : 'text-ink',
        )}
        style={{ letterSpacing: '-0.02em' }}
      >
        i
      </span>
      <span
        className={cn(
          'font-display text-[22px] font-semibold tracking-tight',
          variant === 'light' ? 'text-white' : 'text-ink',
        )}
        style={{ letterSpacing: '-0.02em' }}
      >
        Close
      </span>
    </Link>
  );
}
