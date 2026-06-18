import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { DeveloperEnquiryForm } from '@/components/portal/developer-enquiry-form';

export const metadata: Metadata = {
  title: 'Talk to an Off-Plan Expert',
  description: 'Get off-plan advice, special pricing and credits across Dubai developers. Talk to the iClose team.',
};

export default function DeveloperEnquirePage() {
  return (
    <div className="container-wide py-12 max-w-xl">
      <Link href="/developers" className="inline-flex items-center gap-1 text-[14px] text-graphite hover:text-ink mb-5">
        <ChevronLeft className="h-4 w-4 rtl:rotate-180" /> Back to developers
      </Link>
      <header className="mb-8">
        <h1 className="display-md">Talk to an expert</h1>
        <p className="subhead mt-3">
          Tell us what you&apos;re looking for. Our off-plan team will come back with special pricing
          and credits — no commission.
        </p>
      </header>
      <Suspense fallback={null}>
        <DeveloperEnquiryForm />
      </Suspense>
    </div>
  );
}
