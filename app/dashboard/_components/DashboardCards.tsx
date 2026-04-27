import { CalendarBlank, MusicNote, Images, Gear, ChartBar } from '@phosphor-icons/react/dist/ssr'

type Counts = {
  upcomingShows: number
  releases:      number
  gallery:       number
  totalViews:    number
}

function stat(n: number, singular: string, plural: string, zero?: string): string {
  if (n === 0)  return zero ?? `Sin ${plural}`
  if (n === 1)  return `1 ${singular}`
  return `${n.toLocaleString('es-AR')} ${plural}`
}

export default function DashboardCards({ counts }: { counts: Counts }) {
  const sections = [
    {
      Icon:        CalendarBlank,
      title:       'Shows',
      description: 'Agregá, editá o eliminá fechas y eventos.',
      stat:        stat(counts.upcomingShows, 'próximo', 'próximos'),
      href:        '/dashboard/shows',
      accentVar:   '--dj-accent',
    },
    {
      Icon:        MusicNote,
      title:       'Releases',
      description: 'Gestioná tus lanzamientos, links y portadas.',
      stat:        stat(counts.releases, 'lanzamiento', 'lanzamientos'),
      href:        '/dashboard/releases',
      accentVar:   '--dj-accent2',
    },
    {
      Icon:        Images,
      title:       'Galería',
      description: 'Subí y organizá tus fotos.',
      stat:        `${counts.gallery} / 12`,
      href:        '/dashboard/gallery',
      accentVar:   '--dj-accent',
    },
    {
      Icon:        ChartBar,
      title:       'Estadísticas',
      description: 'Visitas a tu landing, dispositivos y más.',
      stat:        stat(counts.totalViews, 'visita', 'visitas'),
      href:        '/dashboard/analytics',
      accentVar:   '--dj-accent2',
    },
    {
      Icon:        Gear,
      title:       'Configuración',
      description: 'Bio, redes sociales, YouTube, Instagram.',
      stat:        null,
      href:        '/dashboard/settings',
      accentVar:   '--dj-accent',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {sections.map(({ Icon, title, description, stat: statText, href, accentVar }) => (
        <a
          key={href}
          href={href}
          className="group card-link flex items-start gap-4 p-6 rounded-2xl transition-colors hover:border-white/10"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            ['--card-accent' as string]: `var(${accentVar})`,
          }}
        >
          <div className="mt-0.5 shrink-0" style={{ color: `var(${accentVar})` }}>
            <Icon size={22} weight="duotone" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="card-link-title font-display text-xl text-white tracking-wider mb-1">
              {title}
            </p>
            <p className="font-body text-sm text-slate-500">{description}</p>
            {statText && (
              <p className="font-mono text-xs mt-2" style={{ color: `var(${accentVar})`, opacity: 0.8 }}>
                {statText}
              </p>
            )}
          </div>
        </a>
      ))}
    </div>
  )
}
