import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'dark' | 'gold' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

// Apple buttons: pill shape, sentence case, no uppercase tracking, subtle hover
const variantClasses: Record<ButtonVariant, string> = {
  // Primary — Apple blue pill
  primary:
    'bg-accent text-white hover:bg-accent-hover active:bg-accent-dark',
  // Secondary — soft mist pill
  secondary:
    'bg-mist text-ink hover:bg-hairline/60 active:bg-hairline',
  // Ghost — text-only with underline on hover (Apple "Learn more" style)
  ghost:
    'bg-transparent text-accent hover:underline underline-offset-2',
  // Dark — Apple "Buy" black pill
  dark:
    'bg-ink text-white hover:bg-ink-800 active:bg-ink-700',
  // Outline — hairline border, ink text
  outline:
    'bg-transparent text-ink border border-hairline hover:border-ink/50',
  // Legacy alias — map "gold" to dark/primary so old call sites keep working
  gold:
    'bg-ink text-white hover:bg-ink-800 active:bg-ink-700',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-4 text-[13px]',
  md: 'h-10 px-5 text-[15px]',
  lg: 'h-12 px-6 text-[17px]',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-1.5 font-normal rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap tracking-tight',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';
