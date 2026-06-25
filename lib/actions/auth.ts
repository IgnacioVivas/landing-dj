'use server'

import { signOut } from '@/auth'

export async function handleSignOut() {
  const domain = process.env.NEXT_PUBLIC_DOMAIN
  await signOut({ redirectTo: domain ? `https://login.${domain}` : '/login' })
}
