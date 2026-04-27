import { db } from '@/lib/db'
import Link from 'next/link'
import { Plus } from '@phosphor-icons/react/dist/ssr'

export default async function AdminUsersPage() {
  const now = new Date()

  const users = await db.user.findMany({
    where:   { role: 'DJ' },
    select: {
      id:           true,
      djName:       true,
      email:        true,
      slug:         true,
      createdAt:    true,
      subscription: {
        select: { status: true, expiresAt: true, startDate: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-5xl text-white tracking-wider mb-2">Usuarios</h1>
          <p className="font-mono text-sm text-slate-500">{users.length} DJ{users.length !== 1 ? 's' : ''} registrados</p>
        </div>
        <Link
          href="/admin/users/new"
          className="inline-flex items-center gap-2 font-mono text-sm px-5 py-2.5 rounded-xl text-white transition-all hover:brightness-110"
          style={{ background: '#8b5cf6' }}
        >
          <Plus size={16} />
          Nuevo DJ
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {users.map((user) => {
          const sub      = user.subscription
          const isActive = sub && sub.status === 'ACTIVE' && sub.expiresAt > now
          const isStale  = sub && sub.expiresAt < new Date(now.getTime() - 5 * 30 * 24 * 60 * 60 * 1000)

          const badgeText  = !sub       ? 'Sin suscripción'     :
                             isStale    ? '5+ meses sin renovar' :
                             isActive   ? 'Activo'              :
                             sub.status === 'SUSPENDED' ? 'Suspendido' : 'Vencido'

          const badgeColor = !sub       ? 'rgba(107,114,128,0.15)' :
                             isStale    ? 'rgba(239,68,68,0.15)'   :
                             isActive   ? 'rgba(34,211,238,0.15)'  :
                             sub.status === 'SUSPENDED' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)'

          const badgeFg    = !sub       ? '#6b7280' :
                             isStale    ? '#ef4444' :
                             isActive   ? '#22d3ee' :
                             sub.status === 'SUSPENDED' ? '#f59e0b' : '#ef4444'

          return (
            <Link
              key={user.id}
              href={`/admin/users/${user.id}`}
              className="flex items-center justify-between p-5 rounded-2xl transition-colors hover:bg-white/5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex flex-col gap-0.5">
                <p className="font-body text-white">{user.djName || '(sin nombre)'}</p>
                <p className="font-mono text-xs text-slate-500">{user.email}</p>
                <p className="font-mono text-xs text-slate-600">/dj/{user.slug}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span
                  className="font-mono text-xs px-2.5 py-1 rounded-full"
                  style={{ background: badgeColor, color: badgeFg }}
                >
                  {badgeText}
                </span>
                {sub && (
                  <p className="font-mono text-xs text-slate-600">
                    Vence: {sub.expiresAt.toLocaleDateString('es-AR')}
                  </p>
                )}
              </div>
            </Link>
          )
        })}

        {users.length === 0 && (
          <p className="font-mono text-sm text-slate-600 text-center py-16">
            No hay DJs registrados todavía.
          </p>
        )}
      </div>
    </div>
  )
}
