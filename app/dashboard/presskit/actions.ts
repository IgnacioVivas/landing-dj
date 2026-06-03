'use server'

import { auth } from '@/auth'
import { db } from '@/lib/db'

type ActionResult = { error: string } | { success: true }

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
