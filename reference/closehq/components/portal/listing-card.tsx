import Link from 'next/link';
import { ImageIcon, BedDouble, Bath, Maximize, BadgeCheck, MapPin } from 'lucide-react';
import { formatPriceAed } from '@/lib/portal/listings';
import type { Listing } from '@/lib/portal/listing-types';

const TYPE_LABEL: Record<Listing['propertyType'], string> = {
  apartment: 'Apartment', villa: 'Villa', townhouse: 'Townhouse', penthouse: 'Penthouse',
  plot: 'Plot', office: 'Office', retail: 'Retail',
};

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/properties/${listing.reference}`}
      className="card-surface overflow-hidden group hover:shadow-card-hover transition-shadow block">
      {/* Image — placeholder block (real photos swapped in later) */}
      <div className="relative aspect-[4/3] bg-mist flex items-center justify-center">
        {listing.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={listing.coverImageUrl} alt={listing.title} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <ImageIcon className="h-8 w-8 text-hairline" />
        )}
        <div className="absolute top-3 start-3 flex gap-2">
          <span className="rounded-full bg-ink/80 text-white text-[11px] px-2.5 py-1 capitalize">
            {listing.completion === 'off_plan' ? 'Off-plan' : 'Ready'}
          </span>
          {listing.isVerified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-paper/90 text-ink text-[11px] px-2.5 py-1">
              <BadgeCheck className="h-3 w-3 text-journey-listing" /> Verified
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[17px] font-semibold text-ink" style={{ letterSpacing: '-0.015em' }}>
            {formatPriceAed(listing.priceAed, listing.purpose)}
          </span>
          <span className="text-[12px] text-graphite">{TYPE_LABEL[listing.propertyType]}</span>
        </div>

        <h3 className="text-[14px] text-ink mt-2 line-clamp-1">{listing.title}</h3>

        <p className="flex items-center gap-1 text-[13px] text-graphite mt-1">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1">
            {[listing.building, listing.community, listing.city].filter(Boolean).join(', ')}
          </span>
        </p>

        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-hairline/60 text-[13px] text-graphite-dark">
          {listing.bedrooms != null && (
            <span className="inline-flex items-center gap-1.5">
              <BedDouble className="h-4 w-4" />
              {listing.bedrooms === 0 ? 'Studio' : listing.bedrooms}
            </span>
          )}
          {listing.bathrooms != null && (
            <span className="inline-flex items-center gap-1.5"><Bath className="h-4 w-4" />{listing.bathrooms}</span>
          )}
          {listing.areaSqft != null && (
            <span className="inline-flex items-center gap-1.5">
              <Maximize className="h-4 w-4" />{listing.areaSqft.toLocaleString('en-US')} sqft
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
