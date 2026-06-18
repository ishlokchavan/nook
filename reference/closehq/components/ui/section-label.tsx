import { cn } from '@/lib/utils';

interface SectionLabelProps {
  number?: string;
  label: string;
  variant?: 'light' | 'dark';
  className?: string;
}

// Apple's eyebrow: small, sentence case, medium weight, ink or white
export function SectionLabel({
  label,
  variant = 'light',
  className,
}: SectionLabelProps) {
  return (
    <div
      className={cn(
        'text-base font-medium tracking-tight',
        variant === 'light' ? 'text-ink' : 'text-white',
        className,
      )}
      style={{ letterSpacing: '-0.012em' }}
    >
      {label}
    </div>
  );
}
