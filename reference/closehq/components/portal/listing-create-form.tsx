'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Check, Upload, ShieldCheck, FileText, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  listingCreateSchema,
  type ListingCreateValues,
  type ListingPath,
} from '@/lib/portal/listing-create-schema';

const input =
  'w-full h-11 px-3.5 bg-paper border border-hairline rounded-xl text-ink text-[15px] placeholder:text-graphite-light focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all';
const labelCls = 'block text-[13px] font-medium text-ink mb-1.5';
const errCls = 'text-[12px] text-journey-flag mt-1';

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
      {error && <p className={errCls}>{error}</p>}
    </div>
  );
}

export function ListingCreateForm({ path }: { path: ListingPath }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ListingCreateValues>({
    resolver: zodResolver(listingCreateSchema),
    defaultValues: {
      path,
      purpose: 'sale',
      category: 'residential',
      propertyType: 'apartment',
      completion: 'ready',
      documents: [],
      isPoa: false,
      attestOwnership: false,
      website: '',
    },
  });

  const [files, setFiles] = useState<string[]>([]);
  const [success, setSuccess] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  function onFiles(list: FileList | null) {
    if (!list) return;
    const names = Array.from(list).map((f) => f.name);
    const next = Array.from(new Set([...files, ...names]));
    setFiles(next);
    setValue('documents', next, { shouldValidate: true });
  }
  function removeFile(name: string) {
    const next = files.filter((f) => f !== name);
    setFiles(next);
    setValue('documents', next, { shouldValidate: true });
  }

  async function onSubmit(values: ListingCreateValues) {
    setServerError(null);
    try {
      const res = await fetch('/api/listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Something went wrong');
      setSuccess(data.reference as string);
    } catch (e) {
      setServerError(e instanceof Error ? e.message : 'Something went wrong');
    }
  }

  if (success) {
    return (
      <div className="card-surface p-8 text-center max-w-xl mx-auto">
        <span className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-journey-listing/15 mb-4">
          <Check className="h-7 w-7 text-journey-listing" />
        </span>
        <h2 className="display-sm">Submitted for review</h2>
        <p className="subhead mt-3">
          Your listing <strong>{success}</strong> has been received and is pending compliance review.
          We&apos;ll verify the documents and contact you before it goes live.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto space-y-8">
      {/* Property details */}
      <section className="card-surface p-6 space-y-5">
        <h2 className="text-[18px] font-semibold text-ink" style={{ letterSpacing: '-0.015em' }}>Property details</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Purpose"><select className={input} {...register('purpose')}><option value="sale">For sale</option></select></Field>
          <Field label="Completion"><select className={input} {...register('completion')}><option value="ready">Ready</option><option value="off_plan">Off-plan</option></select></Field>
          <Field label="Category"><select className={input} {...register('category')}><option value="residential">Residential</option><option value="commercial">Commercial</option></select></Field>
          <Field label="Property type"><select className={input} {...register('propertyType')}>
            <option value="apartment">Apartment</option><option value="villa">Villa</option><option value="townhouse">Townhouse</option>
            <option value="penthouse">Penthouse</option><option value="plot">Plot</option><option value="office">Office</option><option value="retail">Retail</option>
          </select></Field>
          <Field label="Community" error={errors.community?.message}><input className={input} placeholder="e.g. Dubai Marina" {...register('community')} /></Field>
          <Field label="Building (optional)"><input className={input} placeholder="e.g. Marina Gate" {...register('building')} /></Field>
          <Field label="Bedrooms" error={errors.bedrooms?.message}><input type="number" className={input} {...register('bedrooms')} /></Field>
          <Field label="Bathrooms" error={errors.bathrooms?.message}><input type="number" className={input} {...register('bathrooms')} /></Field>
          <Field label="Area (sqft)" error={errors.areaSqft?.message}><input type="number" className={input} {...register('areaSqft')} /></Field>
          <Field label="Price (AED)" error={errors.priceAed?.message}><input type="number" className={input} {...register('priceAed')} /></Field>
        </div>
        <Field label="Title" error={errors.title?.message}><input className={input} placeholder="e.g. 2-bed with marina view" {...register('title')} /></Field>
        <Field label="Description" error={errors.description?.message}>
          <textarea rows={4} className={input + ' h-auto py-2.5'} placeholder="Describe the property" {...register('description')} />
        </Field>
      </section>

      {/* Verification */}
      <section className="card-surface p-6 space-y-5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-ink" />
          <h2 className="text-[18px] font-semibold text-ink" style={{ letterSpacing: '-0.015em' }}>
            {path === 'owner' ? 'Ownership verification' : 'Broker verification'}
          </h2>
        </div>

        {path === 'owner' ? (
          <>
            <Field label="Owner name (as on the title deed)" error={errors.ownerName?.message}>
              <input className={input} {...register('ownerName')} />
            </Field>
            <label className="flex items-center gap-2.5 text-[14px] text-ink">
              <input type="checkbox" className="h-4 w-4 accent-[#0071e3]" {...register('isPoa')} />
              I am listing as Power of Attorney (POA) for the owner
            </label>
            <div>
              <Field label="Trakheesi permit no." error={errors.trakheesiPermit?.message}>
                <input className={input} placeholder="Required to advertise" {...register('trakheesiPermit')} />
              </Field>
              <p className="flex items-start gap-1.5 text-[12px] text-graphite-dark mt-2">
                <AlertTriangle className="h-3.5 w-3.5 text-journey-offplan mt-0.5 shrink-0" />
                Public advertising of a Dubai listing requires a valid Trakheesi permit. Enter your
                permit number to submit — we verify it during review before the listing goes live.
              </p>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <Field label="RERA BRN" error={errors.reraBrn?.message}><input className={input} placeholder="e.g. 12045" {...register('reraBrn')} /></Field>
            <Field label="Agency (optional)"><input className={input} {...register('agencyName')} /></Field>
            <div className="col-span-2">
              <Field label="Trakheesi permit no. (if issued)">
                <input className={input} {...register('trakheesiPermit')} />
              </Field>
              <p className="flex items-start gap-1.5 text-[12px] text-graphite-dark mt-2">
                <AlertTriangle className="h-3.5 w-3.5 text-journey-offplan mt-0.5 shrink-0" />
                Public advertising of a Dubai listing generally requires a Trakheesi permit. We verify
                this during review before the listing is published.
              </p>
            </div>
          </div>
        )}

        {/* Document upload */}
        <div>
          <label className={labelCls}>
            {path === 'owner' ? 'Proof of ownership (title deed / Oqood)' : 'Contract A (RERA Form A)'}
          </label>
          <label className="flex items-center justify-center gap-2 h-24 border border-dashed border-hairline rounded-xl text-[14px] text-graphite cursor-pointer hover:border-accent/50 transition-colors">
            <Upload className="h-4 w-4" /> Click to upload documents
            <input type="file" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
          </label>
          {files.length > 0 && (
            <ul className="mt-3 space-y-2">
              {files.map((f) => (
                <li key={f} className="flex items-center gap-2 text-[13px] text-ink bg-mist rounded-lg px-3 py-2">
                  <FileText className="h-4 w-4 text-graphite shrink-0" />
                  <span className="flex-1 truncate">{f}</span>
                  <button type="button" onClick={() => removeFile(f)} className="text-graphite hover:text-ink"><X className="h-3.5 w-3.5" /></button>
                </li>
              ))}
            </ul>
          )}
          {errors.documents && <p className={errCls}>{errors.documents.message as string}</p>}
        </div>

        {path === 'owner' && (
          <div>
            <label className="flex items-start gap-2.5 text-[14px] text-ink">
              <input type="checkbox" className="h-4 w-4 mt-0.5 accent-[#0071e3]" {...register('attestOwnership')} />
              I confirm I am the owner (or authorised POA) and the owner name above matches my Emirates ID.
              Misrepresenting ownership may result in removal and reporting.
            </label>
            {errors.attestOwnership && <p className={errCls}>{errors.attestOwnership.message as string}</p>}
          </div>
        )}

        {path === 'agent' && (
          <div>
            <label className="flex items-start gap-2.5 text-[14px] text-ink">
              <input type="checkbox" className="h-4 w-4 mt-0.5 accent-[#0071e3]" {...register('attestOwnerContact')} />
              The contact number below is the property <strong>owner&apos;s</strong>, not mine or my agency&apos;s.
              Listings with intermediary numbers are rejected to keep the database clean.
            </label>
            {errors.attestOwnerContact && <p className={errCls}>{errors.attestOwnerContact.message as string}</p>}
          </div>
        )}
      </section>

      {/* Contact */}
      <section className="card-surface p-6 space-y-5">
        <h2 className="text-[18px] font-semibold text-ink" style={{ letterSpacing: '-0.015em' }}>Your contact details</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Full name" error={errors.contactName?.message}><input className={input} {...register('contactName')} /></Field>
          <Field label="Phone" error={errors.contactPhone?.message}><input className={input} {...register('contactPhone')} /></Field>
          <div className="col-span-2">
            <Field label="Email" error={errors.contactEmail?.message}><input className={input} {...register('contactEmail')} /></Field>
          </div>
        </div>
      </section>

      {/* Honeypot */}
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden {...register('website')} />

      {serverError && <p className="text-[14px] text-journey-flag text-center">{serverError}</p>}

      <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : 'Submit for review'}
      </Button>
      <p className="text-[12px] text-graphite text-center">
        Listings are reviewed for compliance before going live. iClose never charges you commission.
      </p>
    </form>
  );
}
