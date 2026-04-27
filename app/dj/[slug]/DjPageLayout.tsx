'use client'

import { DjProvider, type DjPageData } from '@/lib/dj-context'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import Bio from '@/components/sections/Bio'
import Releases from '@/components/sections/Releases'
import Shows from '@/components/sections/Shows'
import Multimedia from '@/components/sections/Multimedia'
import YouTube from '@/components/sections/YouTube'
import Instagram from '@/components/sections/Instagram'
import Contact from '@/components/sections/Contact'
import FloatingControls from '@/components/ui/FloatingControls'
import AnalyticsBeacon from '@/components/ui/AnalyticsBeacon'
import PageLoader from '@/components/ui/PageLoader'

export default function DjPageLayout({ data, userId }: { data: DjPageData; userId: string }) {
  const { accentColor, accentColor2 } = data.theme
  return (
    <>
      <style>{`
        :root {
          --dj-accent:  ${accentColor};
          --dj-accent2: ${accentColor2};
        }
      `}</style>
      <DjProvider data={data}>
        <PageLoader />
        <Navbar />
        <main>
          <Hero />
          <Bio />
          <Releases />
          <Shows />
          <Multimedia />
          <YouTube />
          <Instagram />
          <Contact />
        </main>
        <Footer />
        <FloatingControls />
        <AnalyticsBeacon userId={userId} />
      </DjProvider>
    </>
  )
}
