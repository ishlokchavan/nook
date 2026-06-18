'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Reveal } from '@/components/ui/reveal';
import { MobileCarousel } from '@/components/ui/mobile-carousel';

const TOOLS = [
  {
    title: 'Concierge.',
    description: 'Premium experiences for high-value clients, handled end to end.',
    image: '/images/tools-concierge.jpg',
  },
  {
    title: 'Developer relations.',
    description: 'Direct partnerships with Dubai’s major developers. Close faster.',
    image: '/images/tools-developer.jpg',
  },
  {
    title: 'Compliance suite.',
    description: 'RERA-approved templates and documentation. Always compliant.',
    image: '/images/tools-compliance.jpg',
  },
  {
    title: 'Performance dashboard.',
    description: 'Live analytics. Track every deal. Real-time insights.',
    image: '/images/tools-dashboard.jpg',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

function ToolCard({ tool }: { tool: (typeof TOOLS)[number] }) {
  return (
    <div className="card-mist overflow-hidden h-full flex flex-col">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={tool.image}
          alt={tool.title}
          fill
          quality={90}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      <div className="p-6 sm:p-8 md:p-10">
        <h3 className="display-sm">{tool.title}</h3>
        <p
          className="mt-3 text-[17px] text-graphite-dark leading-[1.5]"
          style={{ letterSpacing: '-0.012em' }}
        >
          {tool.description}
        </p>
      </div>
    </div>
  );
}

export function ToolsShowcase() {
  return (
    <section className="bg-paper py-16 sm:py-20 md:py-24 lg:py-32">
      <div className="container-wide">
        <div className="max-w-3xl mb-14 md:mb-20">
          <Reveal>
            <h2 className="display-lg text-balance">
              Everything a broker needs.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="subhead mt-6 max-w-2xl">
              From client concierge to regulatory compliance, we’ve built the infrastructure so you can focus on deals.
            </p>
          </Reveal>
        </div>

        {/* Mobile: carousel */}
        <div className="md:hidden">
          <MobileCarousel
            ariaLabel="Broker tools"
            items={TOOLS.map((t) => (
              <ToolCard key={t.title} tool={t} />
            ))}
          />
        </div>

        {/* Tablet+: grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="hidden md:grid grid-cols-2 gap-4 md:gap-6"
        >
          {TOOLS.map((tool) => (
            <motion.div key={tool.title} variants={item}>
              <ToolCard tool={tool} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
