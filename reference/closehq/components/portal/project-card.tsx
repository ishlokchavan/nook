import Link from 'next/link';
import { ImageIcon, MapPin, CalendarClock, MessageCircle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Listing } from '@/lib/portal/listing-types';

/** Off-plan / new-project card (Property Finder new-projects pattern). */
export function ProjectCard({
  project,
  selectable = false,
  selected = false,
  onToggleSelect,
}: {
  project: Listing;
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: () => void;
}) {
  const wa = `https://wa.me/971501234567?text=${encodeURIComponent(`Hi, I'm interested in ${project.building ?? project.title} (${project.reference})`)}`;
  return (
    <article className={cn('card-surface overflow-hidden flex flex-col', selected && 'ring-2 ring-accent')}>
      <Link href={`/properties/${project.reference}`} className="relative aspect-[4/3] bg-mist flex items-center justify-center">
        {project.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.coverImageUrl} alt={project.title} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <ImageIcon className="h-8 w-8 text-hairline" />
        )}

        {selectable && (
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleSelect?.(); }}
            className={cn(
              'absolute top-3 start-3 z-10 inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full text-[12px] font-medium transition-colors',
              selected ? 'bg-accent text-white' : 'bg-paper/90 text-ink hover:bg-paper',
            )}
          >
            <span className={cn('flex items-center justify-center h-4 w-4 rounded border', selected ? 'bg-white border-white' : 'border-graphite')}>
              {selected && <Check className="h-3 w-3 text-accent" />}
            </span>
            Compare
          </button>
        )}

        <div className={cn('absolute start-3 flex flex-col gap-1.5 items-start', selectable ? 'top-12' : 'top-3')}>
          <span className="rounded-full bg-ink/80 text-white text-[11px] px-2.5 py-1">Off-Plan</span>
          {project.handoverBy && (
            <span className="inline-flex items-center gap-1 rounded-full bg-paper/90 text-ink text-[11px] px-2.5 py-1">
              <CalendarClock className="h-3 w-3" /> Handover {project.handoverBy}
            </span>
          )}
        </div>
        {project.developerLogo && (
          <span className="absolute top-3 end-3 bg-paper/90 rounded-lg px-2 py-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={project.developerLogo} alt={project.developerName ?? 'Developer'} className="h-5 w-auto max-w-[64px] object-contain" />
          </span>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-[16px] font-semibold text-ink" style={{ letterSpacing: '-0.015em' }}>
          {project.building ?? project.title}
        </h3>
        <p className="flex items-center gap-1 text-[13px] text-graphite mt-1">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1">{[project.community, project.city].filter(Boolean).join(', ')}</span>
        </p>

        <div className="mt-3">
          <span className="text-[12px] text-graphite">Launch price from</span>
          <div className="text-[18px] font-semibold text-ink">AED {project.priceAed.toLocaleString('en-US')}</div>
        </div>

        {project.paymentPlan && (
          <span className="mt-3 inline-flex w-fit items-center rounded-full bg-journey-offplan/15 text-ink text-[12px] px-2.5 py-1">
            Payment Plan {project.paymentPlan}
          </span>
        )}

        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center justify-center gap-2 h-10 rounded-full border border-hairline text-[14px] text-ink hover:bg-mist transition-colors"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
      </div>
    </article>
  );
}
