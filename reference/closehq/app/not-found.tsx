import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-ink flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold mb-6">
          404 · Off-plan unit not found
        </div>
        <h1 className="display-md text-bone">
          This door doesn&apos;t open.
        </h1>
        <p className="mt-6 text-bone/60">
          The page you&apos;re looking for isn&apos;t here. Let&apos;s get you
          back to the deal flow.
        </p>
        <div className="mt-10">
          <Link href="/">
            <Button variant="gold" size="lg">
              Back to home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
