import type { Metadata } from 'next';
import { ListingCreateForm } from '@/components/portal/listing-create-form';

export const metadata: Metadata = {
  title: 'List with Contract A (RERA Form A)',
  description: 'List compliantly as a RERA broker using a Form A listing agreement and keep 100% of your commission.',
};

export default function ListWithCaNewPage() {
  return (
    <div className="container-wide py-12">
      <header className="text-center mb-10">
        <h1 className="display-md">List with Contract A</h1>
        <p className="subhead mt-3 max-w-2xl mx-auto">
          For RERA brokers. List compliantly with a Form A (Contract A) agreement and keep 100% of
          your commission.
        </p>
      </header>
      <ListingCreateForm path="agent" />
    </div>
  );
}
