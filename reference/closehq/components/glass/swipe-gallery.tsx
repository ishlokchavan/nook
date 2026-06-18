'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Volume2, VolumeX, Play, Film } from 'lucide-react';
import { SmartImage } from './smart-image';

type Slide = { type: 'image' | 'video'; src: string };

/**
 * Horizontal swipeable media gallery (videos first, then photos). Native
 * scroll-snap captures left/right swipes while vertical swipes pass through to
 * the feed. Video slides autoplay muted only while their card is active and
 * centred; tap toggles sound (or starts playback under reduced-motion).
 */
export function SwipeGallery({
  images,
  videos = [],
  alt,
  priority = false,
  indicator = 'bars',
  active = true,
  poster,
  onDoubleTap,
}: {
  images: string[];
  videos?: string[];
  alt: string;
  priority?: boolean;
  indicator?: 'bars' | 'dots' | 'none';
  /** Whether this gallery's card is the active feed card (gates autoplay). */
  active?: boolean;
  poster?: string;
  onDoubleTap?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const lastTap = useRef(0);
  const [idx, setIdx] = useState(0);
  const [burst, setBurst] = useState(0);
  const [muted, setMuted] = useState(true);

  const slides: Slide[] = [
    ...videos.map((src) => ({ type: 'video' as const, src })),
    ...images.map((src) => ({ type: 'image' as const, src })),
  ];
  const posterSrc = poster ?? images[0];

  function onScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    const next = Math.round(el.scrollLeft / el.clientWidth);
    if (next !== idx) setIdx(next);
  }

  function onClick() {
    const now = Date.now();
    if (now - lastTap.current < 280) {
      onDoubleTap?.();
      setBurst((b) => b + 1);
      lastTap.current = 0;
    } else {
      lastTap.current = now;
    }
  }

  const multi = slides.length > 1;
  const currentIsVideo = slides[idx]?.type === 'video';

  return (
    <div className="relative h-full w-full">
      <div
        ref={ref}
        onScroll={onScroll}
        onClick={onClick}
        className="no-scrollbar flex h-full w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
        style={{ touchAction: 'pan-x' }}
      >
        {slides.map((slide, i) =>
          slide.type === 'video' ? (
            <div key={slide.src + i} className="relative h-full w-full shrink-0 snap-center bg-black">
              <FeedVideo
                src={slide.src}
                poster={posterSrc}
                shouldPlay={active && i === idx}
                muted={muted}
                onToggleMute={() => setMuted((m) => !m)}
                priority={priority && i === 0}
              />
            </div>
          ) : (
            <div key={slide.src + i} className="relative h-full w-full shrink-0 snap-center bg-mist">
              <SmartImage
                src={slide.src}
                alt={alt}
                fill
                priority={priority && i === 0}
                sizes="(max-width: 520px) 100vw, 520px"
                className="object-cover"
                draggable={false}
              />
            </div>
          ),
        )}
      </div>

      {/* Tour badge — present whenever this listing has video */}
      {videos.length > 0 && (
        <div className="pointer-events-none absolute left-4 top-9 flex items-center gap-1 rounded-full bg-black/45 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
          <Film className="h-3.5 w-3.5" />
          {videos.length > 1 ? `${videos.length} tours` : 'Video tour'}
        </div>
      )}

      {/* Mute toggle — only while a video slide is showing */}
      {currentIsVideo && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setMuted((m) => !m);
          }}
          aria-label={muted ? 'Unmute' : 'Mute'}
          className="absolute bottom-4 left-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm active:scale-90"
        >
          {muted ? <VolumeX className="h-[18px] w-[18px]" /> : <Volume2 className="h-[18px] w-[18px]" />}
        </button>
      )}

      {/* progress bars (feed) */}
      {multi && indicator === 'bars' && (
        <div className="pointer-events-none absolute inset-x-4 top-3 flex gap-1.5">
          {slides.map((s, i) => (
            <span
              key={s.src + i}
              className={`h-[3px] flex-1 rounded-full transition-colors ${
                i === idx ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      )}

      {/* dots (detail) */}
      {multi && indicator === 'dots' && (
        <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center gap-1.5">
          {slides.map((s, i) => (
            <span
              key={s.src + i}
              className={`h-1.5 rounded-full transition-all ${
                i === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/60'
              }`}
            />
          ))}
        </div>
      )}

      {/* double-tap heart burst */}
      <AnimatePresence>
        {burst > 0 && (
          <motion.div
            key={burst}
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.25, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Heart className="h-28 w-28 fill-white text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.45)]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
}

function FeedVideo({
  src,
  poster,
  shouldPlay,
  muted,
  onToggleMute,
  priority,
}: {
  src: string;
  poster?: string;
  shouldPlay: boolean;
  muted: boolean;
  onToggleMute: () => void;
  priority: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(true);

  // Autoplay only while active + centred; pause (and rewind) otherwise.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (shouldPlay && !prefersReducedMotion()) {
      v.play().catch(() => {});
    } else {
      v.pause();
      if (!shouldPlay) v.currentTime = 0;
    }
  }, [shouldPlay]);

  useEffect(() => {
    if (ref.current) ref.current.muted = muted;
  }, [muted]);

  function handleTap(e: React.MouseEvent) {
    e.stopPropagation();
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else onToggleMute();
  }

  return (
    <>
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted={muted}
        loop
        playsInline
        preload={priority ? 'auto' : 'metadata'}
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        onClick={handleTap}
        className="h-full w-full object-cover"
      />
      {paused && (
        <span className="pointer-events-none absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm">
          <Play className="h-7 w-7 translate-x-0.5 fill-white" />
        </span>
      )}
    </>
  );
}
