import type { Metadata } from 'next';
import { JourneyPage } from '@/components/portal/journey/journey-page';
import { JOURNEY_CONTENT_CHILDREN } from '@/lib/journey-content';

export const metadata: Metadata = {
  title: 'List Your Property as the Owner',
  description: 'Create a compliant owner / power-of-attorney listing with ownership verification — no commission.',
};

export default function SellListPage() {
  return <JourneyPage content={JOURNEY_CONTENT_CHILDREN['sell/list']} />;
}
