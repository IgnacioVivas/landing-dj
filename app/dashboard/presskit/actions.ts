'use server'

import { auth } from '@/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

type ActionResult = { error: string } | { success: true }

const linksSchema = z.object({
  riderUrl: z.union([z.literal(''), z.string().url('URL inválida')]),
  epkUrl:   z.union([z.literal(''), z.string().url('URL inválida')]),
})

export async function updatePressKitPasswordAction(
  password: string,
): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  const value = password.trim() || null

  await db.djSettings.upsert({
    where:  { userId: session.user.id },
    update: { pressKitPassword: value },
    create: { userId: session.user.id, pressKitPassword: value },
  })

  return { success: true }
}

export async function updatePressKitLinksAction(
  riderUrl: string,
  epkUrl: string,
): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  const parsed = linksSchema.safeParse({ riderUrl, epkUrl })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Datos inválidos.' }

  const data = {
    riderUrl: parsed.data.riderUrl || null,
    epkUrl:   parsed.data.epkUrl   || null,
  }

  await db.djSettings.upsert({
    where:  { userId: session.user.id },
    update: data,
    create: { userId: session.user.id, ...data },
  })

  return { success: true }
}
