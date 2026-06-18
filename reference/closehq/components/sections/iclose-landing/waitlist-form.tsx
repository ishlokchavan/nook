'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { leadFocusValues, type LeadFormValues } from '@/lib/validations';
import { siteConfig } from '@/lib/site-config';
import {
  buildReferralLink,
  captureReferralFromUrl,
  getStoredReferralCode,
} from '@/lib/referral';
import styles from './iclose-landing.module.css';

const intentValues = ['buyer', 'closer'] as const;

const simpleSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Tell us your full name')
    .max(80, 'Keep it under 80 characters'),
  email: z.string().email('Enter a valid email').max(120),
  phone: z
    .string()
    .min(7, 'Enter a valid phone number')
    .max(20)
    .regex(/^[+\d\s()-]+$/, 'Use digits, spaces, +, - or ()'),
  intent: z.enum(intentValues, {
    errorMap: () => ({ message: 'Pick one to continue' }),
  }),
  focus: z
    .array(z.enum(leadFocusValues))
    .min(1, 'Pick at least one focus area')
    .max(3),
  website: z.string().optional(),
});
type SimpleValues = z.infer<typeof simpleSchema>;

const intentOptions: {
  value: (typeof intentValues)[number];
  label: string;
  sub: string;
}[] = [
  {
    value: 'closer',
    label: 'Close deal or Enquire',
    sub: 'Broker, lawyer, advisor or anyone with clients.',
  },
  {
    value: 'buyer',
    label: 'Buy a property',
    sub: '100% cashback on every deal you close with us.',
  },
];

const focusOptions: { value: (typeof leadFocusValues)[number]; label: string }[] = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'offplan', label: 'Offplan' },
];

const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL ||
  'https://calendly.com/hello-iclose/30min';
const CALL_PHONE = siteConfig.phone || '+971501234567';

export type WaitlistFormProps = {
  /* Pre-selects the intent radio. Pages tied to a persona pass their
     persona ('buyer' on /for-buyers, 'closer' on /for-closers); the
     landing page defaults to 'closer' (first option) for convenience. */
  defaultIntent?: (typeof intentValues)[number];
  /* Hides the "What brings you here?" intent picker entirely and locks
     the submission to defaultIntent. Used on the buyer-only landing so
     the form reads as a single buyer flow, not a closer/buyer choice. */
  hideIntent?: boolean;
};

