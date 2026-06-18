import type { Metadata } from 'next';
import { JourneyPage } from '@/components/portal/journey/journey-page';
import { JOURNEY_CONTENT_CHILDREN } from '@/lib/journey-content';

export const metadata: Metadata = {
  title: 'List with Contract A (RERA Form A)',
  description: 'List compliantly as a broker using a RERA Form A listing agreement and keep 100% of your commission.',
};

export default function ListWithCaPage() {
  return <JourneyPage content={JOURNEY_CONTENT_CHILDREN['close/list-with-ca']} />;
}
