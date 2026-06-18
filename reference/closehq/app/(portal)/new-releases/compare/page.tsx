import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, ImageIcon, MessageCircle, MapPin } from 'lucide-react';
import { getListings } from '@/lib/portal/listings';
import { getLocale } from '@/lib/i18n/server';
import type { Listing } from '@/lib/portal/listing-types';

export const metadata: Metadata = {
  title: 'Compare Off-Plan Projects',
  description: 'Compare up to five off-plan projects side by side — price, bedrooms, delivery date, type and payment plan.',
};

const TYPE_LABEL: Record<Listing['propertyType'], string> = {
  apartment: 'Apartment', villa: 'Villa', townhouse: 'Townhouse', penthouse: 'Penthouse',
  plot: 'Plot', office: 'Office', retail: 'Retail',
};

export default async function CompareProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const { ids } = await searchParams;
  const refs = (ids ?? '').split(',').map((s) => s.trim()).filter(Boolean).slice(0, 5);
  if (refs.length < 2) notFound();

  const locale = await getLocale();
  const all = await getListings({ completion: 'off_plan' }, locale);
  const projects = refs.map((r) => all.find((l) => l.reference === r)).filter(Boolean) as Listing[];
  if (projects.length < 2) notFound();

  const rows: { label: string; value: (p: Listing) => string }[] = [
    { label: 'Price from', value: (p) => `AED ${p.priceAed.toLocaleString('en-US')}` },
    { label: 'Bedrooms', value: (p) => (p.bedrooms === 0 ? 'Studio' : `${p.bedrooms}`) },
    { label: 'Bathrooms', value: (p) => `${p.bathrooms ?? '—'}` },
    { label: 'Area', value: (p) => (p.areaSqft ? `${p.areaSqft.toLocaleString('en-US')} sqft` : '—') },
    { label: 'Delivery date', value: (p) => p.handoverBy ?? '—' },
    { label: 'Payment plan', value: (p) => p.paymentPlan ?? '—' },
    { label: 'Property type', value: (p) => TYPE_LABEL[p.propertyType] },
    { label: 'Developer', value: (p) => p.developerName ?? '—' },
    { label: 'Location', value: (p) => [p.community, p.city].filter(Boolean).join(', ') },
  ];

  return (
    <div className="container-wide py-8">
      <Link href="/new-releases" className="inline-flex items-center gap-1 text-[14px] text-graphite hover:text-ink mb-5">
        <ChevronLeft className="h-4 w-4 rtl:rotate-180" /> Back to New Releases
      </Link>
      <h1 className="display-sm mb-6">Project comparison</h1>

      <div className="overflow-x-auto -mx-4 px-4">
        <table className="w-full border-separate border-spacing-0 min-w-[640px]">
          <thead>
            <tr>
              <th className="w-32 sticky start-0 bg-paper" />
              {projects.map((p) => (
                <th key={p.id} className="p-2 align-top text-start">
                  <Link href={`/properties/${p.reference}`} className="block">
                    <span className="flex items-center justify-center aspect-[16/10] rounded-xl bg-mist mb-2">
                      <ImageIcon className="h-6 w-6 text-hairline" />
                    </span>
                    <span className="block text-[15px] font-semibold text-ink line-clamp-1">{p.building ?? p.title}</span>
                    <span className="flex items-center gap-1 text-[12px] text-graphite mt-0.5"><MapPin className="h-3 w-3" /><span className="line-clamp-1">{p.city}</span></span>
                  </Link>
                  <a
                    href={`https://wa.me/971501234567?text=${encodeURIComponent(`Hi, I'm interested in ${p.building ?? p.title}`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center justify-center gap-1.5 h-8 w-full rounded-full border border-hairline text-[12px] text-ink hover:bg-mist"
                  >
                    <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                  </a>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.label} className={i % 2 ? '' : 'bg-mist/40'}>
                <td className="p-3 text-[13px] text-graphite font-medium sticky start-0 bg-inherit">{row.label}</td>
                {projects.map((p) => (
                  <td key={p.id} className="p-3 text-[14px] text-ink">{row.value(p)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
