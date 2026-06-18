'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { WaitlistForm } from '@/components/sections/iclose-landing/waitlist-form';
import { captureReferralFromUrl } from '@/lib/referral';
import styles from './get-started-modal.module.css';

type Ctx = { open: (intent?: 'buyer' | 'closer') => void; close: () => void };
const GetStartedCtx = createContext<Ctx | null>(null);

export function useGetStarted(): Ctx {
  const ctx = useContext(GetStartedCtx);
  if (!ctx) {
    // Outside the provider: no-op so a misplaced button doesn't crash
    // server-rendered pages.
    return { open: () => {}, close: () => {} };
  }
  return ctx;
}

/* Wraps the app. Listens for clicks on any element decorated with
   data-get-started so legacy anchors and freshly added buttons can
   trigger the same modal without each call site importing the hook. */
export function GetStartedProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [intent, setIntent] = useState<'buyer' | 'closer' | undefined>();

  const open = useCallback((i?: 'buyer' | 'closer') => {
    setIntent(i);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  /* Capture ?ref=CODE once on every page load. Lives at the provider
     level so attribution sticks even if no inline form has mounted
     yet, a visitor can land via /?ref=AB12CD, click a "Get started"
     button, and the modal's form picks up the stored code. */
  useEffect(() => {
    captureReferralFromUrl();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const hit = target.closest('[data-get-started]') as HTMLElement | null;
      if (!hit) return;
      e.preventDefault();
      const i = hit.dataset.getStarted;
      open(i === 'buyer' || i === 'closer' ? i : undefined);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [open]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, close]);

  return (
    <GetStartedCtx.Provider value={{ open, close }}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className={styles.overlay}
                onClick={close}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                role="dialog"
                aria-modal="true"
                aria-label="Get started with iClose"
              >
                <motion.div
                  className={styles.modal}
                  onClick={(e) => e.stopPropagation()}
                  initial={{ opacity: 0, scale: 0.96, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 16 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <button
                    type="button"
                    className={styles.close}
                    onClick={close}
                    aria-label="Close"
                  >
                    ×
                  </button>
                  <div className={styles.header}>
                    <h2 className={styles.title}>
                      {intent === 'buyer' ? 'Ready to buy?' : 'Ready to close?'}
                    </h2>
                    <p className={styles.subtitle}>
                      Tell us a bit about you. We&apos;ll be in touch shortly.
                    </p>
                  </div>
                  {/* On the buyer-only flow we lock the form to buyer intent
                      and hide the closer/buyer picker. Other triggers keep
                      the choice. */}
                  <WaitlistForm
                    defaultIntent={intent || 'closer'}
                    hideIntent={intent === 'buyer'}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </GetStartedCtx.Provider>
  );
}
