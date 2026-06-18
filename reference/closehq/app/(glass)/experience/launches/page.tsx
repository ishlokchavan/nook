import { StoriesViewer } from '@/components/glass/stories-viewer';
import { getExperienceLaunches } from '@/lib/glass/get-experience';

export default async function LaunchesPage({
  searchParams,
}: {
  searchParams: Promise<{ start?: string }>;
}) {
  const { start } = await searchParams;
  const launches = await getExperienceLaunches();
  return <StoriesViewer launches={launches} startReference={start} />;
}
