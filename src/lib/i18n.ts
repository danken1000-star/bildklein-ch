export const locales = ['de', 'fr', 'it', 'en'] as const;
export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'de';

export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split('/');
  const locale = segments[1] as Locale;
  
  if (locales.includes(locale)) {
    return locale;
  }
  
  return defaultLocale;
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export async function getMessages(locale: Locale) {
  try {
    const messages = await import(`../../public/locales/${locale}.json`);
    return messages.default;
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}:`, error);
    const fallback = await import(`../../public/locales/${defaultLocale}.json`);
    return fallback.default;
  }
}
