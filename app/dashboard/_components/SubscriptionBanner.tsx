import type { Subscription } from '@prisma/client'

type Props = { sub: Subscription | null }

export default function SubscriptionBanner({ sub }: Props) {
  const now = new Date()

  if (!sub) {
    return (
      <div
        className="mb-6 flex items-center gap-3 px-5 py-3 rounded-xl font-mono text-xs"
        style={{ background: 'rgba(107,114,128,0.1)', border: '1px solid rgba(107,114,128,0.2)', color: '#9ca3af' }}
      >
        Sin suscripción activa. Contactá al administrador.
      </div>
    )
  }

  const daysLeft  = Math.ceil((sub.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  const isExpired = daysLeft <= 0 || sub.status !== 'ACTIVE'
  const isWarn    = !isExpired && daysLeft <= 7

  if (!isExpired && !isWarn) return null

  return (
    <div
      className="mb-6 flex flex-col sm:flex-row sm:items-center gap-2 px-5 py-3 rounded-xl font-mono text-xs"
      style={{
        background: isExpired ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)',
        border:     isExpired ? '1px solid rgba(239,68,68,0.25)' : '1px solid rgba(245,158,11,0.25)',
        color:      isExpired ? '#fca5a5' : '#fcd34d',
      }}
    >
      <span className="flex-1">
        {isExpired
          ? `Tu suscripción venció el ${sub.expiresAt.toLocaleDateString('es-AR')}. Renovála para seguir usando el dashboard.`
          : `Tu suscripción vence en ${daysLeft} día${daysLeft !== 1 ? 's' : ''} (${sub.expiresAt.toLocaleDateString('es-AR')}). ¡Renovála pronto!`}
      </span>
      <span className="text-slate-500 hidden sm:block">
        Alta: {sub.startDate.toLocaleDateString('es-AR')}
      </span>
    </div>
  )
}
