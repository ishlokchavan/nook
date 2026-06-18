'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * A pill button that toggles a panel. Mobile-first: the panel is a bottom sheet
 * on phones and an anchored popover on >= sm. Closes on outside-click / Escape.
 */
export function FilterDropdown({
  label,
  active = false,
  children,
  width = 'sm:w-72',
}: {
  label: string;
  active?: boolean;
  children: (close: () => void) => React.ReactNode;
  width?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className={cn(
          'inline-flex items-center gap-1.5 h-10 px-3.5 rounded-full border text-[13px] whitespace-nowrap transition-colors',
          active ? 'border-accent text-accent bg-accent/5' : 'border-hairline text-ink/80 hover:border-ink/40 hover:text-ink',
        )}
      >
        {label} <ChevronDown className={cn('h-3.5 w-3.5 opacity-60 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <>
          {/* Mobile backdrop */}
          <div className="fixed inset-0 z-40 bg-black/30 sm:hidden" onClick={close} aria-hidden />
          <div
            className={cn(
              // Mobile: bottom sheet. sm+: anchored popover.
              'fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border-t border-hairline bg-paper p-5 shadow-card-hover max-h-[80vh] overflow-auto',
              'sm:absolute sm:inset-x-auto sm:bottom-auto sm:mt-2 sm:start-0 sm:rounded-2xl sm:border sm:p-4 sm:max-h-none sm:max-w-[calc(100vw-2rem)]',
              width,
            )}
          >
            <div className="flex items-center justify-between mb-3 sm:hidden">
              <span className="text-[15px] font-medium text-ink">{label}</span>
              <button type="button" onClick={close} aria-label="Close"><X className="h-5 w-5 text-graphite" /></button>
            </div>
            {children(close)}
          </div>
        </>
      )}
    </div>
  );
}
