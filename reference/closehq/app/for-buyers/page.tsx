import type { Metadata } from 'next';
import {
  PersonaChrome,
  PersonaHero,
  PersonaFeatures,
  PersonaSteps,
  PersonaCompare,
  PersonaScenarios,
  PersonaFacts,
  PersonaQuote,
  PersonaFaq,
  PersonaIntro,
  PersonaWaitlist,
} from '@/components/persona/persona-sections';

export const metadata: Metadata = {
  title: 'For Buyers · iClose',
  description:
    "iClose gives UAE buyers 100% cashback on every deal, the entire agent commission rebated back to you.",
  // The buyer experience now lives on the root landing page. Keep this
  // legacy route out of the index to avoid duplicate-content competition.
  robots: { index: false, follow: false },
};

export default function ForBuyersPage() {
  return (
    <PersonaChrome>
      <PersonaHero
        variant="buyer"
        tagLabel="For Buyers"
        heroImage="https://d8j0ntlcm91z4.cloudfront.net/user_373qi3JTSvYmXjqMPJT9idOjFt7/hf_20260523_150508_8d5fb7fc-e484-4ba4-9d30-49813a74f7f8.png"
        heroAlt="A private-client advisor walking a buyer through a UAE purchase"
        headline={
          <>
            100% cashback.
            <br />
            <span>On every deal you close.</span>
          </>
        }
        sub={
          <>
            UAE real estate is one of the world&apos;s best investments. iClose
            gives you the deep market intelligence to buy with confidence, and
            rebates 100% of the agent commission back to you. Off-plan or
            ready, secondary or primary. Every dirham of the commission goes
            in your pocket, not ours.
          </>
        }
        primaryCta={{ label: 'Get started', href: '#waitlist' }}
        chips={[
          '100% cashback on every deal',
          'Off-plan, ready, secondary, all covered',
          'Deep market intel before you commit',
        ]}
      />

      <PersonaIntro
        eyebrow="The real problem"
        heading={<>Buying in UAE without the right intel is expensive.</>}
        body={
          <>
            Most buyers walk into one of the world&apos;s most competitive
            property markets with nothing but a developer&apos;s sales pitch.
            That&apos;s not a strategy.
          </>
        }
        items={[
          {
            tag: 'Bias',
            title: "Agents prioritise their commission.",
            body: "Not the project that's actually right for your goals or budget.",
          },
          {
            tag: 'Overwhelm',
            title: 'Hundreds of launches a year.',
            body: 'No easy way to compare quality, location ROI, developer track record, or real payment terms.',
          },
          {
            tag: 'Opacity',
            title: 'Commission baked into every deal.',
            body: "Most buyers never see the breakdown, and never see a cent of it back.",
          },
          {
            tag: 'Risk',
            title: 'First-time + international buyers are exposed.',
            body: 'Navigating RERA rules, DLD fees, and developer credibility without a guide is a recipe for losses.',
          },
        ]}
      />

      <PersonaFeatures
        eyebrow="What iClose gives you"
        heading={<>Everything you need to make the right call.</>}
        body={
          <>
            We built the platform we wish existed when buyers first entered
            this market. Unbiased, comprehensive, and built around your
            outcome, with the entire commission rebated back to you.
          </>
        }
        items={[
          {
            title: 'Project deep-dives.',
            body: 'Every active project in the UAE. Developer background, construction progress, community context, ROI data.',
          },
          {
            title: 'Floor plans & specs.',
            body: "Actual unit layouts, sizes, and finishing specs. Not just renders. Know what you're buying before you visit.",
          },
          {
            title: 'Payment plan breakdowns.',
            body: 'Side-by-side comparisons so you know which deal actually fits your cash flow.',
          },
          {
            title: 'Community intelligence.',
            body: 'Lifestyle, infrastructure, rental yields, and capital appreciation trends. By area, not just by tower.',
          },
          {
            title: 'Market reports.',
            body: 'Understand macro trends, supply pipelines, and where prices are heading.',
          },
          {
            title: 'Verified specialist access.',
            body: "When you're ready to move, our closers are certified and briefed. No cold handoffs.",
          },
        ]}
      />

      <PersonaCompare
        eyebrow="Secondary market"
        badge="vs"
        heading={<>Stop paying commission to buy.</>}
        body={
          <>
            On a typical AED 2M ready secondary purchase, here&apos;s the
            difference between buying through a standard agent and buying
            through iClose.
          </>
        }
        left={{
          title: 'Standard agent',
          rows: [
            { label: 'Deal value', value: 'AED 2,000,000' },
            { label: 'Buyer commission', value: '2%' },
            { label: 'You pay the agent', value: 'AED 40,000' },
          ],
          takeLabel: 'You pay',
          takeValue: 'AED 40,000',
        }}
        right={{
          title: 'iClose',
          rows: [
            { label: 'Deal value', value: 'AED 2,000,000' },
            { label: 'Buyer commission', value: '0%' },
            { label: 'You pay the agent', value: 'AED 0' },
          ],
          takeLabel: 'You pay',
          takeValue: 'AED 0',
        }}
        footnote="Confirmed in writing before you sign. No surprises at transfer."
      />

      <PersonaScenarios
        eyebrow="Two routes, both in your favour"
        heading={<>Off-plan or secondary, you come out ahead.</>}
        body={
          <>
            iClose works the same way whichever side of the market you&apos;re
            buying on. The economics just look different.
          </>
        }
        cards={[
          {
            tag: 'Off-plan',
            title: 'You get 100% cashback',
            rows: [
              { label: 'Deal value', value: 'AED 2,000,000' },
              { label: 'Developer commission', value: '5% (AED 100,000)' },
              { label: 'iClose rebate to you', value: '100%' },
            ],
            takeLabel: 'You get back',
            takeValue: 'AED 100,000',
          },
          {
            tag: 'Secondary',
            title: 'You pay no commission',
            rows: [
              { label: 'Deal value', value: 'AED 2,000,000' },
              { label: 'Standard commission', value: '2% (AED 40,000)' },
              { label: 'iClose charges you', value: 'Nothing' },
            ],
            takeLabel: 'You save',
            takeValue: 'AED 40,000',
          },
        ]}
        footnote="Exact figures confirmed up front before you commit to any deal."
      />

      <PersonaSteps
        eyebrow="How it works"
        heading={<>From curious to confident closer.</>}
        body={<>Four steps. No pressure. Move at your own pace.</>}
        steps={[
          {
            title: 'Access the platform.',
            body: "Sign up free. Browse the full UAE project library. Developments, floor plans, pricing, community breakdowns, and market data. No agent contact required until you want it.",
          },
          {
            title: 'Get educated on your shortlist.',
            body: "Narrow down using iClose's comparison tools. Understand ROI trajectories, developer credibility, and payment plans before you speak to a salesperson.",
          },
          {
            title: 'Connect with a certified closer.',
            body: "When you're ready to view or make an offer, we connect you with a specialist who knows your shortlist. You walk in informed. So the conversation is different.",
          },
          {
            title: 'Close and collect 100%.',
            body: "Because you're closing through iClose, the full commission we earn on the deal comes back to you as cashback. Confirmed upfront. Paid on transfer.",
          },
        ]}
      />

      <PersonaFacts
        heading={<>Why this market. Why now.</>}
        items={[
          { stat: '8–12%', label: 'Average net rental yield. Among the highest globally' },
          { stat: '0%', label: 'Capital gains and income tax on UAE property earnings' },
          { stat: '170+', label: 'Nationalities actively buying. The most international market on earth' },
          { stat: 'AED 2M', label: 'Purchase threshold that qualifies you for a UAE Golden Visa' },
        ]}
      />

      <PersonaQuote
        quote="I spent three months comparing projects on my own and still felt unsure. iClose's platform had everything in one place. I made a decision in two weeks. And got the entire AED 40,000 commission back as cashback."
        name="Buyer"
        role="2BR apartment · Dubai Hills Estate"
      />

      <PersonaFaq
        heading={<>Frequently asked questions.</>}
        items={[
          {
            q: 'Is iClose free to use as a buyer?',
            a: "Yes. Accessing the platform, browsing projects, and using our market intelligence tools is completely free. You only engage our closer service when you're ready to move, and that's when 100% of the commission comes back to you.",
          },
          {
            q: 'Do I need to be a UAE resident to buy?',
            a: 'No. Non-residents and international buyers can purchase freehold property in designated areas. A purchase above AED 2M can also qualify you for a UAE Golden Visa. iClose walks you through the full process.',
          },
          {
            q: 'How does the 100% cashback work?',
            a: 'When you close a deal through iClose, we rebate the entire agent commission we earn on the transaction back to you. The exact figure depends on the deal value and developer terms, but it is confirmed transparently before you sign anything.',
          },
          {
            q: 'What if I already have a project in mind?',
            a: "Even better. Look it up on the platform, get the full intelligence report, then connect with a closer who specialises in that development. You'll know more than most buyers who walk in cold, and still get 100% cashback on close.",
          },
          {
            q: 'Is iClose for off-plan or secondary market too?',
            a: 'Both. Our closers work across off-plan and secondary market transactions, and the 100% cashback applies on every deal.',
          },
        ]}
      />

      <PersonaWaitlist
        defaultIntent="buyer"
        heading={<>Your next property starts with the right intel.</>}
        body={
          <>
            Tell us a bit about you, and we&apos;ll line up your 100% cashback
            for your next purchase. No credit card, no commitment.
          </>
        }
      />
    </PersonaChrome>
  );
}
