import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getGalleryByUser } from '@/lib/queries/gallery'
import { db } from '@/lib/db'
import GalleryGrid from './_components/GalleryGrid'

export const metadata = { title: 'Galería — DJ Panel' }

export default async function GalleryPage() {
  const session = await auth()
  if (!session?.user.id) redirect('/login')

  const [items, settings] = await Promise.all([
    getGalleryByUser(session.user.id),
    db.djSettings.findUnique({
      where:  { userId: session.user.id },
      select: { galleryMode: true },
    }),
  ])

  const galleryMode = (settings?.galleryMode ?? 'grid') as 'grid' | 'carousel'

  return <GalleryGrid items={items} galleryMode={galleryMode} />
}
