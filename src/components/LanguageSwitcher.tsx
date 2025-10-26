'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

interface LanguageSwitcherProps {
  messages: {
    language: {
      de: string;
      fr: string;
      it: string;
      en: string;
    };
  };
}

const languages = [
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'en', name: 'English', flag: '🇬🇧' }
];

export default function LanguageSwitcher({ messages }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState('de');
  const router = useRouter();
  const pathname = usePathname();

  // Initialize locale from URL or localStorage
  useEffect(() => {
    const urlLocale = pathname.split('/')[1];
    const savedLocale = localStorage.getItem('bildklein-locale');
    
    if (urlLocale && languages.some(lang => lang.code === urlLocale)) {
      setCurrentLocale(urlLocale);
      if (savedLocale !== urlLocale) {
        localStorage.setItem('bildklein-locale', urlLocale);
      }
    } else if (savedLocale && languages.some(lang => lang.code === savedLocale)) {
      setCurrentLocale(savedLocale);
      // Redirect to saved locale if URL doesn't have valid locale
      if (!urlLocale || !languages.some(lang => lang.code === urlLocale)) {
        const newPath = pathname.replace(/^\/[^\/]*/, `/${savedLocale}`);
        router.replace(newPath);
      }
    }
  }, [pathname, router]);

  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

  const handleLanguageChange = (locale: string) => {
    // Save to localStorage
    localStorage.setItem('bildklein-locale', locale);
    
    // Update URL
    const newPath = pathname.replace(/^\/[^\/]*/, `/${locale}`);
    router.push(newPath);
    
    setCurrentLocale(locale);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.language-switcher')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative language-switcher">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-bg-gray text-text-gray rounded-lg hover:bg-border hover:text-text-dark transition-colors duration-200"
        aria-label="Change language"
      >
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="text-sm font-medium">{currentLanguage.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-bg-light border border-border rounded-lg shadow-soft z-50">
          <div className="py-2">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-bg-gray transition-colors duration-200 ${
                  currentLocale === language.code ? 'bg-turquoise-50 text-turquoise-700' : 'text-text-dark'
                }`}
              >
                <span className="text-lg">{language.flag}</span>
                <span className="text-sm font-medium">{language.name}</span>
                {currentLocale === language.code && (
                  <span className="ml-auto text-turquoise-600">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}