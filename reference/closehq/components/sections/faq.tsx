'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';

const FAQS = [
  {
    q: 'What is iClose?',
    a: 'iClose is a Dubai real estate community and education platform built around three types of professionals: agents who want to build expertise in the secondary market, professionals (lawyers, accountants, advisors, family offices) whose clients have property requirements, and Specialists who have area or building expertise and inventory to match. The platform connects all three in a way that benefits everyone.',
  },
  {
    q: 'Who can join as a Member?',
    a: "Anyone with a professional connection to Dubai real estate, agents, brokers, lawyers, accountants, financial advisors, POAs, investors, family offices, etc. If you have clients with asset requirements, or if you're building expertise in the secondary market, iClose is built for you.",
  },
  {
    q: "I'm an agent. How does iClose help me specifically?",
    a: "iClose Academy gives you structured content from Specialists who are actively working the areas you want to enter, area playbooks, building deep-dives, and community intelligence. It's the fastest path to becoming a credible secondary market professional, built on real knowledge from people in the field.",
  },
  {
    q: "I'm a lawyer / accountant / advisor. How does this help my clients?",
    a: "When your client has a specific asset requirement, you submit an inquiry directly with us, and we will connect you to the Specialist who knows that domain the best.",
  },
  {
    q: 'What is a Specialist and how is it different from a Member?',
    a: "A Specialist is a vetted community or building expert who knows a specific area of Dubai's secondary market with real depth, transaction history, current inventory, pricing nuance. Specialists apply separately and are reviewed before joining. They publish their knowledge for Members, and when a Member inquiry falls within their domain, they are the focal point to close it.",
  },
  {
    q: 'Why would a Specialist join iClose?',
    a: "iClose gives Specialists access to a growing pool of professionals who have active buyers, agents, lawyers, accountants, family offices. When you share your knowledge here, you build authority with the exact people who will refer serious inquiries your way. When a Member needs a unit in your domain, you are the first and only call.",
  },
  {
    q: 'What does the transaction split mean?',
    a: "When a deal closes through the platform, the split is the share you keep versus what goes to iClose. Plus Members keep 60%. It improves at Pro (80%), Pro Max (90%), and Ultra (100%). This is an added benefit of membership, the community and education platform are available regardless of transaction activity.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-paper py-16 sm:py-20 md:py-24 lg:py-28">
      <div className="container-wide">
        <div className="flex flex-col lg:flex-row lg:gap-20 gap-12">

          {/* Left: label + heading + subtitle */}
          <div className="lg:w-80 xl:w-96 shrink-0">
            <Reveal>
              <span className="inline-flex items-center px-3 py-1 rounded-full border border-hairline bg-mist text-[11px] font-medium tracking-[0.08em] uppercase text-graphite mb-6">
                Get Clarity
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="display-lg text-balance">
                Frequently asked questions
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 text-[17px] text-graphite-dark leading-[1.55]" style={{ letterSpacing: '-0.012em' }}>
                Clear answers to help you understand iClose, membership, and how the platform works.
              </p>
            </Reveal>
          </div>

          {/* Right: accordion cards */}
          <div className="flex-1 flex flex-col gap-3">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl border border-hairline bg-white overflow-hidden"
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between gap-6 px-6 py-5 text-left"
                >
                  <span
                    className="text-[17px] font-medium text-ink leading-snug"
                    style={{ letterSpacing: '-0.012em' }}
                  >
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: open === i ? 90 : 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="shrink-0"
                  >
                    <ChevronRight className="h-5 w-5 text-graphite" strokeWidth={2} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p
                        className="px-6 pb-5 text-[16px] text-graphite-dark leading-[1.6]"
                        style={{ letterSpacing: '-0.012em' }}
                      >
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
