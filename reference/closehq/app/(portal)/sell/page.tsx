import type { Metadata } from 'next';
import { JourneyPage } from '@/components/portal/journey/journey-page';
import { JOURNEY_CONTENT } from '@/lib/journey-content';

export const metadata: Metadata = {
  title: 'Sell Property in Dubai Without Commission',
  description: 'List and sell your Dubai property as the owner without paying commission. See how selling with iClose works.',
};

export default function SellPage() {
  return <JourneyPage content={JOURNEY_CONTENT.sell} />;
}
