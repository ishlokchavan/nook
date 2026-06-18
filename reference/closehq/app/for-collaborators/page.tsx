import type { Metadata } from 'next';
import {
  PersonaChrome,
  PersonaHero,
  PersonaSteps,
  PersonaMath,
  PersonaAudience,
  PersonaQuote,
  PersonaWaitlist,
} from '@/components/persona/persona-sections';

export const metadata: Metadata = {
  title: 'For Referral Partners · iClose',
  description:
    'Your network already has deals in it. iClose turns one warm intro into a real commission. No license, no hustle, no awkward pitch.',
};

export default function ForCollaboratorsPage() {
  return (
    <PersonaChrome>
      <PersonaHero
        variant="collaborator"
        tagLabel="For Referral Partners"
        heroImage="https://d8j0ntlcm91z4.cloudfront.net/user_373qi3JTSvYmXjqMPJT9idOjFt7/hf_20260523_150508_8d5fb7fc-e484-4ba4-9d30-49813a74f7f8.png"
        heroAlt="A private-client advisor reviewing a UAE property requirement with a client"
        headline={
          <>
            Your network
            <br />
            <span>already has deals in it.</span>
          </>
        }
        sub={
          <>
            You&apos;ve spent years building trust. iClose lets you turn one
            warm intro into a real share of the commission. No license, no
            hustle, no awkward pitch.
          </>
        }
        primaryCta={{ label: 'Get access', href: '#waitlist' }}
        secondaryCta={{ label: 'See the math', href: '#math' }}
        chips={[
          'Up to 80% of the commission on every closed deal',
          'AED 0 upfront cost. No license needed',
          '100% passive. We handle everything',
        ]}
      />

      <PersonaSteps
        eyebrow="How it works"
        heading={<>Three steps. That&apos;s genuinely it.</>}
        steps={[
          {
            title: 'You make an intro.',
            body: "Someone in your circle is buying, selling, or investing in UAE property. You connect them to iClose. One WhatsApp message is enough.",
          },
          {
            title: 'We take it from there.',
            body: "Our certified specialists handle the viewing, negotiation, paperwork, and close. You don't touch any of it.",
          },
          {
            title: 'Deal closes. You earn.',
            body: 'We pay your share of the commission directly. Tracked, transparent, no chasing. On a AED 3M deal with a 2% commission, that’s up to AED 48,000 in your pocket.',
          },
        ]}
      />

      <PersonaAudience
        heading={<>If people trust you with big decisions. This is for you.</>}
        items={[
          {
            title: 'Lawyers.',
            body: 'Your clients are doing transactions. Some of them are moving money into property. You already have the relationship.',
          },
          {
            title: 'Private bankers.',
            body: "HNW clients diversifying into real estate. The question isn't whether they're buying. It's who they trust to guide it.",
          },
          {
            title: 'Business consultants.',
            body: 'Founders, executives, and entrepreneurs already in your network. UAE property is part of almost every wealth plan here.',
          },
          {
            title: 'Community connectors.',
            body: 'Investors, expat community leaders, family office advisors. Anyone whose word carries weight with serious buyers.',
          },
        ]}
      />

      <div id="math">
        <PersonaMath
          heading={<>One intro can pay more than a month&apos;s work.</>}
          body={
            <>
              On a typical Dubai property deal, the agent commission is 2% of
              the value. Through iClose, you keep up to 80% of that
              commission. For one warm introduction.
            </>
          }
          rows={[
            { label: 'Property value', value: 'AED 3,000,000' },
            { label: 'Total agent commission (2%)', value: 'AED 60,000' },
            { label: 'Your share (up to 80%)', value: 'AED 48,000', hi: true },
            { label: 'Your time spent', value: 'One intro message' },
            { label: 'License required', value: 'None' },
            { label: 'Closed deals for AED 200k / yr', value: '4–5', hi: true },
          ]}
          footnote="Commission share paid on deal close, tracked through your iClose partner dashboard."
        />
      </div>

      <PersonaQuote
        quote="I referred two families from my legal practice. Both closed within 6 weeks. iClose handled everything, I just got the transfer notification."
        name="Partner"
        role="Corporate law firm · Dubai DIFC"
      />

      <PersonaWaitlist
        heading={<>Apply to become a referral partner.</>}
        body={
          <>
            Tell us a bit about your network. We onboard selectively. This is
            a premium programme, not a mass affiliate link. No spam, ever.
          </>
        }
      />
    </PersonaChrome>
  );
}
