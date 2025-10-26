import { notFound } from 'next/navigation';

export const locales = ['de', 'fr', 'it', 'en'] as const;
export type Locale = typeof locales[number];

export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split('/');
  const locale = segments[1];
  
  if (locales.includes(locale as Locale)) {
    return locale as Locale;
  }
  
  return 'de'; // Default to German
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function getMessages(locale: Locale) {
  try {
    return require(`../../public/locales/${locale}.json`);
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`);
    return require('../../public/locales/de.json');
  }
}