export function WaitlistForm({
  defaultIntent = 'closer',
  hideIntent = false,
}: WaitlistFormProps = {}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<SimpleValues>({
    resolver: zodResolver(simpleSchema),
    mode: 'onTouched',
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      intent: defaultIntent,
      focus: [],
      website: '',
    },
  });

  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [submitted, setSubmitted] = useState<{ name: string; email: string } | null>(null);
  const [issuedCode, setIssuedCode] = useState<string | null>(null);
  const [showCalendly, setShowCalendly] = useState(false);
  const [copied, setCopied] = useState(false);

  // Capture inbound ?ref= (or its ?partner= alias) once on mount. The
  // helper promotes the URL value into localStorage + the iclose_ref
  // cookie so attribution survives even if the visitor navigates away
  // before submitting.
  useEffect(() => {
    captureReferralFromUrl();
  }, []);

  useEffect(() => {
    if (!showCalendly) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setShowCalendly(false);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [showCalendly]);

  const onSubmit = async (data: SimpleValues) => {
    setServerError(null);

    const trimmed = data.fullName.trim();
    const parts = trimmed.split(/\s+/);
    const firstName = parts[0] || trimmed;
    const lastName = parts.length > 1 ? parts.slice(1).join(' ') : firstName;

    const payload: LeadFormValues = {
      firstName,
      lastName,
      email: data.email,
      phone: data.phone,
      /* Mirror intent in jobTitle too so the admin notification email,
         which still reads jobTitle, keeps showing "Buyer" / "Closer"
         without code changes there. */
      jobTitle: data.intent === 'buyer' ? 'Buyer' : 'Closer',
      intent: data.intent,
      focus: data.focus,
      dealTypes: [],
      message: '',
      consentPrivacy: true,
      consentMarketing: marketingOptIn,
      website: data.website ?? '',
      referredByCode: getStoredReferralCode() || '',
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
      const body = await res.json().catch(() => ({}));
      setIssuedCode((body?.referralCode as string) || null);
      setSubmitted({ name: trimmed, email: data.email });
      setSuccess(true);
      reset();
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.',
      );
    }
  };

  if (success) {
    const calendlyEmbedUrl = (() => {
      const url = new URL(CALENDLY_URL);
      url.searchParams.set('hide_gdpr_banner', '1');
      url.searchParams.set('embed_domain', 'iclose.ae');
      url.searchParams.set('embed_type', 'Inline');
      if (submitted?.name) url.searchParams.set('name', submitted.name);
      if (submitted?.email) url.searchParams.set('email', submitted.email);
      return url.toString();
    })();
    const referralLink = issuedCode ? buildReferralLink(issuedCode) : null;
    const copyReferral = async () => {
      if (!referralLink) return;
      try {
        await navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      } catch {
        // Fall back to a transient selection so users can still copy.
      }
    };

    return (
      <>
        <div className={styles.tfShell}>
          <div className={styles.wlSuccess}>
            <div className={styles.successBadge} aria-hidden="true">
              ✓
            </div>
            <h3 className={styles.successTitle}>You&apos;re on the list.</h3>
            <p className={styles.successBody}>
              We&apos;ll be in touch shortly. Or skip the wait. Pick how
              you&apos;d like to talk.
            </p>
            <div className={styles.wlSuccessCtas}>
              <a
                href={`tel:${CALL_PHONE.replace(/\s+/g, '')}`}
                className={styles.btnBluePrimary}
              >
                Call us now
              </a>
              <button
                type="button"
                className={styles.btnGhost}
                onClick={() => setShowCalendly(true)}
              >
                Book a call
              </button>
            </div>

            {referralLink && (
              <div className={styles.referralBlock}>
                <div className={styles.referralLabel}>
                  Your personal invite link
                </div>
                <div className={styles.referralLinkRow}>
                  <code className={styles.referralLink}>{referralLink}</code>
                  <button
                    type="button"
                    onClick={copyReferral}
                    className={styles.referralCopy}
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p className={styles.referralHint}>
                  Share it with anyone you think could benefit from this.
                </p>
              </div>
            )}
          </div>
        </div>

        {typeof document !== 'undefined' &&
          createPortal(
            <AnimatePresence>
              {showCalendly && (
                <motion.div
                  className={styles.calendlyOverlay}
                  onClick={() => setShowCalendly(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  role="dialog"
                  aria-modal="true"
                  aria-label="Book a call"
                >
                  <motion.div
                    className={styles.calendlyModal}
                    onClick={(e) => e.stopPropagation()}
                    initial={{ opacity: 0, scale: 0.96, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 16 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <button
                      type="button"
                      className={styles.calendlyClose}
                      onClick={() => setShowCalendly(false)}
                      aria-label="Close scheduling"
                    >
                      ×
                    </button>
                    <iframe
                      src={calendlyEmbedUrl}
                      title="Book a call with iClose"
                      className={styles.calendlyFrame}
                      allow="camera; microphone; fullscreen"
                    />
                    <a
                      href={CALENDLY_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.calendlyOpen}
                    >
                      Open in a new tab ↗
                    </a>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>,
            document.body,
          )}
      </>
    );
  }

  const err = (k: keyof SimpleValues) =>
    errors[k]?.message as string | undefined;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`${styles.tfShell} ${styles.wlFormFlat}`}
      noValidate
    >
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        data-lpignore="true"
        data-1p-ignore="true"
        data-form-type="other"
        {...register('website')}
        className={styles.honeypot}
        aria-hidden
      />

      <div className={styles.wlFormBody}>
        <div className={styles.wlField}>
          <label className={styles.wlLabel} htmlFor="wl-name">
            Full name
          </label>
          <input
            id="wl-name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            className={`${styles.tfInput} ${err('fullName') ? styles.tfInputError : ''}`}
            {...register('fullName')}
          />
          {err('fullName') && <p className={styles.tfError}>{err('fullName')}</p>}
        </div>

        <div className={styles.wlGridTwo}>
          <div className={styles.wlField}>
            <label className={styles.wlLabel} htmlFor="wl-email">
              Email
            </label>
            <input
              id="wl-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={`${styles.tfInput} ${err('email') ? styles.tfInputError : ''}`}
              {...register('email')}
            />
            {err('email') && <p className={styles.tfError}>{err('email')}</p>}
          </div>
          <div className={styles.wlField}>
            <label className={styles.wlLabel} htmlFor="wl-phone">
              Phone
            </label>
            <input
              id="wl-phone"
              type="tel"
              autoComplete="tel"
              placeholder="+971 50 123 4567"
              className={`${styles.tfInput} ${err('phone') ? styles.tfInputError : ''}`}
              {...register('phone')}
            />
            {err('phone') && <p className={styles.tfError}>{err('phone')}</p>}
          </div>
        </div>

        {!hideIntent && (
          <div className={styles.wlField}>
            <span className={styles.wlLabel}>What brings you here?</span>
            <Controller
              control={control}
              name="intent"
              render={({ field }) => (
                <div className={styles.wlPickGroup} role="radiogroup">
                  {intentOptions.map((opt) => {
                    const checked = field.value === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="radio"
                        aria-checked={checked}
                        onClick={() => field.onChange(opt.value)}
                        className={`${styles.wlPickCard} ${
                          checked ? styles.wlPickCardActive : ''
                        }`}
                      >
                        <span className={styles.wlPickCardLabel}>{opt.label}</span>
                        <span className={styles.wlPickCardSub}>{opt.sub}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            />
            {err('intent') && <p className={styles.tfError}>{err('intent')}</p>}
          </div>
        )}

        <div className={styles.wlField}>
          <span className={styles.wlLabel}>What are you focusing on?</span>
          <Controller
            control={control}
            name="focus"
            render={({ field }) => {
              const value: string[] = field.value ?? [];
              const toggle = (v: (typeof leadFocusValues)[number]) => {
                if (value.includes(v)) {
                  field.onChange(value.filter((x) => x !== v));
                } else {
                  field.onChange([...value, v]);
                }
              };
              return (
                <div className={styles.wlPickChipRow}>
                  {focusOptions.map((opt) => {
                    const checked = value.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="checkbox"
                        aria-checked={checked}
                        onClick={() => toggle(opt.value)}
                        className={`${styles.wlPickChip} ${
                          checked ? styles.wlPickChipActive : ''
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              );
            }}
          />
          {err('focus') && <p className={styles.tfError}>{err('focus')}</p>}
        </div>

        <label className={styles.tfConsent}>
          <input
            type="checkbox"
            checked={marketingOptIn}
            onChange={(e) => setMarketingOptIn(e.target.checked)}
          />
          <span>
            Send me product updates and launch news. (Optional, we don&apos;t
            share your details.)
          </span>
        </label>

        <button
          type="submit"
          className={styles.wlSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending…' : 'Get started →'}
        </button>

        {serverError && (
          <p className={styles.serverError} style={{ marginTop: 12 }}>
            {serverError}
          </p>
        )}

        <p className={styles.tfLegal}>
          By submitting you agree to our{' '}
          <a href="/privacy" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>{' '}
          and{' '}
          <a href="/terms" target="_blank" rel="noopener noreferrer">
            Terms of Service
          </a>
          . We&apos;ll only use your details to follow up about iClose.
        </p>
      </div>
    </form>
  );
}
