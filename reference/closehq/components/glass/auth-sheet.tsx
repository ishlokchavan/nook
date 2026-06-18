'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Loader2, Mail, Lock, User as UserIcon, Check } from 'lucide-react';

/**
 * Glass-styled auth for the experience — same Supabase Auth as the main
 * platform, so a session signed in here is persistent and shared everywhere.
 */
export function AuthSheet() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { supabase } = await import('@/lib/supabase');
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/experience/profile');
        router.refresh();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (error) throw error;
        if (data.session) {
          router.push('/experience/profile');
          router.refresh();
        } else {
          setCheckEmail(true);
        }
      }
    } catch (e2) {
      setError(e2 instanceof Error ? e2.message : 'Authentication failed');
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setError(null);
    try {
      const { supabase } = await import('@/lib/supabase');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo:
            typeof window !== 'undefined'
              ? `${window.location.origin}/experience/profile`
              : undefined,
        },
      });
      if (error) throw error;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Google sign-in failed');
    }
  }

  if (checkEmail) {
    return (
      <div className="flex h-[100svh] flex-col items-center justify-center bg-paper px-8 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-journey-listing/15">
          <Check className="h-8 w-8 text-journey-listing" />
        </span>
        <h1 className="mt-5 text-[22px] font-semibold tracking-tight text-ink">Check your email</h1>
        <p className="mt-2 max-w-xs text-[15px] text-graphite">
          We sent a confirmation link to <span className="font-medium text-ink">{email}</span>. Tap it to
          finish creating your account.
        </p>
        <Link href="/experience" className="mt-6 rounded-full bg-ink px-6 py-3 text-[15px] font-semibold text-white">
          Back to discover
        </Link>
      </div>
    );
  }

  return (
    <div className="no-scrollbar h-[100svh] overflow-y-scroll bg-paper px-5 pb-10 pt-[max(16px,env(safe-area-inset-top))]">
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Back"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-mist text-ink active:scale-90"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <div className="mt-6">
        <h1 className="text-[28px] font-semibold tracking-tight text-ink">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="mt-1.5 text-[15px] text-graphite">
          {mode === 'login'
            ? 'Sign in to sync your shortlist, credits and deals.'
            : 'Save homes, earn credits, and start your deal — commission-free.'}
        </p>
      </div>

      <button
        type="button"
        onClick={google}
        className="mt-6 flex h-12 w-full items-center justify-center gap-2.5 rounded-full border border-hairline bg-paper text-[15px] font-medium text-ink active:scale-[0.99]"
      >
        <GoogleMark /> Continue with Google
      </button>

      <div className="my-5 flex items-center gap-3 text-[12px] text-graphite-light">
        <span className="h-px flex-1 bg-hairline" /> or <span className="h-px flex-1 bg-hairline" />
      </div>

      <form onSubmit={submit} className="space-y-3">
        {mode === 'signup' && (
          <Field icon={<UserIcon className="h-[18px] w-[18px]" />}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-graphite-light"
            />
          </Field>
        )}
        <Field icon={<Mail className="h-[18px] w-[18px]" />}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-graphite-light"
          />
        </Field>
        <Field icon={<Lock className="h-[18px] w-[18px]" />}>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-graphite-light"
          />
        </Field>

        {error && <p className="text-[13px] text-rose-500">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-[15px] font-semibold text-white active:scale-[0.99] disabled:opacity-60"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === 'login' ? 'Sign in' : 'Create account'}
        </button>
      </form>

      <p className="mt-5 text-center text-[14px] text-graphite">
        {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button
          type="button"
          onClick={() => {
            setMode(mode === 'login' ? 'signup' : 'login');
            setError(null);
          }}
          className="font-semibold text-accent"
        >
          {mode === 'login' ? 'Sign up' : 'Sign in'}
        </button>
      </p>
    </div>
  );
}

function Field({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="flex h-12 items-center gap-2.5 rounded-2xl bg-mist px-4 text-graphite">
      {icon}
      {children}
    </label>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.46 14.97.5 12 .5A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 6.68 9.14 4.75 12 4.75Z" />
    </svg>
  );
}
