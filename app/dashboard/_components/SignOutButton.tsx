'use client'

import { signOut } from 'next-auth/react'

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: `${window.location.origin}/login` })}
      className="font-mono text-xs text-slate-600 hover:text-red-400 transition-colors tracking-widest uppercase"
    >
      Salir
    </button>
  )
}
