import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ImageIcon, BedDouble, Bath, Maximize, BadgeCheck, MapPin, ChevronLeft,
  Tag, ShieldCheck, Phone, Mail, MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ListingCard } from '@/components/portal/listing-card';
import { MortgageCalculator } from '@/components/portal/mortgage-calculator';
import { getListingByReference, getListingReferences, getListings, formatPriceAed } from '@/lib/portal/listings';
import type { Listing } from '@/lib/portal/listing-types';

function aed(n: number): string {
  return `AED ${Math.round(n).toLocaleString('en-US')}`;
}

const TYPE_LABEL: Record<Listing['propertyType'], string> = {
  apartment: 'Apartment', villa: 'Villa', townhouse: 'Townhouse', penthouse: 'Penthouse',
  plot: 'Plot', office: 'Office', retail: 'Retail',
};

export async function generateStaticParams() {
  const refs = await getListingReferences();
  return refs.map((reference) => ({ reference }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ reference: string }>;
}): Promise<Metadata> {
  const { reference } = await params;
  const listing = await getListingByReference(reference);
  if (!listing) return { title: 'Listing not found' };
  return {
    title: `${listing.title}`,
    description: listing.description || `${listing.title} in ${listing.community ?? listing.city}.`,
  };
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const listing = await getListingByReference(reference);
  if (!listing) notFound();

  const location = [listing.building, listing.community, listing.city].filter(Boolean).join(', ');

  // Cost breakdown (iClose vs typical agent) + similar listings.
  const agentCommission = listing.priceAed * 0.02; // typical 2% buyer commission
  const dldFee = listing.priceAed * 0.04; // DLD transfer fee 4%
  const pricePerSqft = listing.areaSqft ? listing.priceAed / listing.areaSqft : null;
  const similar = (await getListings({ purpose: listing.purpose }))
    .filter((l) => l.reference !== listing.reference)
    .slice(0, 3);

  return (
    <div className="container-wide py-8">
      <Link href="/properties" className="inline-flex items-center gap-1 text-[14px] text-graphite hover:text-ink mb-5">
        <ChevronLeft className="h-4 w-4" /> Back to results
      </Link>

      {/* Gallery — placeholder imagery per design */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mb-8">
        <div className="lg:col-span-3 relative aspect-[16/9] rounded-apple bg-mist flex items-center justify-center overflow-hidden">
          {listing.coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={listing.coverImageUrl} alt={listing.title} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-10 w-10 text-hairline" />
          )}
          <div className="absolute top-4 start-4 flex gap-2">
            <span className="rounded-full bg-ink/80 text-white text-[12px] px-3 py-1">
              {listing.completion === 'off_plan' ? 'Off-plan' : 'Ready'}
            </span>
            {listing.isVerified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-paper/90 text-ink text-[12px] px-3 py-1">
                <BadgeCheck className="h-3.5 w-3.5 text-journey-listing" /> Verified
              </span>
            )}
          </div>
        </div>
        <div className="hidden lg:flex flex-col gap-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex-1 aspect-[4/3] rounded-apple bg-mist flex items-center justify-center">
              <ImageIcon className="h-7 w-7 text-hairline" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main column */}
        <div className="lg:col-span-2">
          <span className="text-[13px] text-graphite uppercase tracking-wide">{TYPE_LABEL[listing.propertyType]}</span>
          <h1 className="display-sm mt-1">{formatPriceAed(listing.priceAed, listing.purpose)}</h1>
          <p className="text-[18px] text-ink mt-2">{listing.title}</p>
          <p className="flex items-center gap-1.5 text-[15px] text-graphite mt-1">
            <MapPin className="h-4 w-4" /> {location}
          </p>

          {/* Specs */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-6 py-5 border-y border-hairline/60 text-[15px] text-ink">
            {listing.bedrooms != null && (
              <span className="inline-flex items-center gap-2">
                <BedDouble className="h-5 w-5 text-graphite" />
                {listing.bedrooms === 0 ? 'Studio' : `${listing.bedrooms} Beds`}
              </span>
            )}
            {listing.bathrooms != null && (
              <span className="inline-flex items-center gap-2"><Bath className="h-5 w-5 text-graphite" />{listing.bathrooms} Baths</span>
            )}
            {listing.areaSqft != null && (
              <span className="inline-flex items-center gap-2">
                <Maximize className="h-5 w-5 text-graphite" />{listing.areaSqft.toLocaleString('en-US')} sqft
              </span>
            )}
            <span className="inline-flex items-center gap-2"><Tag className="h-5 w-5 text-graphite" />Ref. {listing.reference}</span>
          </div>

          {/* Description */}
          {listing.description && (
            <section className="mt-7">
              <h2 className="text-[18px] font-semibold text-ink mb-2" style={{ letterSpacing: '-0.015em' }}>Description</h2>
              <p className="text-[15px] text-graphite-dark leading-relaxed">{listing.description}</p>
            </section>
          )}

          {/* Property information (PF/Proffer-style key/value table) */}
          <section className="mt-7">
            <h2 className="text-[18px] font-semibold text-ink mb-3" style={{ letterSpacing: '-0.015em' }}>Property information</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0 rounded-apple border border-hairline/60 overflow-hidden">
              {[
                ['Type', TYPE_LABEL[listing.propertyType]],
                ['Purpose', listing.purpose === 'rent' ? 'For rent' : 'For sale'],
                ['Completion', listing.completion === 'off_plan' ? 'Off-plan' : 'Ready'],
                ['Category', listing.category === 'commercial' ? 'Commercial' : 'Residential'],
                ['Reference', listing.reference],
                ['City', listing.city],
                ['Community', listing.community ?? '—'],
                ['Area', listing.areaSqft != null ? `${listing.areaSqft.toLocaleString('en-US')} sqft` : '—'],
              ].map(([k, v], i) => (
                <div key={k} className={`flex items-center justify-between gap-4 px-4 py-3 text-[14px] ${i % 2 ? 'sm:bg-transparent' : 'bg-mist/50 sm:bg-mist/50'}`}>
                  <dt className="text-graphite">{k}</dt>
                  <dd className="text-ink font-medium text-end">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Amenities */}
          {listing.amenities.length > 0 && (
            <section className="mt-7">
              <h2 className="text-[18px] font-semibold text-ink mb-3" style={{ letterSpacing: '-0.015em' }}>Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {listing.amenities.map((a) => (
                  <span key={a} className="rounded-full border border-hairline px-3.5 py-1.5 text-[13px] text-ink/80">{a}</span>
                ))}
              </div>
            </section>
          )}

          {/* Map placeholder */}
          <section className="mt-7">
            <h2 className="text-[18px] font-semibold text-ink mb-3" style={{ letterSpacing: '-0.015em' }}>Location</h2>
            <div className="aspect-[16/7] rounded-apple bg-mist flex items-center justify-center text-graphite">
              <span className="inline-flex items-center gap-2 text-[14px]"><MapPin className="h-4 w-4" /> {location}</span>
            </div>
          </section>
        </div>

        {/* Sidebar: price + cost breakdown (Proffer-style) */}
        <aside className="lg:col-span-1">
          <div className="card-surface p-6 lg:sticky lg:top-20">
            <p className="text-[12px] text-graphite">Price</p>
            <div className="flex items-baseline gap-2">
              <span className="display-sm">{formatPriceAed(listing.priceAed, listing.purpose)}</span>
              {pricePerSqft && <span className="text-[13px] text-graphite">{aed(pricePerSqft)} / sqft</span>}
            </div>

            {/* Savings vs a typical agent */}
            <div className="flex items-center gap-2 rounded-xl bg-journey-listing/15 px-3.5 py-2.5 mt-4">
              <ShieldCheck className="h-4 w-4 text-ink shrink-0" />
              <span className="text-[13px] text-ink">Save <strong>{aed(agentCommission)}</strong> with iClose — 0% commission</span>
            </div>

            {/* Cost rows */}
            <dl className="mt-4 space-y-2 text-[13px]">
              <div className="flex justify-between"><dt className="text-graphite">DLD fee (4%)</dt><dd className="text-ink">{aed(dldFee)}</dd></div>
              <div className="flex justify-between"><dt className="text-graphite">Agent commission</dt><dd className="text-graphite line-through">{aed(agentCommission)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink font-medium">With iClose</dt><dd className="text-journey-listing font-semibold">AED 0</dd></div>
            </dl>

            {/* with iClose vs with Agent */}
            <div className="mt-4 grid grid-cols-2 rounded-xl overflow-hidden border border-hairline/60 text-center text-[12px]">
              <div className="bg-accent/10 py-2.5">
                <div className="text-graphite">With iClose</div>
                <div className="text-[15px] font-semibold text-accent mt-0.5">AED 0</div>
              </div>
              <div className="py-2.5 border-s border-hairline/60">
                <div className="text-graphite">With agent</div>
                <div className="text-[15px] font-semibold text-ink mt-0.5">{aed(agentCommission)}</div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 mt-5">
              <Link href={`/buy?ref=${listing.reference}`}>
                <Button variant="primary" size="md" className="w-full"><Mail className="h-4 w-4" /> Make an offer</Button>
              </Link>
              <div className="grid grid-cols-2 gap-2.5">
                <Link href={`/buy?ref=${listing.reference}`}>
                  <Button variant="outline" size="md" className="w-full"><Phone className="h-4 w-4" /> Call</Button>
                </Link>
                <a
                  href={`https://wa.me/${(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '971501234567').replace(/\D/g, '')}?text=${encodeURIComponent(`Hi, I'm interested in listing ${listing.reference}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="md" className="w-full"><MessageCircle className="h-4 w-4" /> WhatsApp</Button>
                </a>
              </div>
            </div>
            <p className="flex items-center justify-center gap-1.5 text-[12px] text-graphite mt-4 text-center">
              <BadgeCheck className="h-3.5 w-3.5 text-journey-listing" />
              Verified by iClose · permit checked at review
            </p>
          </div>
        </aside>
      </div>

      {/* Mortgage calculator */}
      <MortgageCalculator price={listing.priceAed} />

      {/* Regulatory information (PF pattern) */}
      <section className="mt-7">
        <h2 className="text-[18px] font-semibold text-ink mb-3" style={{ letterSpacing: '-0.015em' }}>Regulatory information</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0 rounded-apple border border-hairline/60 overflow-hidden">
          {[
            ['Reference', listing.reference],
            ['Listed', 'Recently'],
            ['Trakheesi permit', 'Verified at review'],
            ['Zone name', listing.community ?? listing.city],
            ['DLD', 'Dubai Land Department'],
            ['Listed by', 'iClose (verified)'],
          ].map(([k, v], i) => (
            <div key={k} className={`flex items-center justify-between gap-4 px-4 py-3 text-[14px] ${i % 2 ? '' : 'bg-mist/50'}`}>
              <dt className="text-graphite">{k}</dt>
              <dd className="text-ink font-medium text-end">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Similar properties */}
      {similar.length > 0 && (
        <section className="mt-10">
          <h2 className="display-sm mb-5">Similar properties</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {similar.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
