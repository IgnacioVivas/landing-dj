'use server'

import { auth } from '@/auth'
import { db } from '@/lib/db'
import { UTApi } from 'uploadthing/server'

type Result = { error: string } | { success: true }

const utapi = new UTApi()

const GALLERY_LIMIT = 12

export async function createGalleryItemAction(
  imageUrl: string,
  caption: string,
  aspect: string,
) {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  const count = await db.galleryItem.count({ where: { userId: session.user.id } })
  if (count >= GALLERY_LIMIT) {
    // Delete the just-uploaded file since we won't use it
    const key = imageUrl.split('/f/').pop()
    if (key) await utapi.deleteFiles(key).catch(() => null)
    return { error: `Límite de ${GALLERY_LIMIT} imágenes alcanzado.` }
  }

  const item = await db.galleryItem.create({
    data: { userId: session.user.id, imageUrl, caption, aspect, order: count },
  })

  return { success: true as const, item }
}

export async function updateGalleryItemAction(
  id: string,
  caption: string,
  captionEn: string,
  aspect: string,
): Promise<Result> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  const item = await db.galleryItem.findUnique({ where: { id }, select: { userId: true } })
  if (item?.userId !== session.user.id) return { error: 'No autorizado.' }

  await db.galleryItem.update({ where: { id }, data: { caption, captionEn, aspect } })

  return { success: true }
}

export async function deleteGalleryItemAction(id: string): Promise<Result> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  const item = await db.galleryItem.findUnique({
    where: { id },
    select: { userId: true, imageUrl: true },
  })
  if (item?.userId !== session.user.id) return { error: 'No autorizado.' }

  // Delete from Uploadthing storage
  if (item.imageUrl) {
    const key = item.imageUrl.split('/f/').pop()
    if (key) await utapi.deleteFiles(key).catch(() => null)
  }

  await db.galleryItem.delete({ where: { id } })

  return { success: true }
}

export async function reorderGalleryAction(orderedIds: string[]): Promise<Result> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  await db.$transaction(
    orderedIds.map((id, index) =>
      db.galleryItem.updateMany({
        where: { id, userId: session.user.id },
        data: { order: index },
      })
    )
  )

  return { success: true }
}
