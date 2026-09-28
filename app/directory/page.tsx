import type { Metadata } from 'next'
import { getActiveDjs } from '@/lib/queries/directory'
import { apexOrigin } from '@/lib/site-url'
import MarketingNav from '@/components/marketing/MarketingNav'
import MarketingFooter from '@/components/marketing/MarketingFooter'
import DirectoryHero from './_components/DirectoryHero'
import DjDirectoryCard from './_components/DjDirectoryCard'
import EmptyDirectory from './_components/EmptyDirectory'

export async function generateMetadata(): Promise<Metadata> {
  const root        = apexOrigin()
  const title       = 'DJs — Hypear Agency'
  const description = 'Descubrí a los DJs representados por Hypear Agency. Bio, shows, releases y contacto directo de cada artista.'

  return {
    title,
    description,
    ...(root && { alternates: { canonical: root } }),
    openGraph: { type: 'website', url: root ?? '/directory', title, description },
  }
}

export default async function DirectoryPage() {
  const djs = await getActiveDjs()

  return (
    <div className="min-h-screen bg-[#07070f] text-white">
      <MarketingNav />

      <DirectoryHero count={djs.length} />

      <section className="px-4 pb-24">
        <div className="max-w-6xl mx-auto">
          {djs.length === 0 ? (
            <EmptyDirectory />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {djs.map((dj) => <DjDirectoryCard key={dj.slug} dj={dj} />)}
            </div>
          )}
        </div>
      </section>

      <MarketingFooter />
    </div>
  )
}
