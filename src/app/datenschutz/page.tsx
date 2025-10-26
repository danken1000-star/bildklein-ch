export default function DatenschutzPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Datenschutz</h1>
      
      <div className="prose prose-gray max-w-none">
        <h2>Grundsatz</h2>
        <p>
          Der Schutz Ihrer Privatsphäre ist uns wichtig. bildklein.ch verarbeitet 
          alle Bilder ausschließlich lokal in Ihrem Browser. Es werden keine Daten 
          an unsere Server übertragen.
        </p>

        <h2>Datenverarbeitung</h2>
        <h3>Bildverarbeitung</h3>
        <p>
          Alle hochgeladenen Bilder werden ausschließlich in Ihrem Browser komprimiert. 
          Die Bilder verlassen niemals Ihr Gerät. Es erfolgt keine Speicherung auf unseren Servern.
        </p>

        <h3>Cookies</h3>
        <p>
          Diese Website verwendet keine Cookies zur Nachverfolgung von Nutzern.
        </p>

        <h3>Server-Logs</h3>
        <p>
          Beim Besuch dieser Website werden automatisch Informationen allgemeiner Natur erfasst. 
          Diese beinhalten die IP-Adresse, Browser-Typ, Betriebssystem und Zugriffszeitpunkt. 
          Diese Daten werden nur für technische Zwecke verwendet und nicht mit persönlichen Daten verknüpft.
        </p>

        <h2>Ihre Rechte</h2>
        <p>
          Da wir keine personenbezogenen Daten speichern, entfallen entsprechende Auskunfts-, 
          Löschungs- und Korrekturrechte.
        </p>

        <h2>Kontakt</h2>
        <p>
          Bei Fragen zum Datenschutz kontaktieren Sie uns über{' '}
          <a href="https://flow19.ch" className="text-cyan-600">flow19.ch</a>
        </p>
      </div>

      <div className="mt-8">
        <a href="/" className="text-cyan-600 hover:text-cyan-700">
          ← Zurück zur Startseite
        </a>
      </div>
    </div>
  )
}
