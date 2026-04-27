import { db } from '@/lib/db'
import Link from 'next/link'
import { Warning, Users, CheckCircle, Clock } from '@phosphor-icons/react/dist/ssr'

export default async function AdminPage() {
  const now         = new Date()
  const staleDate   = new Date(now.getTime() - 5 * 30 * 24 * 60 * 60 * 1000) // ~5 months ago
  const soonDate    = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)       // 7 days from now

  const [total, active, expiresSoon, stale] = await Promise.all([
    db.user.count({ where: { role: 'DJ' } }),
    db.subscription.count({ where: { status: 'ACTIVE', expiresAt: { gt: now } } }),
    db.subscription.count({ where: { status: 'ACTIVE', expiresAt: { lte: soonDate, gt: now } } }),
    db.subscription.count({ where: { expiresAt: { lt: staleDate } } }),
  ])

  const alerts = await db.subscription.findMany({
    where: {
      OR: [
        { status: 'ACTIVE', expiresAt: { lte: soonDate } },
        { expiresAt: { lt: staleDate } },
      ],
    },
    include: { user: { select: { djName: true, email: true, slug: true, id: true } } },
    orderBy: { expiresAt: 'asc' },
  })

  return (
    <div>
      <div className="mb-10">
        <h1 className="font-display text-5xl text-white tracking-wider mb-2">Overview</h1>
        <p className="font-mono text-sm text-slate-500">Estado general de la plataforma.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'DJs registrados', value: total,      icon: Users,         color: '#8b5cf6' },
          { label: 'Activos',          value: active,     icon: CheckCircle,   color: '#22d3ee' },
          { label: 'Vencen en 7 días', value: expiresSoon, icon: Clock,        color: '#f59e0b' },
          { label: 'Sin renovar 5m+',  value: stale,      icon: Warning,       color: '#ef4444' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="flex flex-col gap-2 p-5 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <Icon size={18} style={{ color }} />
            <span className="font-display text-4xl text-white leading-none">{value}</span>
            <span className="font-mono text-xs text-slate-500 tracking-wider">{label}</span>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div>
          <h2 className="font-display text-2xl text-white tracking-wider mb-4">Alertas</h2>
          <div className="flex flex-col gap-3">
            {alerts.map(({ user, expiresAt, status }) => {
              const isStale    = expiresAt < staleDate
              const isExpiring = !isStale && expiresAt <= soonDate
              const isPast     = expiresAt < now

              return (
                <Link
                  key={user.id}
                  href={`/admin/users/${user.id}`}
                  className="flex items-center justify-between p-4 rounded-xl transition-colors hover:bg-white/5"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div>
                    <p className="font-body text-white text-sm">{user.djName || user.email}</p>
                    <p className="font-mono text-xs text-slate-500">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className="font-mono text-xs px-2 py-1 rounded-full"
                      style={{
                        background: isStale ? 'rgba(239,68,68,0.15)' : isExpiring ? 'rgba(245,158,11,0.15)' : 'rgba(107,114,128,0.15)',
                        color:      isStale ? '#ef4444'               : isExpiring ? '#f59e0b'               : '#6b7280',
                      }}
                    >
                      {isStale    ? '5+ meses sin renovar' :
                       isPast     ? 'Vencido'              :
                       isExpiring ? 'Vence pronto'         : status}
                    </span>
                    <p className="font-mono text-xs text-slate-600 mt-1">
                      {expiresAt.toLocaleDateString('es-AR')}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      <div className="mt-8">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 font-mono text-sm px-5 py-2.5 rounded-xl text-white transition-all hover:brightness-110"
          style={{ background: '#8b5cf6' }}
        >
          Ver todos los usuarios →
        </Link>
      </div>
    </div>
  )
}
