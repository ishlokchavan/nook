import type { Metadata } from 'next';
import { ListingCreateForm } from '@/components/portal/listing-create-form';

export const metadata: Metadata = {
  title: 'List Your Property as the Owner',
  description: 'Create a compliant owner / power-of-attorney listing with ownership verification — no commission.',
};

export default function SellListNewPage() {
  return (
    <div className="container-wide py-12">
      <header className="text-center mb-10">
        <h1 className="display-md">List your property</h1>
        <p className="subhead mt-3 max-w-2xl mx-auto">
          List as the owner or power of attorney. We verify ownership to keep listings genuine — and
          you never pay commission.
        </p>
      </header>
      <ListingCreateForm path="owner" />
    </div>
  );
}
