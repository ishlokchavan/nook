import type { Metadata } from 'next';
import { JourneyPage } from '@/components/portal/journey/journey-page';
import { JOURNEY_CONTENT_CHILDREN } from '@/lib/journey-content';

export const metadata: Metadata = {
  title: 'Brokerage Portal for Agents & Agencies',
  description: 'Manage listings, leads and deals in one portal — and keep 100% of your commission.',
};

export default function BrokeragePage() {
  return <JourneyPage content={JOURNEY_CONTENT_CHILDREN['close/brokerage']} />;
}
