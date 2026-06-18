'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isSpecialists = pathname === '/specialists';

  const navLinks = isSpecialists
    ? [{ href: '/', label: 'For Members' }]
    : [{ href: '/specialists', label: 'For Specialists' }];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-paper/80 backdrop-blur-2xl">
      <div className="container-wide flex items-center justify-between h-12">
        <Logo variant="dark" />

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-1.5 text-[13px] font-normal text-ink/80 hover:text-ink transition-colors rounded-full hover:bg-mist"
              style={{ letterSpacing: '-0.01em' }}
            >
              {link.label}
            </a>
          ))}
          <a href="/#apply" className="ml-2">
            <Button variant="primary" size="sm">Join as a Member</Button>
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((s) => !s)}
          className="md:hidden flex items-center justify-center h-9 w-9 text-ink rounded-full hover:bg-mist transition-colors"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-paper border-t border-hairline shadow-elevated"
          >
            <div className="container-wide py-2 flex flex-col">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="py-4 border-b border-hairline/60 last:border-b-0 text-ink text-[17px] font-normal"
                  style={{ letterSpacing: '-0.012em' }}
                >
                  {link.label}
                </a>
              ))}
              <div className="py-4">
                <a href="/#apply" onClick={() => setOpen(false)}>
                  <Button variant="primary" size="md" className="w-full">Join as a Member</Button>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
