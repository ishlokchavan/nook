'use client';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight, Loader2, Check, Paperclip, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { internSchema, type InternFormValues } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/lib/analytics';

const inputClasses =
  'w-full h-12 px-4 bg-paper border border-hairline rounded-xl text-ink text-[17px] placeholder:text-graphite-light focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all';

const textareaClasses =
  'w-full px-4 py-3 bg-paper border border-hairline rounded-xl text-ink text-[17px] placeholder:text-graphite-light focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-none leading-[1.5]';

export function InternForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InternFormValues>({
    resolver: zodResolver(internSchema),
    defaultValues: { website: '' },
  });

  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setResumeError(null);
    if (!file) return setResumeFile(null);
    if (file.type !== 'application/pdf') {
      setResumeError('Please upload a PDF file');
      setResumeFile(null);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setResumeError('File must be under 10 MB');
      setResumeFile(null);
      return;
    }
    setResumeFile(file);
  };

  const onSubmit = async (data: InternFormValues) => {
    setServerError(null);
    setResumeError(null);

    const fd = new FormData();
    fd.append('firstName', data.firstName);
    fd.append('lastName', data.lastName);
    fd.append('email', data.email);
    fd.append('phone', data.phone);
    if (data.instagram) fd.append('instagram', data.instagram);
    if (data.message) fd.append('message', data.message);
    if (data.website) fd.append('website', data.website);
    if (resumeFile) fd.append('resume', resumeFile);

    try {
      const res = await fetch('/api/intern', { method: 'POST', body: fd });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || 'Something went wrong');
      }
      trackEvent('intern_apply', {});
      setSuccess(true);
      reset();
      setResumeFile(null);
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
          className="text-center py-10"
        >
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-mist mb-5">
            <Check className="h-6 w-6 text-ink" strokeWidth={2} />
          </div>
          <h3 className="display-sm">Application received.</h3>
          <p className="mt-3 text-[17px] text-graphite-dark leading-[1.5]" style={{ letterSpacing: '-0.012em' }}>
            We review every application personally. We&apos;ll be in touch within a few days.
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
          encType="multipart/form-data"
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
              <input
                {...register('firstName')}
                type="text"
                autoComplete="given-name"
                placeholder="First"
                className={inputClasses}
              />
            </Field>
            <Field label="Last name" error={errors.lastName?.message}>
              <input
                {...register('lastName')}
                type="text"
                autoComplete="family-name"
                placeholder="Last"
                className={inputClasses}
              />
            </Field>
          </div>

          <Field label="Email" error={errors.email?.message}>
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={inputClasses}
            />
          </Field>

          <Field label="Phone" error={errors.phone?.message}>
            <input
              {...register('phone')}
              type="tel"
              autoComplete="tel"
              placeholder="+971 50 123 4567"
              className={inputClasses}
            />
          </Field>

          <Field label="Resume / CV (PDF)" error={resumeError ?? undefined}>
            <div
              className="relative flex items-center h-12 px-4 bg-paper border border-hairline rounded-xl cursor-pointer hover:border-accent transition-all"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-4 w-4 text-graphite-light mr-2 shrink-0" />
              <span className={`text-[17px] truncate flex-1 ${resumeFile ? 'text-ink' : 'text-graphite-light'}`}>
                {resumeFile ? resumeFile.name : 'Upload PDF (max 10 MB)'}
              </span>
              {resumeFile && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setResumeFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                  className="ml-2 shrink-0 text-graphite-light hover:text-ink transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </Field>

          <Field label="Instagram handle (optional)" error={errors.instagram?.message}>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[17px] text-graphite-light select-none">@</span>
              <input
                {...register('instagram')}
                type="text"
                placeholder="yourhandle"
                className={`${inputClasses} pl-8`}
              />
            </div>
          </Field>

          <Field label="Message (optional)" error={errors.message?.message}>
            <textarea
              {...register('message')}
              rows={4}
              placeholder="Tell us which role interests you most and why you'd be a great fit."
              className={textareaClasses}
            />
          </Field>

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
                <>Submit application <ChevronRight className="h-4 w-4" strokeWidth={2.5} /></>
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
