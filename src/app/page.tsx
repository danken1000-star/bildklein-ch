import MainPageClient from './MainPageClient';

export default function MainPage() {
  const messages = {
    hero: {
      headline: "Bilder kostenlos verkleinern",
      subheadline: "Schnell, sicher, Swiss-made",
      trust: "Über 10,000 Bilder täglich komprimiert"
    },
    features: {
      private: { title: "100% Privat", description: "Bilder bleiben auf deinem Gerät" },
      fast: { title: "Blitzschnell", description: "Komprimierung im Browser" },
      quality: { title: "Swiss Quality", description: "Made in Switzerland" }
    },
    upload: {
      title: "Bilder hochladen",
      subtitle: "Ziehe Bilder hierher oder klicke zum Auswählen"
    },
    settings: { title: "Komprimierungseinstellungen" },
    preview: { title: "Vorschau & Ergebnisse" },
    download: { title: "Download", compressMore: "Weitere Bilder komprimieren" }
  };

  return <MainPageClient messages={messages} />
}
