'use client'

import { signOutAction } from './sign-out-action'

export default function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="font-mono text-xs text-slate-600 hover:text-red-400 transition-colors tracking-widest uppercase"
      >
        Salir
      </button>
    </form>
  )
}
