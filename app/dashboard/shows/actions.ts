'use server'

import { auth } from '@/auth'
import { db } from '@/lib/db'
import { showSchema } from '@/lib/validations/show'

type Result = { error: string } | { success: true }

function parseShow(data: ReturnType<typeof showSchema.parse>) {
  const { date, festival, ticketUrl, ...rest } = data
  const dateObj = new Date(date)
  return {
    ...rest,
    date:      dateObj,
    isPast:    dateObj < new Date(),
    festival:  festival  || null,
    ticketUrl: ticketUrl || null,
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

  const show = await db.show.findUnique({ where: { id }, select: { userId: true } })
  if (show?.userId !== session.user.id) return { error: 'No autorizado.' }

  await db.show.update({ where: { id }, data: parseShow(parsed.data) })

  return { success: true }
}

export async function deleteShowAction(id: string): Promise<Result> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  const show = await db.show.findUnique({ where: { id }, select: { userId: true } })
  if (show?.userId !== session.user.id) return { error: 'No autorizado.' }

  await db.show.delete({ where: { id } })

  return { success: true }
}
