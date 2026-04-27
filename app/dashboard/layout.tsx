import { auth } from '@/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import SignOutButton from './_components/SignOutButton'
import SubscriptionBanner from './_components/SubscriptionBanner'
import Link from 'next/link'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'Dashboard — DJ Panel',
}

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')

  const [settings, sub] = await Promise.all([
    db.djSettings.findUnique({
      where:  { userId: session.user.id },
      select: { accentColor: true, accentColor2: true },
    }),
    db.subscription.findUnique({ where: { userId: session.user.id } }),
  ])

  // Auto-expire: if status is still ACTIVE but expiresAt has passed, update DB
  if (sub && sub.status === 'ACTIVE' && sub.expiresAt < new Date()) {
    await db.subscription.update({
      where: { userId: session.user.id },
      data:  { status: 'EXPIRED' },
    })
    sub.status = 'EXPIRED'
  }

  const accentColor  = settings?.accentColor  ?? '#8b5cf6'
  const accentColor2 = settings?.accentColor2 ?? '#22d3ee'

  return (
    <div className="min-h-screen bg-[#07070f]">
      <style>{`
        :root {
          --dj-accent:  ${accentColor};
          --dj-accent2: ${accentColor2};
        }
      `}</style>

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
          {session.user.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="font-mono text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Admin ↗
            </Link>
          )}
          <a
            href={`/dj/${session.user.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            /dj/{session.user.slug} ↗
          </a>
          <SignOutButton />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {session.user.role === 'DJ' && <SubscriptionBanner sub={sub} />}
        {children}
      </main>
    </div>
  )
}
