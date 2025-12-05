import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://bildklein.ch'),
  title: 'bildklein.ch - Bilder kostenlos verkleinern',
  description: 'Komprimiere JPG, PNG, WebP Bilder kostenlos online. 100% sicher, client-side processing, keine Registrierung. Made in Switzerland 🇨🇭',
  keywords: [
    'bilder verkleinern',
    'bilder komprimieren', 
    'image compression',
    'bild verkleinern',
    'foto verkleinern',
    'kostenlos',
    'schweiz',
    'switzerland',
    'online tool'
  ],
  authors: [{ name: 'flow19', url: 'https://flow19.ch' }],
  creator: 'flow19',
  publisher: 'flow19',
  
  openGraph: {
    type: 'website',
    locale: 'de_CH',
    url: 'https://bildklein.ch',
    title: 'bildklein.ch - Bilder kostenlos verkleinern',
    description: 'Komprimiere Bilder kostenlos. 100% privat, blitzschnell, Swiss-made. 🇨🇭',
    siteName: 'bildklein.ch',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'bildklein.ch - Bilder kostenlos verkleinern',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'bildklein.ch - Bilder kostenlos verkleinern',
    description: 'Komprimiere Bilder kostenlos. 100% privat, Swiss-made. 🇨🇭',
    images: ['/og-image.png'],
  },
  
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}