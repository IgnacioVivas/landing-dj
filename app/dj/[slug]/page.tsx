import { notFound } from 'next/navigation'
import { getDjBySlug } from '@/lib/queries/dj'
import { dbToDjPageData } from '@/lib/dj-adapter'
import { djOrigin } from '@/lib/site-url'
import DjPageLayout from './DjPageLayout'
import DjJsonLd from '@/components/seo/DjJsonLd'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

// "Nikz — DJ | Techno, House" instead of just "Nikz" — a bare name has
// nothing for Google to match a genre or "DJ" search against.
function buildTitle(djName: string, genres: string[]): string {
  const genrePart = genres.length > 0 ? ` | ${genres.slice(0, 3).join(', ')}` : ''
  return `${djName} — DJ${genrePart}`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const dj = await getDjBySlug(slug)
  if (!dj) return {}

  const origin = djOrigin(slug)
  const djName = dj.djName || slug

  const title       = buildTitle(djName, dj.genres)
  const description = dj.bioShort || `${djName} — DJ. Escuchá sus mixes y descargá su press kit.`
  // Bio photo (a portrait) reads better as a share-link preview than the hero
  // image (often a wide banner or a video still), so it takes priority here.
  const imagePath   = dj.bioPhoto ?? dj.settings?.heroImageUrl ?? null
  const image       = imagePath && origin ? `${origin}${imagePath}` : null
  const favicon     = dj.settings?.faviconUrl ?? null

  return {
    title,
    description,
    ...(favicon && { icons: { icon: favicon } }),
    ...(origin && { alternates: { canonical: origin } }),
    openGraph: {
      type:        'website',
      url:         origin ?? `/dj/${slug}`,
      title,
      description,
      ...(image && {
        images: [{ url: image, width: 1200, height: 630, alt: djName }],
      }),
    },
    twitter: {
      card:        image ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(image && { images: [image] }),
    },
  }
}

export default async function DjPage({ params }: Props) {
  const { slug } = await params
  const dj = await getDjBySlug(slug)
  if (!dj) notFound()

  const origin  = djOrigin(slug)
  const djName  = dj.djName || slug
  const imagePath = dj.bioPhoto ?? dj.settings?.heroImageUrl ?? null

  return (
    <>
      {origin && (
        <DjJsonLd
          name={djName}
          url={origin}
          image={imagePath ? `${origin}${imagePath}` : null}
          description={dj.bioShort || `${djName} — DJ`}
          genres={dj.genres}
          sameAs={[
            dj.settings?.instagramUrl,
            dj.settings?.spotifyProfileUrl,
            dj.settings?.soundcloudUrl,
            dj.settings?.youtubeChannelUrl,
          ].filter((v): v is string => !!v)}
        />
      )}
      <DjPageLayout data={dbToDjPageData(dj)} userId={dj.id} />
    </>
  )
}
