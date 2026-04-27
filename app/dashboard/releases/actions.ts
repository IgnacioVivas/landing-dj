'use server'

import { auth } from '@/auth'
import { db } from '@/lib/db'
import { releaseSchema } from '@/lib/validations/release'
import { UTApi } from 'uploadthing/server'
import type { ReleaseItem } from '@/lib/queries/releases'

type Result       = { error: string } | { success: true }
type CreateResult = { error: string } | { item: ReleaseItem }

const utapi = new UTApi()

function extractKey(url: string) {
  return url.split('/f/').pop()
}

async function assertOwner(releaseId: string, userId: string): Promise<boolean> {
  const r = await db.release.findUnique({ where: { id: releaseId }, select: { userId: true } })
  return r?.userId === userId
}

export async function createReleaseAction(data: unknown): Promise<CreateResult> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  const parsed = releaseSchema.safeParse(data)
  if (!parsed.success) return { error: 'Datos inválidos.' }

  const count = await db.release.count({ where: { userId: session.user.id } })

  const { label, coverImageUrl, spotifyUrl, soundcloudUrl, appleMusicUrl, beatportUrl, ...rest } = parsed.data

  const item = await db.release.create({
    data: {
      userId:        session.user.id,
      order:         count,
      label:         label         || null,
      coverImageUrl: coverImageUrl || null,
      spotifyUrl:    spotifyUrl    || null,
      soundcloudUrl: soundcloudUrl || null,
      appleMusicUrl: appleMusicUrl || null,
      beatportUrl:   beatportUrl   || null,
      ...rest,
    },
  })

  return { item }
}

export async function updateReleaseAction(id: string, data: unknown): Promise<Result> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  const parsed = releaseSchema.safeParse(data)
  if (!parsed.success) return { error: 'Datos inválidos.' }

  if (!(await assertOwner(id, session.user.id))) return { error: 'No autorizado.' }

  const { label, coverImageUrl, spotifyUrl, soundcloudUrl, appleMusicUrl, beatportUrl, ...rest } = parsed.data

  // Delete old cover image from Uploadthing if it changed
  const current = await db.release.findUnique({ where: { id }, select: { coverImageUrl: true } })
  const newCover = coverImageUrl || null
  if (current?.coverImageUrl && current.coverImageUrl !== newCover) {
    const key = extractKey(current.coverImageUrl)
    if (key) await utapi.deleteFiles(key).catch(() => null)
  }

  await db.release.update({
    where: { id },
    data: {
      label:         label         || null,
      coverImageUrl: newCover,
      spotifyUrl:    spotifyUrl    || null,
      soundcloudUrl: soundcloudUrl || null,
      appleMusicUrl: appleMusicUrl || null,
      beatportUrl:   beatportUrl   || null,
      ...rest,
    },
  })

  return { success: true }
}

export async function deleteReleaseAction(id: string): Promise<Result> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  if (!(await assertOwner(id, session.user.id))) return { error: 'No autorizado.' }

  const release = await db.release.findUnique({ where: { id }, select: { coverImageUrl: true } })
  if (release?.coverImageUrl) {
    const key = extractKey(release.coverImageUrl)
    if (key) await utapi.deleteFiles(key).catch(() => null)
  }

  await db.release.delete({ where: { id } })

  return { success: true }
}

export async function reorderReleasesAction(orderedIds: string[]): Promise<Result> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  await db.$transaction(
    orderedIds.map((id, index) =>
      db.release.updateMany({
        where: { id, userId: session.user.id },
        data: { order: index },
      })
    )
  )

  return { success: true }
}

export async function deleteReleaseCoverAction(releaseId: string): Promise<Result> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  if (!(await assertOwner(releaseId, session.user.id))) return { error: 'No autorizado.' }

  const release = await db.release.findUnique({ where: { id: releaseId }, select: { coverImageUrl: true } })
  if (release?.coverImageUrl) {
    const key = extractKey(release.coverImageUrl)
    if (key) await utapi.deleteFiles(key).catch(() => null)
  }

  await db.release.update({ where: { id: releaseId }, data: { coverImageUrl: null } })

  return { success: true }
}
