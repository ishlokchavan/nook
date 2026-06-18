import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* Format a raw phone string (e.g. "971585430292" or "+971585430292")
   into a display form like "+971 58 543 0292". Falls back to the
   input unchanged for non-UAE / unrecognised formats. */
export function formatPhone(raw: string | undefined | null): string {
  if (!raw) return '';
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('971') && digits.length >= 11) {
    const cc = digits.slice(0, 3);
    const op = digits.slice(3, 5);
    const a = digits.slice(5, 8);
    const b = digits.slice(8, 12);
    return `+${cc} ${op} ${a} ${b}`.trim();
  }
  if (digits.length >= 7) return `+${digits}`;
  return raw;
}

/* tel: target, always +<digits>, no spaces */
export function telHref(raw: string | undefined | null): string {
  if (!raw) return '';
  const digits = raw.replace(/\D/g, '');
  return `tel:+${digits}`;
}
