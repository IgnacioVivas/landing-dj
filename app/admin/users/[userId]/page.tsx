import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr'
import SubscriptionEditor from '@/app/admin/_components/SubscriptionEditor'
import EditDjForm from '@/app/admin/_components/EditDjForm'
import DeleteUserButton from '@/app/admin/_components/DeleteUserButton'

export default async function UserDetailPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params

  const user = await db.user.findUnique({
    where:  { id: userId },
    select: {
      id:           true,
      djName:       true,
      email:        true,
      slug:         true,
      createdAt:    true,
      genres:       true,
      subscription: true,
    },
  })

  if (!user) notFound()

  const now      = new Date()
  const sub      = user.subscription
  const isActive = sub && sub.status === 'ACTIVE' && sub.expiresAt > now
  const daysLeft = sub ? Math.ceil((sub.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null

  return (
    <div>
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 font-mono text-xs text-slate-500 hover:text-slate-300 transition-colors mb-8"
      >
        <ArrowLeft size={14} /> Volver
      </Link>

      <div className="mb-10">
        <h1 className="font-display text-5xl text-white tracking-wider mb-2">
          {user.djName || '(sin nombre)'}
        </h1>
        <div className="flex flex-wrap gap-4 font-mono text-xs text-slate-500">
          <span>{user.email}</span>
          <span>/dj/{user.slug}</span>
          <span>Alta: {user.createdAt.toLocaleDateString('es-AR')}</span>
        </div>
      </div>

      <div className="mb-6">
        <EditDjForm
          userId={user.id}
          initialDjName={user.djName ?? ''}
          initialEmail={user.email}
          initialSlug={user.slug ?? ''}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subscription editor */}
        <SubscriptionEditor
          userId={user.id}
          current={sub ? {
            status:    sub.status,
            startDate: sub.startDate,
            expiresAt: sub.expiresAt,
            notes:     sub.notes,
          } : null}
        />

        {/* Subscription info */}
        <div
          className="flex flex-col gap-4 p-6 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <h3 className="font-display text-xl text-white tracking-wider">Estado actual</h3>

          {sub ? (
            <div className="flex flex-col gap-3">
              {[
                { label: 'Estado',     value: sub.status === 'ACTIVE' ? 'Activo' : sub.status === 'EXPIRED' ? 'Vencido' : 'Suspendido' },
                { label: 'Inicio',     value: sub.startDate.toLocaleDateString('es-AR') },
                { label: 'Vencimiento', value: sub.expiresAt.toLocaleDateString('es-AR') },
                { label: 'Días restantes', value: daysLeft !== null ? (daysLeft > 0 ? `${daysLeft} días` : `Vencido hace ${Math.abs(daysLeft)} días`) : '—' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="font-mono text-xs text-slate-500 tracking-wider uppercase">{label}</span>
                  <span
                    className="font-mono text-xs"
                    style={{ color: label === 'Días restantes' ? (daysLeft && daysLeft > 0 ? '#22d3ee' : '#ef4444') : '#f1f5f9' }}
                  >
                    {value}
                  </span>
                </div>
              ))}
              {sub.notes && (
                <div className="mt-2 pt-3 border-t border-white/5">
                  <p className="font-mono text-xs text-slate-500 tracking-wider uppercase mb-1">Notas</p>
                  <p className="font-body text-sm text-slate-400">{sub.notes}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="font-mono text-xs text-slate-600">Sin suscripción asignada.</p>
          )}

          <div className="mt-4 pt-4 border-t border-white/5">
            <a
              href={`/dj/${user.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Ver landing → /dj/{user.slug}
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <DeleteUserButton userId={user.id} djName={user.djName || user.email} />
      </div>
    </div>
  )
}
