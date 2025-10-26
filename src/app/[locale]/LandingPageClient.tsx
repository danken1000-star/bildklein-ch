'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Shield, Zap, Heart, Flag } from 'lucide-react';
import { Locale } from '@/lib/i18n';
import Uploader from '@/components/Uploader';

interface LandingPageClientProps {
  messages: any;
  locale: Locale;
}

export default function LandingPageClient({ messages, locale }: LandingPageClientProps) {
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    // Navigate to compression page with files
    router.push(`/${locale}/compress`);
  };

  const features = [
    {
      icon: Shield,
      title: "100% Privat",
      description: "Bilder bleiben auf deinem Gerät",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Zap,
      title: "Blitzschnell", 
      description: "Komprimierung im Browser",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Heart,
      title: "Swiss Quality",
      description: "Made in Switzerland",
      color: "from-pink-500 to-pink-600"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl font-bold text-text-dark mb-6">
            Bilder kostenlos{' '}
            <span className="bg-gradient-to-r from-pink to-turquoise bg-clip-text text-transparent">
              verkleinern
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-text-gray mb-8 max-w-2xl mx-auto">
            Schnell, sicher, Swiss-made
          </p>

          {/* Upload Area */}
          <div className="max-w-2xl mx-auto mb-8">
            <Uploader
              onFilesSelected={handleFilesSelected}
              messages={messages.upload}
              showPreviews={false}
              maxFiles={5}
            />
          </div>

          {/* Trust Message */}
          <p className="text-sm text-text-gray">
            Keine Registrierung. Keine Limits. 100% kostenlos.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-bg-light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-dark mb-4">
              Warum bildklein.ch?
            </h2>
            <p className="text-lg text-text-gray max-w-2xl mx-auto">
              Die beste Lösung für Bildkomprimierung - entwickelt in der Schweiz
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-2xl bg-bg-light border border-border shadow-soft hover:shadow-soft-lg transition-all duration-300"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-text-dark mb-3">
                  {feature.title}
                </h3>
                <p className="text-text-gray">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-pink-50 to-turquoise-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-text-dark mb-6">
            Bereit zum Starten?
          </h2>
          <p className="text-lg text-text-gray mb-8 max-w-2xl mx-auto">
            Lade deine Bilder hoch und erlebe die schnellste Bildkomprimierung der Schweiz
          </p>
          <div className="max-w-xl mx-auto">
            <Uploader
              onFilesSelected={handleFilesSelected}
              messages={messages.upload}
              showPreviews={false}
              maxFiles={5}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-text-dark text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Flag className="w-6 h-6 mr-2" />
              <span className="text-lg font-semibold">
                Made in Switzerland 🇨🇭 by{' '}
                <a 
                  href="https://flow19.ch" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-turquoise hover:text-turquoise-300 transition-colors"
                >
                  flow19.ch
                </a>
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">Sprache:</span>
              <div className="flex space-x-2">
                {[
                  { code: 'de', flag: '🇩🇪', name: 'DE' },
                  { code: 'fr', flag: '🇫🇷', name: 'FR' },
                  { code: 'it', flag: '🇮🇹', name: 'IT' },
                  { code: 'en', flag: '🇬🇧', name: 'EN' }
                ].map((lang) => (
                  <a
                    key={lang.code}
                    href={`/${lang.code}`}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      locale === lang.code
                        ? 'bg-turquoise text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    {lang.flag} {lang.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p className="text-sm text-gray-400">
              © 2025 bildklein.ch - Alle Rechte vorbehalten
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
