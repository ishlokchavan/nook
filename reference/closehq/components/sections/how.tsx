'use client';

import { motion } from 'framer-motion';
import { UserPlus, BookOpenCheck, Handshake } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';

const STEPS = [
  {
    number: '1',
    icon: UserPlus,
    title: 'Join as a Member or apply as a Specialist.',
    body: 'Members, whether agents, lawyers, accountants, etc. sign up and get immediate access to our community. Specialists apply separately and are vetted before joining. Every role has a clear place.',
  },
  // {
  //   number: '2',
  //   icon: BookOpenCheck,
  //   title: 'Learn the market or share what you know.',
  //   body: 'Agents and professionals access area playbooks, building deep-dives, and community intelligence created by active Specialists. Specialists publish their expertise to establish their authority and attract the right inquiries.',
  // },
  {
    number: '2',
    icon: Handshake,
    title: 'Connect to close.',
    body: "When a Member has a requirement or when a client of a professional needs an asset, the Specialist who knows that domain best is matched directly. The right knowledge meets the right buyer, every time. While you can earn commissions upto 100% ",
  },
];

export function How() {
  return (
    <section id="how" className="bg-paper py-16 sm:py-20 md:py-24 lg:py-28">
      <div className="container-wide">
        <Reveal>
          <h2 className="display-lg text-balance max-w-xl mb-14 md:mb-16">
            How the community works.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="card-mist p-8 sm:p-10"
              >
                <div className="flex items-center justify-between mb-8">
                  <span className="display-md text-graphite-light">{step.number}</span>
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-paper border border-hairline">
                    <Icon className="h-5 w-5 text-ink" strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="display-sm mb-3">{step.title}</h3>
                <p className="text-[17px] text-graphite-dark leading-[1.5]" style={{ letterSpacing: '-0.012em' }}>
                  {step.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
