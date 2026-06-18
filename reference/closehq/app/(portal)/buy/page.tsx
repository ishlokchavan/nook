import type { Metadata } from 'next';
import { JourneyPage } from '@/components/portal/journey/journey-page';
import { JOURNEY_CONTENT } from '@/lib/journey-content';

export const metadata: Metadata = {
  title: 'Buy Property in Dubai with Zero Commission',
  description: 'Buy ready and off-plan property in Dubai and keep 100% of the agent commission. See how buying with iClose works.',
};

export default function BuyPage() {
  return <JourneyPage content={JOURNEY_CONTENT.buy} />;
}
