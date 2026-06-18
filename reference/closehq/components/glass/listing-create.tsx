'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Loader2, Check, BadgeCheck, Upload } from 'lucide-react';

const TYPES = ['apartment', 'villa', 'townhouse', 'penthouse', 'plot', 'office', 'retail'];

/**
 * "List your property" — a glass-styled port of the platform's listing intake.
 * Posts to the existing /api/listing route (zod-validated, returns a pending
 * reference). Documents are captured by name; real upload is gated server-side.
 */
export function ListingCreate() {
  const router = useRouter();
  const [path, setPath] = useState<'owner' | 'agent'>('owner');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [docName, setDocName] = useState('');

  const [f, setF] = useState({
    category: 'residential',
    propertyType: 'apartment',
    completion: 'ready',
    community: '',
    building: '',
    bedrooms: '1',
    bathrooms: '1',
    areaSqft: '',
    priceAed: '',
    title: '',
    description: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    ownerName: '',
    trakheesiPermit: '',
    reraBrn: '',
    attestOwnership: false,
    attestOwnerContact: false,
  });

  function set<K extends keyof typeof f>(k: K, v: (typeof f)[K]) {
    setF((prev) => ({ ...prev, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/listing', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          path,
          purpose: 'sale',
          ...f,
          documents: docName ? [docName] : [],
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const issues = data?.issues
          ? Object.values(data.issues).flat().join(' · ')
          : data?.error;
        throw new Error(issues || 'Could not submit listing');
      }
      setDone(data.reference as string);
    } catch (e2) {
      setError(e2 instanceof Error ? e2.message : 'Could not submit listing');
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="flex h-[100svh] flex-col items-center justify-center bg-paper px-8 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-journey-listing/15">
          <Check className="h-8 w-8 text-journey-listing" />
        </span>
        <h1 className="mt-5 text-[22px] font-semibold tracking-tight text-ink">Listing submitted</h1>
        <p className="mt-2 max-w-xs text-[15px] text-graphite">
          Reference <span className="font-semibold text-ink">{done}</span> — it&rsquo;s in compliance
          review (RERA / Trakheesi checks). We&rsquo;ll notify you once it&rsquo;s live.
        </p>
        <Link href="/experience/profile" className="mt-6 rounded-full bg-ink px-6 py-3 text-[15px] font-semibold text-white">
          Back to profile
        </Link>
      </div>
    );
  }

  return (
    <div className="no-scrollbar h-[100svh] overflow-y-scroll bg-mist pb-12">
      <header className="sticky top-0 z-10 bg-paper/85 px-4 pb-3 pt-[max(16px,env(safe-area-inset-top))] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-mist text-ink active:scale-90"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-[20px] font-semibold tracking-tight text-ink">List your property</h1>
        </div>
        <p className="mt-1.5 flex items-center gap-1.5 text-[12.5px] text-graphite">
          <BadgeCheck className="h-4 w-4 text-journey-listing" /> Commission-free · sell direct to buyers
        </p>
      </header>

      <form onSubmit={submit} className="space-y-4 px-4 pt-4">
        {/* Path */}
        <Toggle
          value={path}
          onChange={setPath}
          options={[
            { v: 'owner', label: 'I own it' },
            { v: 'agent', label: "I'm a RERA agent" },
          ]}
        />

        <Card title="Property">
          <Row>
            <Select label="Type" value={f.propertyType} onChange={(v) => set('propertyType', v)} options={TYPES} />
            <Select label="Status" value={f.completion} onChange={(v) => set('completion', v)} options={['ready', 'off_plan']} display={(v) => (v === 'off_plan' ? 'Off-plan' : 'Ready')} />
          </Row>
          <Row>
            <Select label="Category" value={f.category} onChange={(v) => set('category', v)} options={['residential', 'commercial']} />
            <Input label="Community" value={f.community} onChange={(v) => set('community', v)} placeholder="e.g. Dubai Marina" />
          </Row>
          <Input label="Building (optional)" value={f.building} onChange={(v) => set('building', v)} placeholder="Tower / project" />
          <Row>
            <Input label="Beds" type="number" value={f.bedrooms} onChange={(v) => set('bedrooms', v)} />
            <Input label="Baths" type="number" value={f.bathrooms} onChange={(v) => set('bathrooms', v)} />
          </Row>
          <Row>
            <Input label="Area (sqft)" type="number" value={f.areaSqft} onChange={(v) => set('areaSqft', v)} placeholder="1200" />
            <Input label="Price (AED)" type="number" value={f.priceAed} onChange={(v) => set('priceAed', v)} placeholder="1500000" />
          </Row>
        </Card>

        <Card title="Listing">
          <Input label="Title" value={f.title} onChange={(v) => set('title', v)} placeholder="Bright 2-bed with marina view" />
          <Textarea label="Description" value={f.description} onChange={(v) => set('description', v)} placeholder="Describe the home, the view, what makes it special…" />
        </Card>

        <Card title="Your contact">
          <Input label="Name" value={f.contactName} onChange={(v) => set('contactName', v)} />
          <Row>
            <Input label="Phone" value={f.contactPhone} onChange={(v) => set('contactPhone', v)} placeholder="+971…" />
            <Input label="Email" type="email" value={f.contactEmail} onChange={(v) => set('contactEmail', v)} />
          </Row>
        </Card>

        <Card title="Verification">
          {path === 'owner' ? (
            <>
              <Input label="Owner name (as on title deed)" value={f.ownerName} onChange={(v) => set('ownerName', v)} />
              <Input label="Trakheesi permit no." value={f.trakheesiPermit} onChange={(v) => set('trakheesiPermit', v)} />
              <DocUpload value={docName} onChange={setDocName} hint="Title deed or Oqood" />
              <Checkbox checked={f.attestOwnership} onChange={(v) => set('attestOwnership', v)}>
                I confirm I own this property or hold a valid Power of Attorney.
              </Checkbox>
            </>
          ) : (
            <>
              <Input label="RERA BRN" value={f.reraBrn} onChange={(v) => set('reraBrn', v)} />
              <DocUpload value={docName} onChange={setDocName} hint="Contract A (RERA Form A)" />
              <Checkbox checked={f.attestOwnerContact} onChange={(v) => set('attestOwnerContact', v)}>
                The contact number provided is the owner&rsquo;s, not mine.
              </Checkbox>
            </>
          )}
        </Card>

        {error && <p className="px-1 text-[13px] text-rose-500">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-[15px] font-semibold text-white active:scale-[0.99] disabled:opacity-60"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          Submit for review
        </button>
        <p className="px-1 pb-2 text-center text-[12px] text-graphite-light">
          Listings are reviewed for RERA / Trakheesi compliance before going live.
        </p>
      </form>
    </div>
  );
}

function Toggle<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { v: T; label: string }[];
}) {
  return (
    <div className="flex gap-1 rounded-full bg-paper p-1">
      {options.map((o) => (
        <button
          key={o.v}
          type="button"
          onClick={() => onChange(o.v)}
          className={`flex-1 rounded-full py-2.5 text-[14px] font-medium transition-colors ${
            value === o.v ? 'bg-ink text-white' : 'text-graphite-dark'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2.5 rounded-[22px] bg-paper p-4">
      <h2 className="text-[13px] font-semibold uppercase tracking-wide text-graphite">{title}</h2>
      {children}
    </section>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-2.5">{children}</div>;
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] text-graphite">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl bg-mist px-3.5 text-[15px] text-ink outline-none placeholder:text-graphite-light focus:ring-2 focus:ring-accent/25"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] text-graphite">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full resize-none rounded-xl bg-mist px-3.5 py-2.5 text-[15px] text-ink outline-none placeholder:text-graphite-light focus:ring-2 focus:ring-accent/25"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  display,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  display?: (v: string) => string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] text-graphite">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl bg-mist px-3 text-[15px] capitalize text-ink outline-none focus:ring-2 focus:ring-accent/25"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {display ? display(o) : o}
          </option>
        ))}
      </select>
    </label>
  );
}

function DocUpload({
  value,
  onChange,
  hint,
}: {
  value: string;
  onChange: (v: string) => void;
  hint: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-hairline bg-mist px-3.5 py-3 text-[14px] text-graphite-dark">
      <Upload className="h-5 w-5 text-accent" />
      <span className="flex-1 truncate">{value || `Upload ${hint}`}</span>
      <input
        type="file"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0]?.name ?? '')}
      />
      <span className="text-[12px] font-medium text-accent">Browse</span>
    </label>
  );
}

function Checkbox({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-start gap-3 text-left"
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
          checked ? 'border-ink bg-ink text-white' : 'border-hairline bg-paper'
        }`}
      >
        {checked && <Check className="h-3.5 w-3.5" />}
      </span>
      <span className="text-[13px] leading-snug text-graphite-dark">{children}</span>
    </button>
  );
}
