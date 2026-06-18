import { notFound } from 'next/navigation';
import { getExperienceListings } from '@/lib/glass/get-experience';
import { DeveloperProfile, slugifyDeveloper } from '@/components/glass/developer-profile';

export default async function DeveloperPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const all = await getExperienceListings();

  const listings = all.filter(
    (l) => l.developerName && slugifyDeveloper(l.developerName) === slug,
  );
  if (listings.length === 0) notFound();

  const name = listings[0].developerName as string;
  const logo = listings.find((l) => l.developerLogo)?.developerLogo ?? null;

  return <DeveloperProfile name={name} logo={logo} listings={listings} />;
}
