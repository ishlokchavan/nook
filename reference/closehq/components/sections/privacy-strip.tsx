'use client';

import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

export function PrivacyStrip() {
  return (
    <section className="bg-paper py-14 sm:py-16 md:py-20 lg:py-28">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-mist mb-6">
            <Lock className="h-5 w-5 text-ink" strokeWidth={2} />
          </div>
          <h2 className="display-lg text-balance">
            Your name. Your network. Yours.
          </h2>
          <p className="subhead mt-6 max-w-xl mx-auto text-balance">
            Brokers on iClose stay completely anonymous. Buyers, developers, and even other agents only see the deal, never your identity, your client list, or your pipeline.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
