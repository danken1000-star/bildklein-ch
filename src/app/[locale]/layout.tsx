import { notFound } from 'next/navigation';
import { getLocaleFromPathname, isValidLocale, getMessages } from '@/lib/i18n';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  
  if (!isValidLocale(locale)) {
    notFound();
  }
  
  const messages = getMessages(locale);

  return (
    <html lang={locale}>
      <head>
        <title>{messages.title}</title>
        <meta name="description" content={messages.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-bg-gray font-sans">
        {/* Header */}
        <header className="bg-bg-light shadow-soft border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold bg-gradient-to-r from-pink to-turquoise bg-clip-text text-transparent">
                  bildklein.ch
                </h1>
                <span className="ml-2 text-sm text-text-gray">🇨🇭</span>
              </div>
              <LanguageSwitcher currentLocale={locale} />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-bg-light border-t border-border mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-text-gray">
              <p className="text-sm">{messages.footer.madeInSwitzerland}</p>
              <div className="mt-2 space-x-4 text-xs">
                <a href="#" className="hover:text-text-dark transition-colors">{messages.footer.privacy}</a>
                <a href="#" className="hover:text-text-dark transition-colors">{messages.footer.imprint}</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
