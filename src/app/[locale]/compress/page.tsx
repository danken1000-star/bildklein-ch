import { getMessages, Locale } from '@/lib/i18n';
import MainPageClient from '../MainPageClient';

interface CompressPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

export default async function CompressPage({ params }: CompressPageProps) {
  const { locale } = await params;
  const messages = getMessages(locale);

  return <MainPageClient messages={messages} />;
}

