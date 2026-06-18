'use client';

import { createContext, useContext, useCallback } from 'react';
import type { Messages } from '@/lib/i18n/dictionaries';
import { LOCALE_COOKIE, type LocaleCode } from '@/lib/i18n/config';

interface LocaleContextValue {
  locale: LocaleCode;
  messages: Messages;
  setLocale: (code: LocaleCode) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  messages,
  children,
}: {
  locale: LocaleCode;
  messages: Messages;
  children: React.ReactNode;
}) {
  const setLocale = useCallback((code: LocaleCode) => {
    // Persist for ~1 year; full reload so server components + <html dir> update.
    document.cookie = `${LOCALE_COOKIE}=${code}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    window.location.reload();
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, messages, setLocale }}>{children}</LocaleContext.Provider>
  );
}

/** Access messages + locale inside client components. */
export function useI18n(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useI18n must be used within a LocaleProvider');
  return ctx;
}
