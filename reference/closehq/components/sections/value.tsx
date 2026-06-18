'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { BookOpen, Users, Building2, ShieldCheck } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';

const VALUES = [
  {
    icon: BookOpen,
    title: 'Education from practitioners.',
    body: 'Every piece of content on iClose is created by Specialists who are actively working in the areas they cover. Not theory, not analysis, knowledge that has been tested by real transactions.',
  },
  {
    icon: Building2,
    title: 'Inventory with context.',
    body: "When a Specialist lists a unit, it comes with the depth of someone who knows that building from the ground floor up. Members don't just get a property, they get the full picture behind it.",
  },
  {
    icon: Users,
    title: 'A trusted professional network.',
    body: 'iClose Members include agents, lawyers, accountants, financial advisors, family offices, and private equity. When a Specialist shares their inventory here, it reaches the professionals who have serious buyers, not browsers.',
  },
  {
    icon: ShieldCheck,
    title: 'Discretion built in.',
    body: 'Every interaction within iClose is handled with the privacy that professional relationships require. Members and Specialists connect within the platform, quietly, directly, and without unnecessary exposure.',
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

export function Value() {
  return (
    <section id="learn" className="bg-mist py-16 sm:py-20 md:py-24 lg:py-28 overflow-hidden">
      <div className="container-wide">

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-16 md:mb-20">
          <Reveal>
            <h2 className="display-lg text-balance">
              Knowledge, inventory, and the people to make it move.
            </h2>
          </Reveal>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-apple aspect-[4/3]"
          >
            <Image
              src="/images/hero-burj.jpg"
              alt="Dubai skyline"
              fill
              quality={80}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/25 to-transparent" />
          </motion.div>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {VALUES.map((v) => {
            const Icon = v.icon;
            return (
              <motion.div key={v.title} variants={item} className="card-surface p-8 sm:p-10">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-mist border border-hairline mb-6">
                  <Icon className="h-5 w-5 text-ink" strokeWidth={1.5} />
                </div>
                <h3 className="display-sm mb-3">{v.title}</h3>
                <p className="text-[17px] text-graphite-dark leading-[1.5]" style={{ letterSpacing: '-0.012em' }}>
                  {v.body}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
