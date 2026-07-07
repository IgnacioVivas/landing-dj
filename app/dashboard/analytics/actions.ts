'use server'

import { auth } from '@/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

type ActionResult = { error: string } | { success: true }

const metaPixelSchema = z.union([z.literal(''), z.string().regex(/^\d+$/, 'Solo números')])
const gtmSchema = z.union([z.literal(''), z.string().regex(/^GTM-[A-Z0-9]+$/, 'Formato inválido (ej. GTM-ABC1234)')])

export async function updateMetaPixelAction(metaPixelId: string): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  const parsed = metaPixelSchema.safeParse(metaPixelId.trim())
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Datos inválidos.' }

  const value = parsed.data || null

  await db.djSettings.upsert({
    where:  { userId: session.user.id },
    update: { metaPixelId: value },
    create: { userId: session.user.id, metaPixelId: value },
  })

  return { success: true }
}

export async function updateGtmAction(gtmId: string): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  const parsed = gtmSchema.safeParse(gtmId.trim().toUpperCase())
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Datos inválidos.' }

  const value = parsed.data || null

  await db.djSettings.upsert({
    where:  { userId: session.user.id },
    update: { gtmId: value },
    create: { userId: session.user.id, gtmId: value },
  })

  return { success: true }
}
