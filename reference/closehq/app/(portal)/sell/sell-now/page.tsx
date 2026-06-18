import type { Metadata } from 'next';
import { JourneyPage } from '@/components/portal/journey/journey-page';
import { JOURNEY_CONTENT_CHILDREN } from '@/lib/journey-content';

export const metadata: Metadata = {
  title: 'Sell Now Through iClose',
  description: 'Move faster with a direct sale through iClose — without paying commission.',
};

export default function SellNowPage() {
  return <JourneyPage content={JOURNEY_CONTENT_CHILDREN['sell/sell-now']} />;
}
