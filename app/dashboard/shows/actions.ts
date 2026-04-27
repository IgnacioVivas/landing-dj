'use server'

import { auth } from '@/auth'
import { db } from '@/lib/db'
import { showSchema } from '@/lib/validations/show'
import { UTApi } from 'uploadthing/server'

type Result = { error: string } | { success: true }

const utapi = new UTApi()

function extractKey(url: string) {
  return url.split('/f/').pop()
}

function parseShow(data: ReturnType<typeof showSchema.parse>) {
  const { date, festival, ticketUrl, flyerUrl, ...rest } = data
  const dateObj = new Date(date)
  return {
    ...rest,
    date:      dateObj,
    isPast:    dateObj < new Date(),
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

  // Delete old flyer from Uploadthing if it changed
  if (show.flyerUrl && show.flyerUrl !== newData.flyerUrl) {
    const key = extractKey(show.flyerUrl)
    if (key) await utapi.deleteFiles(key).catch(() => null)
  }

  await db.show.update({ where: { id }, data: newData })

  return { success: true }
}

export async function deleteShowAction(id: string): Promise<Result> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  const show = await db.show.findUnique({ where: { id }, select: { userId: true, flyerUrl: true } })
  if (show?.userId !== session.user.id) return { error: 'No autorizado.' }

  // Delete flyer from Uploadthing storage
  if (show.flyerUrl) {
    const key = extractKey(show.flyerUrl)
    if (key) await utapi.deleteFiles(key).catch(() => null)
  }

  await db.show.delete({ where: { id } })

  return { success: true }
}
