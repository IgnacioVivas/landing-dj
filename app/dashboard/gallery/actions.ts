'use server'

import { auth } from '@/auth'
import { db } from '@/lib/db'
import { deleteFile } from '@/lib/storage'

type Result = { error: string } | { success: true }

const GALLERY_LIMIT = 12

export async function createGalleryItemAction(
  imageUrl: string | null,
  videoUrl: string | null,
  caption: string,
  aspect: string,
  videoThumbnailUrl: string | null = null,
) {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  const count = await db.galleryItem.count({ where: { userId: session.user.id } })
  if (count >= GALLERY_LIMIT) {
    await Promise.all([deleteFile(imageUrl ?? videoUrl), deleteFile(videoThumbnailUrl)])
    return { error: `Límite de ${GALLERY_LIMIT} elementos alcanzado.` }
  }

  const item = await db.galleryItem.create({
    data: { userId: session.user.id, imageUrl, videoUrl, videoThumbnailUrl, caption, aspect, order: count },
  })

  return { success: true as const, item }
}

export async function updateGalleryItemAction(
  id: string,
  caption: string,
  captionEn: string,
  aspect: string,
  videoThumbnailUrl?: string | null,
): Promise<Result> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  const item = await db.galleryItem.findUnique({ where: { id }, select: { userId: true, videoThumbnailUrl: true } })
  if (item?.userId !== session.user.id) return { error: 'No autorizado.' }

  const changingThumbnail = videoThumbnailUrl !== undefined && videoThumbnailUrl !== item.videoThumbnailUrl
  if (changingThumbnail) await deleteFile(item.videoThumbnailUrl)

  await db.galleryItem.update({
    where: { id },
    data: {
      caption, captionEn, aspect,
      ...(videoThumbnailUrl !== undefined && { videoThumbnailUrl }),
    },
  })

  return { success: true }
}

export async function deleteGalleryItemAction(id: string): Promise<Result> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  const item = await db.galleryItem.findUnique({
    where: { id },
    select: { userId: true, imageUrl: true, videoUrl: true, videoThumbnailUrl: true },
  })
  if (item?.userId !== session.user.id) return { error: 'No autorizado.' }

  await Promise.all([deleteFile(item.imageUrl), deleteFile(item.videoUrl), deleteFile(item.videoThumbnailUrl)])
  await db.galleryItem.delete({ where: { id } })

  return { success: true }
}

export async function updateGalleryModeAction(mode: 'grid' | 'carousel'): Promise<Result> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }
  if (mode !== 'grid' && mode !== 'carousel') return { error: 'Modo inválido.' }

  await db.djSettings.upsert({
    where:  { userId: session.user.id },
    update: { galleryMode: mode },
    create: { userId: session.user.id, galleryMode: mode },
  })

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
