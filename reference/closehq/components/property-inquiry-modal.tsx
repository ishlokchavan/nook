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
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import styles from './property-inquiry-modal.module.css';

type Ctx = { open: () => void; close: () => void };
const PropertyInquiryCtx = createContext<Ctx | null>(null);

export function usePropertyInquiry(): Ctx {
  const ctx = useContext(PropertyInquiryCtx);
  if (!ctx) {
    return { open: () => {}, close: () => {} };
  }
  return ctx;
}

const inquirySchema = z.object({
  name: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Enter a valid email'),
  phone: z
    .string()
    .min(7, 'Enter a valid phone number')
    .max(20)
    .regex(/^[+\d\s()-]+$/, 'Use digits, spaces, +, - or ()'),
  dealType: z.enum(['offplan', 'secondary'], {
    errorMap: () => ({ message: 'Select one' }),
  }),
  propertyType: z.enum(['residential', 'commercial'], {
    errorMap: () => ({ message: 'Select one' }),
  }),
  projectName: z.string().min(2, 'Enter project name'),
  unitType: z.string().min(2, 'Enter unit type (e.g., 2BR Apartment)'),
  unitPrice: z
    .string()
    .regex(/^\d+$/, 'Enter a valid price')
    .transform((v) => parseInt(v)),
});

type InquiryFormValues = z.infer<typeof inquirySchema>;

export function PropertyInquiryProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

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
    <PropertyInquiryCtx.Provider value={{ open, close }}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isOpen && <PropertyInquiryModal onClose={close} />}
          </AnimatePresence>,
          document.body,
        )}
    </PropertyInquiryCtx.Provider>
  );
}

function PropertyInquiryModal({ onClose }: { onClose: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    mode: 'onTouched',
  });

  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<{ name: string; email: string } | null>(null);

  const onSubmit = async (data: InquiryFormValues) => {
    setServerError(null);

    const payload = {
      firstName: data.name.split(' ')[0],
      lastName: data.name.split(' ').slice(1).join(' ') || data.name,
      email: data.email,
      phone: data.phone,
      jobTitle: 'Property Inquiry',
      intent: 'buyer',
      focus: [data.propertyType === 'residential' ? 'residential' : 'commercial', data.dealType === 'offplan' ? 'offplan' : 'secondary'],
      dealTypes: [],
      message: `Property Inquiry\n\nProject: ${data.projectName}\nUnit Type: ${data.unitType}\nPrice: AED ${data.unitPrice.toLocaleString()}\nDeal Type: ${data.dealType === 'offplan' ? 'Off-Plan' : 'Secondary'}`,
      consentPrivacy: true,
      consentMarketing: false,
      website: '',
      referredByCode: '',
    };

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || 'Something went wrong');
      }
      setSubmitted({ name: data.name, email: data.email });
      setSuccess(true);
      reset();
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.',
      );
    }
  };

  const err = (k: keyof InquiryFormValues) => errors[k]?.message as string | undefined;

  return (
    <motion.div
      className={styles.overlay}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      role="dialog"
      aria-modal="true"
      aria-label="Property Inquiry"
    >
      <motion.div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
          ×
        </button>

        {success ? (
          <div className={styles.header}>
            <div className={styles.successBadge}>✓</div>
            <h2 className={styles.title}>Inquiry sent!</h2>
            <p className={styles.subtitle}>
              Thanks {submitted?.name}. We&apos;ll review your property details and be in touch
              shortly.
            </p>
            <button type="button" className={styles.btnClose} onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            <div className={styles.header}>
              <h2 className={styles.title}>Property Details</h2>
              <p className={styles.subtitle}>Tell us about the property you want to close.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  className={`${styles.input} ${err('name') ? styles.inputError : ''}`}
                  {...register('name')}
                />
                {err('name') && <p className={styles.error}>{err('name')}</p>}
              </div>

              <div className={styles.grid2}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className={`${styles.input} ${err('email') ? styles.inputError : ''}`}
                    {...register('email')}
                  />
                  {err('email') && <p className={styles.error}>{err('email')}</p>}
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="phone">
                    Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+971 50 123 4567"
                    className={`${styles.input} ${err('phone') ? styles.inputError : ''}`}
                    {...register('phone')}
                  />
                  {err('phone') && <p className={styles.error}>{err('phone')}</p>}
                </div>
              </div>

              <div className={styles.grid2}>
                <div className={styles.field}>
                  <label className={styles.label}>Deal Type</label>
                  <Controller
                    control={control}
                    name="dealType"
                    render={({ field }) => (
                      <div className={styles.radioGroup}>
                        {[
                          { value: 'offplan', label: 'Off-plan' },
                          { value: 'secondary', label: 'Secondary' },
                        ].map((opt) => (
                          <label key={opt.value} className={styles.radioLabel}>
                            <input
                              type="radio"
                              value={opt.value}
                              checked={field.value === opt.value}
                              onChange={() => field.onChange(opt.value)}
                              className={styles.radioInput}
                            />
                            {opt.label}
                          </label>
                        ))}
                      </div>
                    )}
                  />
                  {err('dealType') && <p className={styles.error}>{err('dealType')}</p>}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Property Type</label>
                  <Controller
                    control={control}
                    name="propertyType"
                    render={({ field }) => (
                      <div className={styles.radioGroup}>
                        {[
                          { value: 'residential', label: 'Residential' },
                          { value: 'commercial', label: 'Commercial' },
                        ].map((opt) => (
                          <label key={opt.value} className={styles.radioLabel}>
                            <input
                              type="radio"
                              value={opt.value}
                              checked={field.value === opt.value}
                              onChange={() => field.onChange(opt.value)}
                              className={styles.radioInput}
                            />
                            {opt.label}
                          </label>
                        ))}
                      </div>
                    )}
                  />
                  {err('propertyType') && <p className={styles.error}>{err('propertyType')}</p>}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="projectName">
                  Project Name
                </label>
                <input
                  id="projectName"
                  type="text"
                  placeholder="e.g., Creek Vista"
                  className={`${styles.input} ${err('projectName') ? styles.inputError : ''}`}
                  {...register('projectName')}
                />
                {err('projectName') && <p className={styles.error}>{err('projectName')}</p>}
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="unitType">
                  Unit Type
                </label>
                <input
                  id="unitType"
                  type="text"
                  placeholder="e.g., 2BR Apartment"
                  className={`${styles.input} ${err('unitType') ? styles.inputError : ''}`}
                  {...register('unitType')}
                />
                {err('unitType') && <p className={styles.error}>{err('unitType')}</p>}
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="unitPrice">
                  Unit Price (AED)
                </label>
                <input
                  id="unitPrice"
                  type="number"
                  placeholder="2000000"
                  className={`${styles.input} ${err('unitPrice') ? styles.inputError : ''}`}
                  {...register('unitPrice')}
                />
                {err('unitPrice') && <p className={styles.error}>{err('unitPrice')}</p>}
              </div>

              <button type="submit" className={styles.submit} disabled={isSubmitting}>
                {isSubmitting ? 'Sending…' : 'Send Inquiry →'}
              </button>

              {serverError && <p className={styles.serverError}>{serverError}</p>}

              <p className={styles.legal}>
                By submitting you agree to our{' '}
                <a href="/privacy" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>
                . We&apos;ll only use your details to follow up about your property inquiry.
              </p>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
