'use server'

import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth-utils'
import { registerSchema } from '@/lib/validations/auth'

export async function registerAction(data: unknown): Promise<{ error: string } | { success: true }> {
  const parsed = registerSchema.safeParse(data)
  if (!parsed.success) return { error: 'Datos inválidos.' }

  if (parsed.data.inviteCode !== process.env.INVITE_CODE) {
    return { error: 'Código de invitación inválido.' }
  }

  const { djName, slug, email, password } = parsed.data

  const existing = await db.user.findFirst({
    where: { OR: [{ email }, { slug }] },
    select: { email: true, slug: true },
  })

  if (existing?.email === email) return { error: 'Ese email ya está registrado.' }
  if (existing?.slug === slug) return { error: 'Ese slug ya está en uso.' }

  const hashed = await hashPassword(password)

  await db.user.create({
    data: { email, djName, slug, password: hashed },
  })

  return { success: true }
}
