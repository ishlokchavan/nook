'use client';

import { useRef, useState } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { internSchema, type InternFormValues } from '@/lib/validations';
import styles from './iclose-landing.module.css';

export function CareersForm() {
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
  const [showValidationBanner, setShowValidationBanner] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const onInvalid = (errs: FieldErrors<InternFormValues>) => {
    setShowValidationBanner(true);
    const firstKey = Object.keys(errs)[0];
    if (!firstKey || !formRef.current) return;
    const el = formRef.current.querySelector<HTMLElement>(
      `[name="${firstKey}"]`,
    );
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const focusable = el as HTMLInputElement;
      if (typeof focusable.focus === 'function') {
        setTimeout(() => focusable.focus({ preventScroll: true }), 250);
      }
    }
  };

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
    setShowValidationBanner(false);

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
      setSuccess(true);
      reset();
      setResumeFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.',
      );
    }
  };

  if (success) {
    return (
      <div className={styles.success}>
        <div className={styles.successBadge} aria-hidden="true">
          ✓
        </div>
        <h3 className={styles.successTitle}>Application received.</h3>
        <p className={styles.successBody}>
          We review every application personally. We&apos;ll be in touch within
          a few days.
        </p>
      </div>
    );
  }

  const inputErrCls = (hasErr: boolean) =>
    hasErr ? styles.fieldInputError : undefined;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className={styles.wlFormFull}
      noValidate
      encType="multipart/form-data"
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

      {showValidationBanner && Object.keys(errors).length > 0 && (
        <p className={styles.serverError} role="alert">
          Please fix the highlighted fields below before submitting.
        </p>
      )}

      <div className={styles.formRow}>
        <div className={styles.field}>
          <div className={styles.fieldLabel}>
            <label htmlFor="cf-first">First name</label>
            {errors.firstName && (
              <span className={styles.fieldError}>
                {errors.firstName.message}
              </span>
            )}
          </div>
          <input
            id="cf-first"
            type="text"
            autoComplete="given-name"
            placeholder="First"
            className={inputErrCls(Boolean(errors.firstName))}
            {...register('firstName')}
          />
        </div>
        <div className={styles.field}>
          <div className={styles.fieldLabel}>
            <label htmlFor="cf-last">Last name</label>
            {errors.lastName && (
              <span className={styles.fieldError}>
                {errors.lastName.message}
              </span>
            )}
          </div>
          <input
            id="cf-last"
            type="text"
            autoComplete="family-name"
            placeholder="Last"
            className={inputErrCls(Boolean(errors.lastName))}
            {...register('lastName')}
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.field}>
          <div className={styles.fieldLabel}>
            <label htmlFor="cf-email">Email</label>
            {errors.email && (
              <span className={styles.fieldError}>{errors.email.message}</span>
            )}
          </div>
          <input
            id="cf-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={inputErrCls(Boolean(errors.email))}
            {...register('email')}
          />
        </div>
        <div className={styles.field}>
          <div className={styles.fieldLabel}>
            <label htmlFor="cf-phone">Phone</label>
            {errors.phone && (
              <span className={styles.fieldError}>{errors.phone.message}</span>
            )}
          </div>
          <input
            id="cf-phone"
            type="tel"
            autoComplete="tel"
            placeholder="+971 50 123 4567"
            className={inputErrCls(Boolean(errors.phone))}
            {...register('phone')}
          />
        </div>
      </div>

      <div className={styles.field}>
        <div className={styles.fieldLabel}>
          <label htmlFor="cf-resume">Resume / CV (PDF, optional)</label>
          {resumeError && (
            <span className={styles.fieldError}>{resumeError}</span>
          )}
        </div>
        <div
          className={styles.fileInput}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
        >
          <svg className={styles.fileInputIcon} viewBox="0 0 24 24">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
          <span
            className={`${styles.fileInputLabel} ${resumeFile ? styles.fileInputLabelFilled : ''}`}
          >
            {resumeFile ? resumeFile.name : 'Upload PDF (max 10 MB)'}
          </span>
          {resumeFile && (
            <button
              type="button"
              className={styles.fileInputClear}
              onClick={(e) => {
                e.stopPropagation();
                setResumeFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              aria-label="Remove file"
            >
              ×
            </button>
          )}
          <input
            id="cf-resume"
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      <div className={styles.field}>
        <div className={styles.fieldLabel}>
          <label htmlFor="cf-ig">Instagram handle (optional)</label>
          {errors.instagram && (
            <span className={styles.fieldError}>
              {errors.instagram.message}
            </span>
          )}
        </div>
        <div className={styles.fieldPrefix}>
          <span className={styles.prefix}>@</span>
          <input
            id="cf-ig"
            type="text"
            placeholder="yourhandle"
            className={inputErrCls(Boolean(errors.instagram))}
            {...register('instagram')}
          />
        </div>
      </div>

      <div className={styles.field}>
        <div className={styles.fieldLabel}>
          <label htmlFor="cf-message">Message (optional)</label>
          {errors.message && (
            <span className={styles.fieldError}>{errors.message.message}</span>
          )}
        </div>
        <textarea
          id="cf-message"
          rows={4}
          placeholder="Tell us which role interests you most and why you'd be a great fit."
          className={inputErrCls(Boolean(errors.message))}
          {...register('message')}
        />
      </div>

      {serverError && <p className={styles.serverError}>{serverError}</p>}

      <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
        {isSubmitting ? 'Sending…' : 'Submit application'}
      </button>
    </form>
  );
}
