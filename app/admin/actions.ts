'use server'

import { auth } from '@/auth'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth-utils'
import { createDjSchema, updateSubscriptionSchema, updateDjInfoSchema } from '@/lib/validations/admin'
import { revalidatePath } from 'next/cache'
import { addMonths } from 'date-fns'

async function requireAdmin() {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') throw new Error('Unauthorized')
  return session
}

export async function createDjAction(raw: unknown) {
  await requireAdmin()

  const parsed = createDjSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Datos inválidos.' }

  const { email, password, djName, slug, months, notes } = parsed.data

  const exists = await db.user.findFirst({ where: { OR: [{ email }, { slug }] } })
  if (exists?.email === email) return { error: 'Ese email ya está registrado.' }
  if (exists?.slug  === slug)  return { error: 'Ese slug ya está en uso.' }

  const hashed = await hashPassword(password)
  const now    = new Date()

  await db.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        password: hashed,
        djName,
        slug,
        name: djName,
        role: 'DJ',
        genres: [],
      },
    })

    await tx.subscription.create({
      data: {
        userId:    user.id,
        status:    'ACTIVE',
        startDate: now,
        expiresAt: addMonths(now, months),
        notes:     notes ?? '',
      },
    })

    await tx.djSettings.create({
      data: { userId: user.id },
    })
  })

  revalidatePath('/admin/users')
  return { success: true }
}

export async function updateSubscriptionAction(raw: unknown) {
  await requireAdmin()

  const parsed = updateSubscriptionSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Datos inválidos.' }

  const { userId, status, startDate, expiresAt, notes } = parsed.data

  await db.subscription.upsert({
    where:  { userId },
    create: { userId, status, startDate: new Date(startDate), expiresAt: new Date(expiresAt), notes: notes ?? '' },
    update: { status, startDate: new Date(startDate), expiresAt: new Date(expiresAt), notes: notes ?? '' },
  })

  revalidatePath('/admin/users')
  revalidatePath(`/admin/users/${userId}`)
  return { success: true }
}

export async function updateDjInfoAction(raw: unknown) {
  await requireAdmin()

  const parsed = updateDjInfoSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Datos inválidos.' }

  const { userId, djName, email, slug } = parsed.data

  const conflict = await db.user.findFirst({
    where: { AND: [{ id: { not: userId } }, { OR: [{ email }, { slug }] }] },
    select: { email: true, slug: true },
  })
  if (conflict?.email === email) return { error: 'Ese email ya está registrado.' }
  if (conflict?.slug  === slug)  return { error: 'Ese slug ya está en uso.' }

  await db.user.update({
    where: { id: userId },
    data:  { djName, email, slug, name: djName },
  })

  revalidatePath('/admin/users')
  revalidatePath(`/admin/users/${userId}`)
  return { success: true }
}

export async function deleteUserAction(userId: string) {
  await requireAdmin()
  await db.user.delete({ where: { id: userId } })
  revalidatePath('/admin/users')
  return { success: true }
}
