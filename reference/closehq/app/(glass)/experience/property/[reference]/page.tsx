import { notFound } from 'next/navigation';
import { PropertyDetail } from '@/components/glass/property-detail';
import { getExperienceListing } from '@/lib/glass/get-experience';

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const listing = await getExperienceListing(reference);
  if (!listing) notFound();
  return <PropertyDetail listing={listing} />;
}
