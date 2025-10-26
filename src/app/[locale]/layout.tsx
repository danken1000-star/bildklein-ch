import { Inter } from 'next/font/google';
import '../globals.css';
import LanguageSwitcher from '@/components/LanguageSwitcher';
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
          <footer className="bg-bg-light border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-text-dark mb-4">bildklein.ch</h3>
                  <p className="text-sm text-text-gray">
                    {messages.footer?.made || 'Made in Switzerland 🇨🇭 by'}{' '}
                    <a 
                      href="https://flow19.ch" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-turquoise-600 hover:text-turquoise-700 font-medium"
                    >
                      Flow19
                    </a>
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-text-dark mb-3">Rechtliches</h4>
                  <div className="space-y-2">
                    <a href={`/${locale}/privacy`} className="block text-sm text-text-gray hover:text-turquoise-600 transition-colors">
                      {messages.footer?.privacy || 'Datenschutz'}
                    </a>
                    <a href={`/${locale}/terms`} className="block text-sm text-text-gray hover:text-turquoise-600 transition-colors">
                      {messages.footer?.terms || 'AGB'}
                    </a>
                    <a href={`/${locale}/contact`} className="block text-sm text-text-gray hover:text-turquoise-600 transition-colors">
                      {messages.footer?.contact || 'Kontakt'}
                    </a>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-text-dark mb-3">Features</h4>
                  <ul className="text-sm text-text-gray space-y-1">
                    <li>100% Privat & Sicher</li>
                    <li>Keine Registrierung</li>
                    <li>Alle Formate: JPG, PNG, WebP</li>
                    <li>Swiss-made Quality</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-border text-center text-sm text-text-gray">
                <p>&copy; 2024 bildklein.ch. Alle Rechte vorbehalten.</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}