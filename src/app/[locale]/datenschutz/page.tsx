import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Datenschutz - bildklein.ch',
  description: 'Datenschutzerklärung von bildklein.ch',
};

export default function DatenschutzPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-text-dark mb-8">Datenschutzerklärung</h1>
      
      <div className="space-y-8 text-text-gray">
        <section>
          <h2 className="text-2xl font-semibold text-text-dark mb-4">1. Datenschutz auf einen Blick</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-text-dark mb-2">Allgemeine Hinweise</h3>
              <p>
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-dark mb-2">100% lokal verarbeitet</h3>
              <p className="bg-turquoise-50 border-l-4 border-turquoise-500 p-4 rounded">
                <strong>Wichtig:</strong> Alle Bildverarbeitung erfolgt 100% lokal in Ihrem Browser. 
                Ihre Bilder werden nicht an unsere Server übertragen oder gespeichert. 
                Es erfolgt keine Analyse, Speicherung oder Übertragung Ihrer hochgeladenen Bilder.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-text-dark mb-4">2. Verantwortliche Stelle</h2>
          <p>
            <strong>bildklein.ch</strong><br />
            Flow19 Webdesign<br />
            Bern, Switzerland
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-text-dark mb-4">3. Welche Daten sammeln wir?</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-text-dark mb-2">Keine Bilddaten</h3>
              <p>
                Wie bereits erwähnt, werden Ihre hochgeladenen Bilder niemals an unsere Server übertragen oder gespeichert. 
                Alle Komprimierungen erfolgen lokal in Ihrem Browser.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-dark mb-2">Technische Daten (Log-Dateien)</h3>
              <p>
                Unser Hosting-Provider erhebt beim Aufruf unserer Website folgende Daten automatisch:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>IP-Adresse des zugreifenden Rechners</li>
                <li>Datum und Uhrzeit des Zugriffs</li>
                <li>Name und URL der abgerufenen Datei</li>
                <li>Website, von der aus der Zugriff erfolgt (Referrer-URL)</li>
                <li>Verwendeter Browser und ggf. das Betriebssystem</li>
              </ul>
              <p className="mt-2">
                Diese Daten werden für die Sicherstellung des störungsfreien Betriebs der Website benötigt und automatisch nach 30 Tagen gelöscht.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-text-dark mb-4">4. Cookies</h2>
          <div className="bg-bg-gray p-4 rounded-lg">
            <p>
              <strong>Diese Website verwendet keine Cookies.</strong><br />
              Wir setzen keine Tracking-Cookies, keine Werbe-Cookies und keine Analyse-Cookies ein.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-text-dark mb-4">5. Rechte der betroffenen Person</h2>
          <p>Sie haben jederzeit das Recht,</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Auskunft über Ihre gespeicherten personenbezogenen Daten zu erhalten</li>
            <li>Korrektur unrichtiger Daten zu verlangen</li>
            <li>Löschung Ihrer personenbezogenen Daten zu verlangen (gemäß DSGVO)</li>
            <li>Widerspruch gegen die Verarbeitung Ihrer personenbezogenen Daten einzulegen</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-text-dark mb-4">6. Änderungen dieser Datenschutzerklärung</h2>
          <p>
            Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen entspricht. 
            Wir empfehlen Ihnen daher, die Datenschutzerklärung regelmäßig zu überprüfen.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-text-dark mb-4">7. Kontakt</h2>
          <p>
            Bei Fragen zum Datenschutz können Sie uns jederzeit unter den Angaben im{' '}
            <a href="/impressum" className="text-turquoise-600 hover:text-turquoise-700 underline">
              Impressum
            </a>{' '}
            kontaktieren.
          </p>
        </section>

        <div className="mt-8 p-6 bg-gradient-to-r from-turquoise-50 to-pink-50 rounded-lg border border-turquoise-200">
          <p className="font-semibold text-text-dark">
            Stand: {new Date().toLocaleDateString('de-CH')}
          </p>
        </div>
      </div>
    </div>
  );
}
