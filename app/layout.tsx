import type { Metadata } from 'next'
import { Bebas_Neue, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { cn } from '@/lib/utils'
import { LanguageProvider } from '@/contexts/LanguageContext'
import './globals.css'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Hypek — Presskits profesionales para DJs',
  description: 'Creá tu landing page y presskit profesional como DJ. Hypek.',
  openGraph: {
    type: 'website',
    title: 'Hypek — Presskits profesionales para DJs',
    description: 'Creá tu landing page y presskit profesional como DJ. Hypek.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={cn(bebasNeue.variable, spaceGrotesk.variable, jetbrainsMono.variable)}
    >
      <body className="min-h-screen antialiased">
        <div className="grain" aria-hidden="true" />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
