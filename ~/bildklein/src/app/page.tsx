import CompressorTool from '@/components/CompressorTool'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-cyan-400 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">B</span>
          </div>
          <h1 className="text-xl font-bold">bildklein.ch</h1>
          <span className="text-xl">🇨🇭</span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        <CompressorTool />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-cyan-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <div>
                <div className="font-bold">bildklein.ch</div>
                <div className="text-sm text-gray-600">🇨🇭 Made in Switzerland</div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm">
              <div className="flex items-center gap-4">
                <a href="/impressum" className="text-gray-600 hover:text-gray-900">Impressum</a>
                <a href="/datenschutz" className="text-gray-600 hover:text-gray-900">Datenschutz</a>
              </div>
              <span className="text-gray-600">
                Built by{' '}
                <a 
                  href="https://flow19.ch" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-cyan-600 hover:text-cyan-700 font-semibold"
                >
                  flow19
                </a>
                {' '}→
              </span>
              <span className="text-gray-400">Bern, Switzerland</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}






