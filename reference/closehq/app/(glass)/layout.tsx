import type { Metadata } from 'next';
import { SavedStoreProvider } from '@/components/glass/saved-store';
import { SignalStoreProvider } from '@/components/glass/signal-store';
import { ExperienceProvider } from '@/components/glass/experience-provider';
import { GlassTabBar } from '@/components/glass/glass-tab-bar';
import { AuthProvider } from '@/components/portal/auth-provider';
import { getExperienceListings } from '@/lib/glass/get-experience';

export const metadata: Metadata = {
  title: 'Discover · iClose',
  description: 'Explore UAE homes and earn iClose credits — an immersive experience.',
};

export default async function GlassLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const listings = await getExperienceListings();

  return (
    <ExperienceProvider listings={listings}>
      <AuthProvider>
      <SignalStoreProvider>
      <SavedStoreProvider>
        <div className="relative flex min-h-[100svh] w-full justify-center overflow-hidden bg-fog">
          <div className="pointer-events-none absolute -left-40 top-0 h-[55vh] w-[55vh] rounded-full bg-accent/10 blur-[130px]" />
          <div className="pointer-events-none absolute -right-40 bottom-0 h-[55vh] w-[55vh] rounded-full bg-journey-offplan/15 blur-[130px]" />

          <main className="relative h-[100svh] w-full max-w-[520px] overflow-hidden bg-paper text-ink shadow-[0_0_80px_rgba(0,0,0,0.12)]">
            {children}
            <GlassTabBar />
          </main>
        </div>
      </SavedStoreProvider>
      </SignalStoreProvider>
      </AuthProvider>
    </ExperienceProvider>
  );
}
