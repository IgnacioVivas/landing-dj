import { db } from '@/lib/db'

export async function getGalleryByUser(userId: string) {
  return db.galleryItem.findMany({
    where: { userId },
    orderBy: { order: 'asc' },
  })
}

export type GalleryDbItem = Awaited<ReturnType<typeof getGalleryByUser>>[number]
