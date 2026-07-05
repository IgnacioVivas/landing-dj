'use server'

import { auth } from '@/auth'
import { db } from '@/lib/db'
import { changePasswordSchema, changeEmailSchema } from '@/lib/validations/auth'
import { hashPassword, verifyPassword } from '@/lib/auth-utils'

type ActionResult = { error: string } | { success: true }

export async function changePasswordAction(data: unknown): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  const parsed = changePasswordSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Datos inválidos.' }

  const user = await db.user.findUnique({
    where:  { id: session.user.id },
    select: { password: true },
  })
  if (!user?.password) return { error: 'No autorizado.' }

  const valid = await verifyPassword(parsed.data.currentPassword, user.password)
  if (!valid) return { error: 'La contraseña actual es incorrecta.' }

  const hashed = await hashPassword(parsed.data.newPassword)
  await db.user.update({ where: { id: session.user.id }, data: { password: hashed } })

  return { success: true }
}

export async function changeEmailAction(data: unknown): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  const parsed = changeEmailSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Datos inválidos.' }

  const user = await db.user.findUnique({
    where:  { id: session.user.id },
    select: { password: true, email: true },
  })
  if (!user?.password) return { error: 'No autorizado.' }

  const valid = await verifyPassword(parsed.data.currentPassword, user.password)
  if (!valid) return { error: 'La contraseña es incorrecta.' }

  const newEmail = parsed.data.newEmail.trim().toLowerCase()
  if (newEmail === user.email.toLowerCase()) return { error: 'Ese ya es tu email actual.' }

  const exists = await db.user.findUnique({ where: { email: newEmail } })
  if (exists) return { error: 'Ese email ya está en uso.' }

  await db.user.update({ where: { id: session.user.id }, data: { email: newEmail } })

  return { success: true }
}
