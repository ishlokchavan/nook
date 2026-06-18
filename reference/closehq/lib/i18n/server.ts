import { cookies } from 'next/headers';
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type LocaleCode } from './config';
import { getMessages } from './dictionaries';

/** Read the active locale from the cookie (server components only). */
export async function getLocale(): Promise<LocaleCode> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** Active locale + its messages, for server components. */
export async function getI18n() {
  const locale = await getLocale();
  return { locale, messages: getMessages(locale) };
}
