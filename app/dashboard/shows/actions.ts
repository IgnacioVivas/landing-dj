'use server'

import { auth } from '@/auth'
import { db } from '@/lib/db'
import { showSchema } from '@/lib/validations/show'
import { deleteFile } from '@/lib/storage'

type Result = { error: string } | { success: true }

function parseShow(data: ReturnType<typeof showSchema.parse>) {
  const { date, address, festival, ticketUrl, flyerUrl, ...rest } = data
  const dateObj = new Date(date)
  return {
    ...rest,
    date:      dateObj,
    isPast:    dateObj < new Date(),
    address:   address   || null,
    festival:  festival  || null,
    ticketUrl: ticketUrl || null,
    flyerUrl:  flyerUrl  || null,
  }
}

export async function createShowAction(data: unknown): Promise<Result> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  const parsed = showSchema.safeParse(data)
  if (!parsed.success) return { error: 'Datos inválidos.' }

  await db.show.create({
    data: { userId: session.user.id, ...parseShow(parsed.data) },
  })

  return { success: true }
}

export async function updateShowAction(id: string, data: unknown): Promise<Result> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  const parsed = showSchema.safeParse(data)
  if (!parsed.success) return { error: 'Datos inválidos.' }

  const show = await db.show.findUnique({ where: { id }, select: { userId: true, flyerUrl: true } })
  if (show?.userId !== session.user.id) return { error: 'No autorizado.' }

  const newData = parseShow(parsed.data)

  if (show.flyerUrl && show.flyerUrl !== newData.flyerUrl) {
    await deleteFile(show.flyerUrl)
  }

  await db.show.update({ where: { id }, data: newData })

  return { success: true }
}

export async function updateShowsModeAction(mode: 'list' | 'flyer'): Promise<Result> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }
  if (mode !== 'list' && mode !== 'flyer') return { error: 'Modo inválido.' }

  await db.djSettings.upsert({
    where:  { userId: session.user.id },
    update: { showsMode: mode },
    create: { userId: session.user.id, showsMode: mode },
  })

  return { success: true }
}

export async function toggleFeaturedAction(id: string): Promise<Result> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  const show = await db.show.findUnique({ where: { id }, select: { userId: true, isFeatured: true } })
  if (show?.userId !== session.user.id) return { error: 'No autorizado.' }

  await db.$transaction([
    db.show.updateMany({ where: { userId: session.user.id }, data: { isFeatured: false } }),
    db.show.update({ where: { id }, data: { isFeatured: !show.isFeatured } }),
  ])

  return { success: true }
}

export async function deleteShowAction(id: string): Promise<Result> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  const show = await db.show.findUnique({ where: { id }, select: { userId: true, flyerUrl: true } })
  if (show?.userId !== session.user.id) return { error: 'No autorizado.' }

  await deleteFile(show.flyerUrl)
  await db.show.delete({ where: { id } })

  return { success: true }
}
