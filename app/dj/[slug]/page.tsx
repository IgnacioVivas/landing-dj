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

  const title       = dj.djName || slug
  const description = dj.bioShort || `${title} — DJ`
  const image       = dj.settings?.heroImageUrl ?? dj.bioPhoto ?? null
  const url         = `/dj/${slug}`

  return {
    title,
    description,
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
