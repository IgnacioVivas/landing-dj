import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import SignOutButton from './_components/SignOutButton'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'Dashboard — DJ Panel',
}

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')

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
        <span className="font-display text-xl text-white tracking-widest">
          {session.user.name ?? 'Dashboard'}
        </span>

        <div className="flex items-center gap-6">
          <a
            href={`/dj/${session.user.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-slate-500 hover:text-violet-400 transition-colors"
          >
            /dj/{session.user.slug} ↗
          </a>
          <SignOutButton />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">{children}</main>
    </div>
  )
}
