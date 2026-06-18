import type { Metadata } from 'next';
import {
  PersonaChrome,
  PersonaHero,
  PersonaIntro,
  PersonaSteps,
  PersonaCompare,
  PersonaAudience,
  PersonaWaitlist,
} from '@/components/persona/persona-sections';

export const metadata: Metadata = {
  title: 'For Closers · iClose',
  description:
    'The UAE market is worth trillions. iClose gives you everything to become the closer who gets the biggest slice. Full project knowledge, elite resources, and the highest commission splits in the country.',
};

export default function ForBrokersPage() {
  return (
    <PersonaChrome>
      <PersonaHero
        variant="broker"
        tagLabel="For Closers"
        heroImage="https://d8j0ntlcm91z4.cloudfront.net/user_373qi3JTSvYmXjqMPJT9idOjFt7/hf_20260523_150502_22aadfe1-177e-4a65-8768-ea2f66790704.png"
        heroAlt="A broker in a modern Dubai office"
        headline={
          <>
            Bring the client.
            <br />
            <span>Close the deal.</span>
          </>
        }
        sub={
          <>
            Brokers, lawyers, advisors, executives, networkers. Anyone with a
            client to refer or a deal to close. iClose gives you the market
            intelligence, sales tools, and commission structure that the top
            UAE closers run on.
          </>
        }
        primaryCta={{ label: 'Get started', href: '#waitlist' }}
        secondaryCta={{ label: 'See how it works', href: '#how' }}
        chips={['No license needed to refer · Up to 100% on deals you close']}
      />

      <PersonaIntro
        eyebrow="What iClose is"
        heading={<>Not another brokerage.</>}
        body={
          <>
            iClose is a platform for anyone who closes. Or knows someone who
            will. We don&apos;t manage agents. We equip closers and referrers
            with the market intelligence, sales tools, and commission
            structure to win every room they walk into.
          </>
        }
        items={[
          {
            tag: 'Education',
            title: 'Full market education.',
            body: 'Every developer. Every community. Every project. From launch specs to payment plan nuances.',
          },
          {
            tag: 'Resources',
            title: 'Sales-ready resources.',
            body: 'Brochures, floor plans, presentations, and pricing. Updated, organised, always ready to send.',
          },
          {
            tag: 'Refer or close',
            title: 'Two paths, one structure.',
            body: 'Close it yourself and keep up to 100%, or refer the client and earn up to 80%. Your call, deal by deal.',
          },
          {
            tag: 'Reputation',
            title: 'Performance track record.',
            body: 'Build your verified close (or referral) history. Let your numbers do the talking.',
          },
        ]}
      />

      <div id="how">
        <PersonaSteps
          eyebrow="The path"
          heading={<>From zero to top 1%.</>}
          body={
            <>
              You don&apos;t need a real estate background. You need hunger,
              discipline, and iClose.
            </>
          }
          steps={[
            {
              title: 'Learn the market.',
              body: "Get full access to iClose's project library. Developers, communities, specs, and investment angles. Study at your own pace. We cover everything the UAE's top closers know.",
            },
            {
              title: 'Master the pitch.',
              body: "Practice deal scenarios, objection handling, and buyer psychology using iClose's structured training modules. Real situations, not theory.",
            },
            {
              title: 'Get your resources.',
              body: 'Pull any brochure, floor plan, or presentation instantly from your iClose dashboard. Walk into every client meeting over-prepared.',
            },
            {
              title: 'Close at elite splits.',
              body: 'Access deals with the highest commission splits in the country. No cap. Performance determines your earning ceiling. And we set it high.',
            },
          ]}
        />
      </div>

      <PersonaCompare
        eyebrow="The split that matters"
        heading={<>Traditional brokerage vs iClose.</>}
        body={
          <>
            Same deal, same 5% commission. The difference is how much of it
            ends up in your pocket.
          </>
        }
        left={{
          title: 'Traditional brokerage',
          rows: [
            { label: 'Deal value', value: 'AED 1.8M' },
            { label: 'Commission (5%)', value: 'AED 90,000' },
            { label: 'Split with agency', value: '50 / 50' },
          ],
          takeLabel: 'You keep',
          takeValue: 'AED 45,000',
        }}
        right={{
          title: 'iClose',
          rows: [
            { label: 'Deal value', value: 'AED 1.8M' },
            { label: 'Commission (5%)', value: 'AED 90,000' },
            { label: 'Your split', value: 'Up to 100%' },
          ],
          takeLabel: 'You keep',
          takeValue: 'AED 90,000',
        }}
        footnote="Membership covers the platform. The commission stays yours."
      />

      <PersonaAudience
        heading={<>Who this is for.</>}
        items={[
          {
            title: 'Brokers ready to keep more.',
            body: "You're already in the market and tired of weak training, low splits, and zero support from your current agency.",
          },
          {
            title: 'Lawyers, advisors & consultants.',
            body: 'Your clients are moving money into UAE property. You already have the relationship. Earn up to 80% by referring them through iClose.',
          },
          {
            title: 'Executives & community connectors.',
            body: "Your network constantly asks who to call for property. Now you have a real answer. And a real share when they close.",
          },
          {
            title: 'Sales pros from other industries.',
            body: 'You know how to close people. And want to apply that in one of the world&apos;s highest-value markets.',
          },
        ]}
      />

      <PersonaWaitlist
        defaultIntent="closer"
        heading={<>The market won&apos;t wait.</>}
        body={
          <>
            Join iClose, get access to the full platform, and start building
            the career that pays what you&apos;re worth.
          </>
        }
      />
    </PersonaChrome>
  );
}
