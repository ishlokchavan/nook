/** Supported locales. Arabic drives full RTL. 'en' is the fallback. */
export const LOCALES = [
  { code: 'en', label: 'English', dir: 'ltr' as const },
  { code: 'ru', label: 'Русский', dir: 'ltr' as const },
  { code: 'ar', label: 'العربية', dir: 'rtl' as const },
  { code: 'zh', label: '中文', dir: 'ltr' as const },
  { code: 'hi', label: 'हिन्दी', dir: 'ltr' as const },
] as const;

export type LocaleCode = (typeof LOCALES)[number]['code'];

export const DEFAULT_LOCALE: LocaleCode = 'en';

/** Cookie that persists the visitor's locale choice. */
export const LOCALE_COOKIE = 'NEXT_LOCALE';

export function isLocale(value: string | undefined | null): value is LocaleCode {
  return !!value && LOCALES.some((l) => l.code === value);
}

export function dirFor(code: LocaleCode): 'ltr' | 'rtl' {
  return LOCALES.find((l) => l.code === code)?.dir ?? 'ltr';
}
