import { getMessages, Locale } from '@/lib/i18n';
import LandingPageClient from './LandingPageClient';

interface MainPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

export default async function MainPage({ params }: MainPageProps) {
  const { locale } = await params;
  const messages = await getMessages(locale);

  return <LandingPageClient messages={messages} locale={locale} />;
}
