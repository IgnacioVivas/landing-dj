import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getGalleryByUser } from '@/lib/queries/gallery'
import GalleryGrid from './_components/GalleryGrid'

export const metadata = { title: 'Galería — DJ Panel' }

export default async function GalleryPage() {
  const session = await auth()
  if (!session?.user.id) redirect('/login')

  const items = await getGalleryByUser(session.user.id)

  return <GalleryGrid items={items} />
}
