import { auth } from '@/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import BackButton from '@/app/dashboard/_components/BackButton'
import { DeviceMobile, Desktop, DeviceTablet } from '@phosphor-icons/react/dist/ssr'

export const metadata = { title: 'Estadísticas — DJ Panel' }

type DailyRow   = { day: Date; count: number }
type CountryRow = { country: string | null; count: number }

const UNKNOWN = '??' // sentinel for null countries

function startOf(unit: 'day' | 'week' | 'month'): Date {
  const now = new Date()
  if (unit === 'day')   return new Date(now.getFullYear(), now.getMonth(), now.getDate())
  if (unit === 'month') return new Date(now.getFullYear(), now.getMonth(), 1)
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  d.setDate(d.getDate() - d.getDay())
  return d
}

function getLast30Days(): Date[] {
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date(startOf('day'))
    d.setDate(d.getDate() - (29 - i))
    return d
  })
}

function fmtDay(d: Date) {
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
}

function countryFlag(code: string) {
  return code
    .toUpperCase()
    .split('')
    .map(c => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65))
    .join('')
}

const COUNTRY_NAMES: Record<string, string> = {
  AR: 'Argentina', US: 'Estados Unidos', MX: 'México', CO: 'Colombia',
  CL: 'Chile',     ES: 'España',         BR: 'Brasil', UY: 'Uruguay',
  PE: 'Perú',      VE: 'Venezuela',      DE: 'Alemania', GB: 'Reino Unido',
  FR: 'Francia',   IT: 'Italia',         NL: 'Países Bajos', JP: 'Japón',
  AU: 'Australia', CA: 'Canadá',         PY: 'Paraguay', BO: 'Bolivia',
}

const DEVICE_ICONS = { mobile: DeviceMobile, tablet: DeviceTablet, desktop: Desktop } as const
const DEVICE_LABELS = { mobile: 'Móvil', tablet: 'Tablet', desktop: 'Desktop' }

