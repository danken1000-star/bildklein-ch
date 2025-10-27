'use client'
import { useState, useRef } from 'react'
import imageCompression from 'browser-image-compression'

interface CompressedImage {
  original: File
  compressed: Blob
  originalSize: number
  compressedSize: number
  originalUrl: string
  compressedUrl: string
  savings: number
}

export default function CompressorTool() {
  const [images, setImages] = useState<CompressedImage[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const compressImages = async (files: File[]) => {
    setIsProcessing(true)
    console.log('🚀 Starting compression for', files.length, 'files')

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      initialQuality: 0.8
    }

    try {
      const compressedImages: CompressedImage[] = []

      for (const file of files) {
        console.log('📸 Compressing:', file.name)
        
        const compressedBlob = await imageCompression(file, options)
        const originalUrl = URL.createObjectURL(file)
        const compressedUrl = URL.createObjectURL(compressedBlob)
        
        const originalSize = file.size
        const compressedSize = compressedBlob.size
        const savings = Math.round(((originalSize - compressedSize) / originalSize) * 100)

        compressedImages.push({
          original: file,
          compressed: compressedBlob,
          originalSize,
          compressedSize,
          originalUrl,
          compressedUrl,
          savings
        })

        console.log('✅ Compressed:', file.name, 'Savings:', savings + '%')
      }

      setImages(compressedImages)
      setIsProcessing(false)
      console.log('🎉 All done!')

    } catch (error) {
      console.error('❌ Compression failed:', error)
      alert('Fehler beim Komprimieren. Bitte versuche es erneut.')
      setIsProcessing(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const fileArray = Array.from(files).slice(0, 5)
    compressImages(fileArray)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (!files || files.length === 0) return
    const fileArray = Array.from(files).slice(0, 5)
    compressImages(fileArray)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const downloadImage = (image: CompressedImage) => {
    const link = document.createElement('a')
    link.href = image.compressedUrl
    link.download = `bildklein-${image.original.name}`
    link.click()
  }

  const downloadAll = () => {
    images.forEach(img => downloadImage(img))
  }

  const reset = () => {
    images.forEach(img => {
      URL.revokeObjectURL(img.originalUrl)
      URL.revokeObjectURL(img.compressedUrl)
    })
    setImages([])
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      {images.length === 0 ? (
        <div>
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Bilder kostenlos{' '}
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                verkleinern
              </span>
            </h1>
            <p className="text-xl text-gray-600">Schnell, sicher, Swiss-made</p>
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-300 rounded-2xl p-12 hover:border-cyan-400 transition-colors cursor-pointer"
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <div className="text-center">
              <div className="w-20 h-20 bg-cyan-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Bilder hochladen</h3>
              <p className="text-gray-600 mb-4">Ziehe Bilder hierher oder klicke zum Auswählen</p>
              <button className="px-8 py-3 bg-gradient-to-r from-pink-400 to-cyan-400 text-white rounded-full font-semibold">
                Dateien auswählen
              </button>
              <p className="text-sm text-gray-500 mt-4">
                Unterstützte Formate: JPG, PNG, WebP • Max. 25 MB pro Bild • Bis zu 5 Bilder
              </p>
            </div>
          </div>

          <p className="text-center text-gray-600 mt-8">Keine Registrierung. Keine Limits. 100% kostenlos.</p>
        </div>
      ) : isProcessing ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Wird komprimiert...</p>
        </div>
      ) : (
        <div>
          <h2 className="text-3xl font-bold mb-8">Ergebnisse</h2>
          
          <div className="space-y-6 mb-8">
            {images.map((img, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-gray-900">{img.original.name}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    img.savings > 50 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {img.savings}% gespart 🎉
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-gray-600">Original:</p>
                    <p className="font-semibold text-gray-900">{formatBytes(img.originalSize)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Komprimiert:</p>
                    <p className="font-semibold text-green-600">{formatBytes(img.compressedSize)}</p>
                  </div>
                </div>

                <button
                  onClick={() => downloadImage(img)}
                  className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-pink-400 to-cyan-400 text-white rounded-full font-semibold hover:opacity-90"
                >
                  Herunterladen
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            {images.length > 1 && (
              <button
                onClick={downloadAll}
                className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800"
              >
                Alle herunterladen ({images.length})
              </button>
            )}
            <button
              onClick={reset}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:border-gray-400"
            >
              Weitere Bilder komprimieren
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
