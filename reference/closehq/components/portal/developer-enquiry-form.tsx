'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const input =
  'w-full h-11 px-3.5 bg-paper border border-hairline rounded-xl text-ink text-[15px] placeholder:text-graphite-light focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all';

interface EnquiryValues {
  name: string;
  email: string;
  phone: string;
  message: string;
  consentPrivacy: boolean;
  website?: string; // honeypot
}

/**
 * Developer / off-plan "Talk to an expert" enquiry. Posts to the existing lead
 * pipeline (form → CRM/email) per the handoff decision.
 */
export function DeveloperEnquiryForm() {
  const params = useSearchParams();
  const dev = params.get('dev');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryValues>({
    defaultValues: {
      consentPrivacy: false,
      website: '',
      message: dev ? `I'd like off-plan advice about ${dev[0].toUpperCase() + dev.slice(1)}.` : '',
    },
  });
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  async function onSubmit(values: EnquiryValues) {
    setServerError(null);
    const [firstName, ...rest] = values.name.trim().split(' ');
    const payload = {
      firstName: firstName || values.name,
      lastName: rest.join(' ') || '—',
      email: values.email,
      phone: values.phone,
      intent: 'buyer' as const,
      message: `[Off-plan expert enquiry${dev ? ` · ${dev}` : ''}] ${values.message}`,
      consentPrivacy: values.consentPrivacy,
      website: values.website,
    };
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Something went wrong');
      }
      setSuccess(true);
    } catch (e) {
      setServerError(e instanceof Error ? e.message : 'Something went wrong');
    }
  }

  if (success) {
    return (
      <div className="card-surface p-8 text-center">
        <span className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-journey-listing/15 mb-4">
          <Check className="h-7 w-7 text-journey-listing" />
        </span>
        <h2 className="display-sm">Thanks — we&apos;ll be in touch</h2>
        <p className="subhead mt-3">Our off-plan team will reach out shortly with pricing and credits.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card-surface p-6 space-y-4">
      <div>
        <label className="block text-[13px] font-medium text-ink mb-1.5">Full name</label>
        <input className={input} {...register('name', { required: 'Enter your name' })} />
        {errors.name && <p className="text-[12px] text-journey-flag mt-1">{errors.name.message}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[13px] font-medium text-ink mb-1.5">Email</label>
          <input type="email" className={input} {...register('email', { required: 'Enter your email' })} />
          {errors.email && <p className="text-[12px] text-journey-flag mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-[13px] font-medium text-ink mb-1.5">Phone</label>
          <input className={input} {...register('phone', { required: 'Enter your phone' })} />
          {errors.phone && <p className="text-[12px] text-journey-flag mt-1">{errors.phone.message}</p>}
        </div>
      </div>
      <div>
        <label className="block text-[13px] font-medium text-ink mb-1.5">Message</label>
        <textarea rows={3} className={input + ' h-auto py-2.5'} {...register('message')} />
      </div>
      <label className="flex items-start gap-2.5 text-[13px] text-ink">
        <input type="checkbox" className="h-4 w-4 mt-0.5 accent-[#0071e3]" {...register('consentPrivacy', { required: true })} />
        I agree to be contacted about my enquiry.
      </label>
      {errors.consentPrivacy && <p className="text-[12px] text-journey-flag">You must agree to continue</p>}

      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden {...register('website')} />
      {serverError && <p className="text-[14px] text-journey-flag">{serverError}</p>}

      <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : 'Talk to an expert'}
      </Button>
    </form>
  );
}
