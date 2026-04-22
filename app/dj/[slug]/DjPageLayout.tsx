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

export default function DjPageLayout({ data }: { data: DjPageData }) {
  return (
    <DjProvider data={data}>
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
    </DjProvider>
  )
}