export default async function AnalyticsPage() {
  const session = await auth()
  if (!session?.user.id) redirect('/login')

  const userId = session.user.id
  const now    = new Date()
  const ago30  = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const [total, thisMonth, thisWeek, today, rawDaily, deviceGroups, rawCountries] = await Promise.all([
    db.pageView.count({ where: { userId } }),
    db.pageView.count({ where: { userId, createdAt: { gte: startOf('month') } } }),
    db.pageView.count({ where: { userId, createdAt: { gte: startOf('week')  } } }),
    db.pageView.count({ where: { userId, createdAt: { gte: startOf('day')   } } }),
    db.$queryRaw<DailyRow[]>`
      SELECT DATE_TRUNC('day', "createdAt") AS day, COUNT(*)::int AS count
      FROM "PageView"
      WHERE "userId" = ${userId} AND "createdAt" >= ${ago30}
      GROUP BY day ORDER BY day
    `,
    db.pageView.groupBy({
      by:    ['device'],
      where: { userId },
      _count: { device: true },
      orderBy: { _count: { device: 'desc' } },
    }),
    db.$queryRaw<CountryRow[]>`
      SELECT country, COUNT(*)::int AS count
      FROM "PageView"
      WHERE "userId" = ${userId}
      GROUP BY country ORDER BY count DESC LIMIT 10
    `,
  ])

  // Bar chart data
  const dailyMap = new Map(rawDaily.map(r => [r.day.toISOString().slice(0, 10), r.count]))
  const days     = getLast30Days()
  const counts   = days.map(d => dailyMap.get(d.toISOString().slice(0, 10)) ?? 0)
  const maxCount = Math.max(...counts, 1)

  // Normalize: null country → UNKNOWN sentinel
  const countries = rawCountries.map(r => ({
    country: r.country ?? UNKNOWN,
    count:   r.count,
  }))

  return (
    <div>
      <BackButton />
      <div className="mb-10">
        <h2 className="font-display text-4xl text-white tracking-wider mb-1">Estadísticas</h2>
        <p className="font-mono text-xs text-slate-500">Visitas a tu landing page.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total visitas', value: total     },
          { label: 'Este mes',      value: thisMonth },
          { label: 'Esta semana',   value: thisWeek  },
          { label: 'Hoy',           value: today     },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col gap-1 p-5 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <span className="font-display text-4xl leading-none" style={{ color: 'var(--dj-accent)' }}>
              {value}
            </span>
            <span className="font-mono text-xs text-slate-500 tracking-wider">{label}</span>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div
        className="p-6 rounded-2xl mb-6"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <p className="font-mono text-xs text-slate-500 tracking-widest uppercase mb-6">Últimos 30 días</p>

        {total === 0 ? (
          <p className="font-mono text-xs text-slate-600 text-center py-10">
            Todavía no hay visitas registradas.
          </p>
        ) : (
          <>
            <div className="flex items-end gap-1 h-32">
              {counts.map((count, i) => (
                <div key={i} className="flex-1 flex flex-col items-center group relative">
                  <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center pointer-events-none z-10">
                    <div
                      className="font-mono text-xs px-2 py-1 rounded-lg whitespace-nowrap"
                      style={{ background: 'rgba(255,255,255,0.08)', color: '#f1f5f9' }}
                    >
                      {count} · {fmtDay(days[i])}
                    </div>
                  </div>
                  <div
                    className="w-full rounded-t-sm"
                    style={{
                      height:     `${Math.max((count / maxCount) * 100, count > 0 ? 4 : 0)}%`,
                      minHeight:  count > 0 ? '3px' : '1px',
                      background: count > 0 ? 'var(--dj-accent)' : 'rgba(255,255,255,0.05)',
                      opacity:    count > 0 ? 0.85 : 1,
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {[0, 14, 29].map(i => (
                <span key={i} className="font-mono text-xs text-slate-600">{fmtDay(days[i])}</span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Devices + Countries — side by side on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Devices */}
        {deviceGroups.length > 0 && (
          <div
            className="p-6 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <p className="font-mono text-xs text-slate-500 tracking-widest uppercase mb-5">Dispositivos</p>
            <div className="flex flex-col gap-4">
              {deviceGroups.map(({ device, _count }) => {
                const Icon  = DEVICE_ICONS[device as keyof typeof DEVICE_ICONS] ?? Desktop
                const label = DEVICE_LABELS[device as keyof typeof DEVICE_LABELS] ?? device
                const count = _count.device
                const pct   = total > 0 ? Math.round((count / total) * 100) : 0
                return (
                  <div key={device} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon size={14} className="text-slate-500" />
                        <span className="font-mono text-xs text-slate-400">{label}</span>
                      </div>
                      <span className="font-mono text-xs text-slate-500">{count} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'var(--dj-accent)' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Countries */}
        {countries.length > 0 && (
          <div
            className="p-6 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="flex items-center justify-between mb-5">
              <p className="font-mono text-xs text-slate-500 tracking-widest uppercase">Países</p>
              {countries.some(c => c.country === UNKNOWN) && (
                <p className="font-mono text-xs text-slate-600">
                  * detección activa en producción
                </p>
              )}
            </div>
            <div className="flex flex-col gap-3">
              {countries.map(({ country: code, count }) => {
                const isUnknown = code === UNKNOWN
                const name      = isUnknown ? 'Desconocido' : (COUNTRY_NAMES[code] ?? code)
                const pct       = total > 0 ? Math.round((count / total) * 100) : 0
                return (
                  <div key={code} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isUnknown
                          ? <span className="font-mono text-sm text-slate-600">?</span>
                          : <span className="text-base leading-none">{countryFlag(code)}</span>
                        }
                        <span className="font-mono text-xs text-slate-400">{name}</span>
                      </div>
                      <span className="font-mono text-xs text-slate-500">{count} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width:      `${pct}%`,
                          background: isUnknown ? 'rgba(255,255,255,0.15)' : 'var(--dj-accent2, var(--dj-accent))',
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
