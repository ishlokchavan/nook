'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const input =
  'w-full h-11 px-3.5 bg-paper border border-hairline rounded-xl text-ink text-[15px] placeholder:text-graphite-light focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all';

const socialBtn =
  'w-full h-11 inline-flex items-center justify-center gap-2.5 rounded-xl border border-hairline text-[14px] text-ink hover:bg-mist transition-colors';

interface AuthValues {
  name?: string;
  email: string;
  password: string;
}

type Provider = 'google';

/** Email/password + social auth wired to Supabase Auth. */
export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthValues>({ defaultValues: { name: '', email: '', password: '' } });
  const [serverError, setServerError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);

  async function onSubmit(values: AuthValues) {
    setServerError(null);
    try {
      const { supabase } = await import('@/lib/supabase');
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email: values.email, password: values.password });
        if (error) throw error;
        router.push('/');
        router.refresh();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: { data: { full_name: values.name } },
        });
        if (error) throw error;
        if (data.session) {
          router.push('/');
          router.refresh();
        } else {
          setCheckEmail(true);
        }
      }
    } catch (e) {
      setServerError(e instanceof Error ? e.message : 'Authentication failed');
    }
  }

  async function onSocial(provider: Provider) {
    setServerError(null);
    try {
      const { supabase } = await import('@/lib/supabase');
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : undefined },
      });
      if (error) throw error;
    } catch (e) {
      setServerError(e instanceof Error ? e.message : `Could not continue with ${provider}`);
    }
  }

  if (checkEmail) {
    return (
      <div className="card-surface p-8 text-center w-full max-w-[440px] mx-auto">
        <span className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-journey-listing/15 mb-4">
          <Check className="h-7 w-7 text-journey-listing" />
        </span>
        <h2 className="display-sm">Check your email</h2>
        <p className="subhead mt-3">We sent a confirmation link to finish creating your account.</p>
      </div>
    );
  }

  return (
    <div className="card-surface p-8 w-full max-w-[440px] mx-auto">
      <h1 className="display-sm text-center">{mode === 'login' ? 'Log in' : 'Sign up'}</h1>
      <p className="text-center text-[14px] text-graphite mt-2">
        {mode === 'login' ? (
          <>Don&apos;t have an account? <Link href="/signup" className="text-accent hover:underline">Sign Up</Link></>
        ) : (
          <>Already have an account? <Link href="/login" className="text-accent hover:underline">Log in</Link></>
        )}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-3">
        {mode === 'signup' && (
          <div>
            <input className={input} placeholder="Full name" {...register('name', { required: 'Enter your name' })} />
            {errors.name && <p className="text-[12px] text-journey-flag mt-1">{errors.name.message}</p>}
          </div>
        )}
        <div>
          <input type="email" className={input} placeholder="Email" {...register('email', { required: 'Enter your email' })} />
          {errors.email && <p className="text-[12px] text-journey-flag mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <input type="password" className={input} placeholder="Password" {...register('password', { required: 'Enter your password', minLength: { value: 6, message: 'At least 6 characters' } })} />
          {errors.password && <p className="text-[12px] text-journey-flag mt-1">{errors.password.message}</p>}
        </div>

        {serverError && <p className="text-[13px] text-journey-flag">{serverError}</p>}

        <Button type="submit" variant="primary" size="md" disabled={isSubmitting} className="w-full">
          {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Please wait…</> : 'Continue with Email'}
        </Button>
      </form>

      {/* or divider */}
      <div className="flex items-center gap-3 my-5">
        <span className="h-px flex-1 bg-hairline" />
        <span className="text-[13px] text-graphite">or</span>
        <span className="h-px flex-1 bg-hairline" />
      </div>

      <div className="space-y-2.5">
        <button type="button" onClick={() => onSocial('google')} className={socialBtn}><GoogleIcon /> Continue with Google</button>
      </div>

      <p className="text-center text-[12px] text-graphite mt-6 pt-5 border-t border-hairline/60">
        <Link href="/terms" className="hover:underline">Terms of Use</Link>
        <span className="mx-2">·</span>
        <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
    </svg>
  );
}
