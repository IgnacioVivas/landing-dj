'use client'

import { handleSignOut } from '@/lib/actions/auth'

export default function SignOutButton() {
  return (
    <form action={handleSignOut}>
      <button
        type="submit"
        className="font-mono text-xs text-slate-600 hover:text-red-400 transition-colors tracking-widest uppercase"
      >
        Salir
      </button>
    </form>
  )
}
