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

  return {
    title:       `${dj.djName}${dj.tagline ? ` — ${dj.tagline}` : ''}`,
    description: dj.bioShort || undefined,
  }
}

export default async function DjPage({ params }: Props) {
  const { slug } = await params
  const dj = await getDjBySlug(slug)
  if (!dj) notFound()

  return <DjPageLayout data={dbToDjPageData(dj)} />
}
