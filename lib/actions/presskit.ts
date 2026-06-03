'use server'

import { db } from '@/lib/db'

export async function verifyPressKitPassword(
  slug: string,
  password: string,
): Promise<{ success: boolean }> {
  const settings = await db.djSettings.findFirst({
    where:  { user: { slug } },
    select: { pressKitPassword: true },
  })

  if (!settings)                   return { success: false }
  if (!settings.pressKitPassword)  return { success: true }
  return { success: settings.pressKitPassword === password }
}
