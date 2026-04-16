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
  title: 'NEXUS — Electronic Music Producer & DJ',
  description:
    'Official website of NEXUS. Electronic music producer and DJ. Bookings, releases, upcoming shows and more.',
  openGraph: {
    type: 'website',
    title: 'NEXUS — Electronic Music Producer & DJ',
    description: 'Official website of NEXUS.',
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
