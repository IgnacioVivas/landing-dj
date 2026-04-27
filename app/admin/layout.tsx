import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import SignOutButton from '@/app/dashboard/_components/SignOutButton'
import type { ReactNode } from 'react'

export const metadata = { title: 'Admin Panel' }

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') redirect('/dashboard')

  return (
    <div className="min-h-screen bg-[#07070f]">
      <header
        className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b"
        style={{
          background: 'rgba(7,7,15,0.95)',
          backdropFilter: 'blur(20px)',
          borderColor: 'rgba(255,255,255,0.05)',
        }}
      >
        <div className="flex items-center gap-6">
          <span className="font-display text-xl text-white tracking-widest">Admin</span>
          <nav className="flex items-center gap-4">
            <Link
              href="/admin"
              className="font-mono text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Overview
            </Link>
            <Link
              href="/admin/users"
              className="font-mono text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Usuarios
            </Link>
            <Link
              href="/dashboard"
              className="font-mono text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Mi Dashboard
            </Link>
          </nav>
        </div>
        <SignOutButton />
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>
    </div>
  )
}
