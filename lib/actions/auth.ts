'use server'

import { signOut } from '@/auth'

export async function clearSession() {
  await signOut({ redirect: false })
}
