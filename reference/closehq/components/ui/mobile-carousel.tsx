'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileCarouselProps {
  items: ReactNode[];
  className?: string;
  ariaLabel?: string;
  dark?: boolean;
}

export function MobileCarousel({ items, className, ariaLabel, dark = false }: MobileCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const slideWidth = track.clientWidth;
      if (slideWidth === 0) return;
      const idx = Math.round(track.scrollLeft / slideWidth);
      setActive(Math.max(0, Math.min(items.length - 1, idx)));
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => track.removeEventListener('scroll', onScroll);
  }, [items.length]);

  const scrollTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: track.clientWidth * i, behavior: 'smooth' });
  };

  return (
    <div className={className} aria-label={ariaLabel}>
      <div
        ref={trackRef}
        className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 sm:-mx-6 sm:px-6"
        style={{ scrollbarWidth: 'none' }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            className="snap-center shrink-0 w-full pr-4 last:pr-0"
            style={{ scrollSnapStop: 'always' }}
          >
            {item}
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        {/* Dot indicators */}
        <div className="flex items-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                dark
                  ? i === active ? 'w-6 bg-white' : 'w-1.5 bg-white/25 hover:bg-white/40'
                  : i === active ? 'w-6 bg-ink'   : 'w-1.5 bg-ink/20 hover:bg-ink/40',
              )}
            />
          ))}
        </div>

        {/* Arrow buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => scrollTo(Math.max(0, active - 1))}
            disabled={active === 0}
            aria-label="Previous"
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full border transition-colors disabled:opacity-30',
              dark
                ? 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                : 'border-hairline bg-paper text-ink hover:bg-mist',
            )}
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <button
            onClick={() => scrollTo(Math.min(items.length - 1, active + 1))}
            disabled={active === items.length - 1}
            aria-label="Next"
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full border transition-colors disabled:opacity-30',
              dark
                ? 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                : 'border-hairline bg-paper text-ink hover:bg-mist',
            )}
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
