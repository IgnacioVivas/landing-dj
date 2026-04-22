'use server'

import { auth } from '@/auth'
import { db } from '@/lib/db'
import { releaseSchema } from '@/lib/validations/release'

type Result = { error: string } | { success: true }

async function assertOwner(releaseId: string, userId: string): Promise<boolean> {
  const r = await db.release.findUnique({ where: { id: releaseId }, select: { userId: true } })
  return r?.userId === userId
}

export async function createReleaseAction(data: unknown): Promise<Result> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  const parsed = releaseSchema.safeParse(data)
  if (!parsed.success) return { error: 'Datos inválidos.' }

  const count = await db.release.count({ where: { userId: session.user.id } })

  const { label, spotifyUrl, soundcloudUrl, appleMusicUrl, beatportUrl, ...rest } = parsed.data

  await db.release.create({
    data: {
      userId:       session.user.id,
      order:        count,
      label:        label        || null,
      spotifyUrl:   spotifyUrl   || null,
      soundcloudUrl:soundcloudUrl|| null,
      appleMusicUrl:appleMusicUrl|| null,
      beatportUrl:  beatportUrl  || null,
      ...rest,
    },
  })

  return { success: true }
}

export async function updateReleaseAction(id: string, data: unknown): Promise<Result> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  const parsed = releaseSchema.safeParse(data)
  if (!parsed.success) return { error: 'Datos inválidos.' }

  if (!(await assertOwner(id, session.user.id))) return { error: 'No autorizado.' }

  const { label, spotifyUrl, soundcloudUrl, appleMusicUrl, beatportUrl, ...rest } = parsed.data

  await db.release.update({
    where: { id },
    data: {
      label:        label        || null,
      spotifyUrl:   spotifyUrl   || null,
      soundcloudUrl:soundcloudUrl|| null,
      appleMusicUrl:appleMusicUrl|| null,
      beatportUrl:  beatportUrl  || null,
      ...rest,
    },
  })

  return { success: true }
}

export async function deleteReleaseAction(id: string): Promise<Result> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  if (!(await assertOwner(id, session.user.id))) return { error: 'No autorizado.' }

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
