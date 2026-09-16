'use server'

import { auth } from '@/auth'
import { db } from '@/lib/db'
import { deleteFile } from '@/lib/storage'
import { z } from 'zod'

type ActionResult = { error: string } | { success: true }

const optionalUrl = z.union([z.literal(''), z.string().url('URL inválida')])

const linksSchema = z.object({
  riderUrl:       optionalUrl,
  epkUrl:         optionalUrl,
  promoFolderUrl: optionalUrl,
})

const detailsSchema = z.object({
  equipment:    z.string().max(2000),
  monitoring:   z.string().max(2000),
  ergonomics:   z.string().max(2000),
  hospitality:  z.string().max(2000),
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
  promoFolderUrl: string,
): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  const parsed = linksSchema.safeParse({ riderUrl, epkUrl, promoFolderUrl })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Datos inválidos.' }

  const data = {
    riderUrl: parsed.data.riderUrl || null,
    epkUrl:   parsed.data.epkUrl   || null,
    pressKitPromoFolderUrl: parsed.data.promoFolderUrl || null,
  }

  await db.djSettings.upsert({
    where:  { userId: session.user.id },
    update: data,
    create: { userId: session.user.id, ...data },
  })

  return { success: true }
}

export async function updatePressKitDetailsAction(
  equipment: string,
  monitoring: string,
  ergonomics: string,
  hospitality: string,
): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  const parsed = detailsSchema.safeParse({ equipment, monitoring, ergonomics, hospitality })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Datos inválidos.' }

  const data = {
    pressKitEquipment:   parsed.data.equipment.trim()   || null,
    pressKitMonitoring:  parsed.data.monitoring.trim()  || null,
    pressKitErgonomics:  parsed.data.ergonomics.trim()  || null,
    pressKitHospitality: parsed.data.hospitality.trim() || null,
  }

  await db.djSettings.upsert({
    where:  { userId: session.user.id },
    update: data,
    create: { userId: session.user.id, ...data },
  })

  return { success: true }
}

export async function updatePressKitStagePlotAction(url: string | null): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  const current = await db.djSettings.findUnique({
    where:  { userId: session.user.id },
    select: { pressKitStagePlotUrl: true },
  })
  await deleteFile(current?.pressKitStagePlotUrl)

  await db.djSettings.upsert({
    where:  { userId: session.user.id },
    update: { pressKitStagePlotUrl: url },
    create: { userId: session.user.id, pressKitStagePlotUrl: url },
  })

  return { success: true }
}
