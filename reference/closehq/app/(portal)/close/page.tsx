import type { Metadata } from 'next';
import { JourneyPage } from '@/components/portal/journey/journey-page';
import { JOURNEY_CONTENT } from '@/lib/journey-content';

export const metadata: Metadata = {
  title: 'Close Deals & Keep 100% Commission',
  description: 'Freelancers, agents and agencies close deals on iClose and keep 100% of their commission. See how it works.',
};

export default function ClosePage() {
  return <JourneyPage content={JOURNEY_CONTENT.close} />;
}
