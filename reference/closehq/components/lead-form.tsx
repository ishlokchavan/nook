'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight, Loader2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { leadSchema, type LeadFormValues } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/lib/analytics';
import {
  captureReferralFromUrl,
  getStoredReferralCode,
} from '@/lib/referral';

const inputClasses =
  'w-full h-12 px-4 bg-paper border border-hairline rounded-xl text-ink text-[17px] placeholder:text-graphite-light focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all';

export function LeadForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: { website: '', firstName: '', lastName: '', phone: '', email: '', consentPrivacy: false, consentMarketing: false },
  });

  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    captureReferralFromUrl();
  }, []);

  const onSubmit = async (data: LeadFormValues) => {
    setServerError(null);
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          referredByCode: data.referredByCode || getStoredReferralCode() || '',
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || 'Something went wrong');
      }

      trackEvent('member_signup', { source: 'early_access' });
      setSuccess(true);
      reset();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <AnimatePresence mode="wait">
      {success ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-8"
        >
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-mist mb-5">
            <Check className="h-6 w-6 text-ink" strokeWidth={2} />
          </div>
          <h3 className="display-sm">You&apos;re in.</h3>
          <p
            className="mt-3 text-[17px] text-graphite-dark leading-[1.5]"
            style={{ letterSpacing: '-0.012em' }}
          >
            Check your inbox, we&apos;ve sent confirmation. We&apos;ll be in touch before launch.
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-4"
          noValidate
        >
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register('website')}
            className="absolute left-[-9999px] top-[-9999px] h-0 w-0 opacity-0"
            aria-hidden
          />

          <div className="grid grid-cols-2 gap-3">
            <Field label="First name" error={errors.firstName?.message}>
              <input {...register('firstName')} type="text" autoComplete="given-name" placeholder="First name" className={inputClasses} />
            </Field>
            <Field label="Last name" error={errors.lastName?.message}>
              <input {...register('lastName')} type="text" autoComplete="family-name" placeholder="Last name" className={inputClasses} />
            </Field>
          </div>

          <Field label="Phone" error={errors.phone?.message}>
            <input {...register('phone')} type="tel" autoComplete="tel" placeholder="+971 50 123 4567" className={inputClasses} />
          </Field>

          <Field label="Email" error={errors.email?.message}>
            <input {...register('email')} type="email" autoComplete="email" placeholder="you@example.com" className={inputClasses} />
          </Field>

          <div className="space-y-3 pt-1">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('consentPrivacy')}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-hairline accent-ink cursor-pointer"
              />
              <span className="text-[13px] text-graphite-dark leading-[1.5]">
                I have read and agree to the{' '}
                <a href="/privacy" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                {' '}and{' '}
                <a href="/terms" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">Terms of Service</a>
                <span className="text-red-500 ml-0.5">*</span>
              </span>
            </label>
            {errors.consentPrivacy && (
              <p className="text-[13px] text-red-600 pl-7">{errors.consentPrivacy.message}</p>
            )}

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('consentMarketing')}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-hairline accent-ink cursor-pointer"
              />
              <span className="text-[13px] text-graphite leading-[1.5]">
                I&apos;d like to receive updates, deal alerts, and news from iClose (optional)
              </span>
            </label>
          </div>

          {serverError && (
            <p className="text-[15px] text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {serverError}
            </p>
          )}

          <div className="pt-1">
            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
              ) : (
                <>Join as a Member <ChevronRight className="h-4 w-4" strokeWidth={2.5} /></>
              )}
            </Button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-sm font-medium text-graphite-dark tracking-tight" style={{ letterSpacing: '-0.01em' }}>
          {label}
        </label>
        {error && <span className="text-[13px] text-red-600">{error}</span>}
      </div>
      {children}
    </div>
  );
}
