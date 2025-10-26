import { getMessages, Locale } from '@/lib/i18n';
import MainPageClient from './MainPageClient';

interface MainPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

export default async function MainPage({ params }: MainPageProps) {
  const { locale } = await params;
  const messages = getMessages(locale);

  return <MainPageClient messages={messages} />;
}
