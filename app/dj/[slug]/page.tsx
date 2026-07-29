import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
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

  // WhatsApp/Facebook/Twitter crawlers require an absolute image URL — a relative
  // path can't be resolved without a fixed metadataBase, which doesn't make sense
  // across per-DJ subdomains. Build it from the actual request's host instead.
  const hdrs       = await headers()
  const host       = hdrs.get('host')
  const proto      = hdrs.get('x-forwarded-proto') ?? 'https'
  const origin     = host ? `${proto}://${host}` : null

  const title       = dj.djName || slug
  const description = dj.bioShort || `${title} — DJ`
  const imagePath   = dj.settings?.heroImageUrl ?? dj.bioPhoto ?? null
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
