import { notFound } from 'next/navigation'
import { getDjBySlug } from '@/lib/queries/dj'
import { dbToDjPageData } from '@/lib/dj-adapter'
import DjPageLayout from './DjPageLayout'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const dj = await getDjBySlug(slug)
  if (!dj) return {}

  // WhatsApp/Facebook/Twitter crawlers require an absolute image URL. Building it from
  // the request's Host header isn't reliable here: NextAuth normalizes the request
  // origin to AUTH_URL during the subdomain rewrite in proxy.ts, so headers() would
  // report the platform's own domain instead of the DJ's subdomain. The canonical
  // public URL for a DJ's page is always their own subdomain, so build it from that
  // directly instead of trusting request headers.
  const platformDomain = process.env.NEXT_PUBLIC_DOMAIN
  const origin          = platformDomain ? `https://${slug}.${platformDomain}` : null

  const title       = dj.djName || slug
  const description = dj.bioShort || `${title} — DJ`
  // Bio photo (a portrait) reads better as a share-link preview than the hero
  // image (often a wide banner or a video still), so it takes priority here.
  const imagePath   = dj.bioPhoto ?? dj.settings?.heroImageUrl ?? null
  const image       = imagePath && origin ? `${origin}${imagePath}` : null
  const favicon     = dj.settings?.faviconUrl ?? null
  const url         = `/dj/${slug}`

  return {
    title,
    description,
    ...(favicon && { icons: { icon: favicon } }),
    openGraph: {
      type:        'website',
      url,
      title,
      description,
      ...(image && {
        images: [{ url: image, width: 1200, height: 630, alt: title }],
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

  return <DjPageLayout data={dbToDjPageData(dj)} userId={dj.id} />
}
