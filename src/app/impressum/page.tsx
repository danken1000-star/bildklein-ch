export default function ImpressumPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Impressum</h1>
      
      <div className="prose prose-gray max-w-none">
        <h2>Angaben gemäß Informationspflicht</h2>
        
        <h3>Betreiber:</h3>
        <p>
          bildklein.ch<br />
          Ein Projekt von flow19<br />
          Bern, Schweiz
        </p>

        <h3>Kontakt:</h3>
        <p>
          Web: <a href="https://flow19.ch" className="text-cyan-600">flow19.ch</a>
        </p>

        <h3>Haftungsausschluss:</h3>
        <p>
          Der Autor übernimmt keine Gewähr für die Richtigkeit, Genauigkeit, Aktualität, 
          Zuverlässigkeit und Vollständigkeit der Informationen.
        </p>
        
        <p>
          Haftungsansprüche gegen den Autor wegen Schäden materieller oder immaterieller Art, 
          welche aus dem Zugriff oder der Nutzung bzw. Nichtnutzung der veröffentlichten Informationen, 
          durch Missbrauch der Verbindung oder durch technische Störungen entstanden sind, werden ausgeschlossen.
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
