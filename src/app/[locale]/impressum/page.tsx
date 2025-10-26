import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Impressum - bildklein.ch',
  description: 'Impressum und rechtliche Angaben von bildklein.ch',
};

export default function ImpressumPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-text-dark mb-8">Impressum</h1>
      
      <div className="space-y-8 text-text-gray">
        <section>
          <h2 className="text-2xl font-semibold text-text-dark mb-4">Kontakt</h2>
          <p>
            <strong>bildklein.ch</strong><br />
            Flow19 Webdesign<br />
            Bern, Switzerland
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-text-dark mb-4">Verantwortlich</h2>
          <p>
            Diese Website wird betrieben von Flow19 Webdesign.<br />
            Bei Fragen zur Website oder zum Service können Sie uns jederzeit kontaktieren.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-text-dark mb-4">Haftungsausschluss</h2>
          <p className="mb-4">
            <strong>Haftung für Inhalte:</strong><br />
            Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
          </p>
          <p>
            <strong>Haftung für Links:</strong><br />
            Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-text-dark mb-4">Urheberrecht</h2>
          <p>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem schweizerischen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-text-dark mb-4">Datenschutz</h2>
          <p>
            Weitere Informationen zum Datenschutz finden Sie in unserer{' '}
            <a href="/datenschutz" className="text-turquoise-600 hover:text-turquoise-700 underline">
              Datenschutzerklärung
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}

