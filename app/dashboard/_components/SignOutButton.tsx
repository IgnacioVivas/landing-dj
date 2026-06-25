'use client'

import { signOut } from 'next-auth/react'

export default function SignOutButton() {
  return (
    <button
      onClick={() => {
        const domain = process.env.NEXT_PUBLIC_DOMAIN
        signOut({ callbackUrl: domain ? `https://login.${domain}` : '/login' })
      }}
      className="font-mono text-xs text-slate-600 hover:text-red-400 transition-colors tracking-widest uppercase"
    >
      Salir
    </button>
  )
}
