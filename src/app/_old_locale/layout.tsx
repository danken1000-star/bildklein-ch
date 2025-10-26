import { Inter } from 'next/font/google';
import '../globals.css';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ToastProvider from '@/components/ToastProvider';
import BrowserSupportCheck from '@/components/BrowserSupportCheck';
import OfflineIndicator from '@/components/OfflineIndicator';
import ErrorBoundary from '@/components/ErrorBoundary';
import { getMessages, getLocaleFromPathname, isValidLocale } from '@/lib/i18n';
import { notFound } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  if (!isValidLocale(locale)) {
    notFound();
  }
  
  const messages = await getMessages(locale);
  
  return {
    title: messages.seo?.title || 'bildklein.ch - Bilder kostenlos verkleinern',
    description: messages.seo?.description || 'Komprimiere JPG, PNG, WebP Bilder kostenlos online. 100% sicher, keine Registrierung. Made in Switzerland.',
    keywords: messages.seo?.keywords || 'bilder verkleinern, bilder komprimieren, image compression, swiss, kostenlos, online',
    authors: [{ name: 'Flow19' }],
    creator: 'Flow19',
    publisher: 'bildklein.ch',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: locale,
      url: `https://bildklein.ch/${locale}`,
      title: messages.seo?.title || 'bildklein.ch - Bilder kostenlos verkleinern',
      description: messages.seo?.description || 'Komprimiere JPG, PNG, WebP Bilder kostenlos online. 100% sicher, keine Registrierung. Made in Switzerland.',
      siteName: 'bildklein.ch',
      images: [
        {
          url: 'https://bildklein.ch/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'bildklein.ch - Bilder kostenlos verkleinern',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: messages.seo?.title || 'bildklein.ch - Bilder kostenlos verkleinern',
      description: messages.seo?.description || 'Komprimiere JPG, PNG, WebP Bilder kostenlos online. 100% sicher, keine Registrierung. Made in Switzerland.',
      images: ['https://bildklein.ch/og-image.jpg'],
    },
    alternates: {
      canonical: `https://bildklein.ch/${locale}`,
      languages: {
        'de': 'https://bildklein.ch/de',
        'fr': 'https://bildklein.ch/fr',
        'it': 'https://bildklein.ch/it',
        'en': 'https://bildklein.ch/en',
      },
    },
    verification: {
      google: 'your-google-verification-code',
    },
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  if (!isValidLocale(locale)) {
    notFound();
  }

  const messages = await getMessages(locale);

  // Structured Data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "bildklein.ch",
    "description": messages.seo?.description || 'Komprimiere JPG, PNG, WebP Bilder kostenlos online. 100% sicher, keine Registrierung. Made in Switzerland.',
    "url": `https://bildklein.ch/${locale}`,
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "CHF"
    },
    "creator": {
      "@type": "Organization",
      "name": "Flow19",
      "url": "https://flow19.ch"
    },
    "inLanguage": locale,
    "isAccessibleForFree": true,
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "softwareVersion": "1.0",
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString().split('T')[0],
  };

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#FF6B9D" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={inter.className}>
        <ToastProvider />
        <BrowserSupportCheck />
        <OfflineIndicator />
        <ErrorBoundary>
          <div className="min-h-screen bg-gradient-to-br from-bg-light to-bg-gray">
            {/* Header */}
            <header className="bg-bg-light border-b border-border shadow-soft">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-2">
                  <a href={`/${locale}`} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 bg-gradient-to-r from-pink to-turquoise rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">B</span>
                    </div>
                    <span className="text-xl font-bold text-text-dark">bildklein.ch</span>
                  </a>
                </div>
                <LanguageSwitcher messages={messages} />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-bg-light border-t border-border lg:sticky lg:bottom-0 lg:z-10 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-6">
              <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
                {/* Logo & Tagline */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-pink to-turquoise rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">B</span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-base lg:text-lg font-bold text-text-dark">bildklein.ch</span>
                      <span className="text-xl">🇨🇭</span>
                    </div>
                    <p className="text-xs text-text-gray">Made in Switzerland</p>
                  </div>
                </div>

                {/* Social Proof - Hidden on mobile */}
                <div className="hidden lg:block text-center">
                  <p className="text-sm text-text-gray">
                    <span className="font-semibold text-turquoise-600">∞</span> Bilder komprimiert heute
                  </p>
                </div>

                {/* CTA Link */}
                <div className="flex items-center space-x-4">
                  <a 
                    href="https://flow19.ch" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs lg:text-sm font-medium text-text-gray hover:text-turquoise-600 transition-colors flex items-center space-x-2"
                  >
                    <span>Built by</span>
                    <span className="font-bold bg-gradient-to-r from-pink to-turquoise bg-clip-text text-transparent">
                      flow19
                    </span>
                    <span className="text-xs">→</span>
                  </a>
                </div>
              </div>

              {/* Legal Links */}
              <div className="mt-6 pt-4 border-t border-border flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 sm:gap-6 text-xs text-text-gray">
                  <a href={`/${locale}/impressum`} className="hover:text-turquoise-600 transition-colors whitespace-nowrap">
                    Impressum
                  </a>
                  <span className="hidden sm:inline text-text-gray">•</span>
                  <a href={`/${locale}/datenschutz`} className="hover:text-turquoise-600 transition-colors whitespace-nowrap">
                    Datenschutz
                  </a>
                  <span className="hidden sm:inline text-text-gray">•</span>
                  <span className="whitespace-nowrap">&copy; 2024 bildklein.ch</span>
                </div>
                <div className="text-xs text-text-gray whitespace-nowrap">
                  Bern, Switzerland
                </div>
              </div>
            </div>
          </footer>
          </div>
        </ErrorBoundary>
      </body>
    </html>
  );
}