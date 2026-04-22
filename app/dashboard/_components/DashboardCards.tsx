'use client'

import { CalendarBlank, MusicNote, Images, Gear } from '@phosphor-icons/react'

const sections = [
  {
    Icon: CalendarBlank,
    title: 'Shows',
    description: 'Agregá, editá o eliminá fechas y eventos.',
    href: '/dashboard/shows',
    color: 'text-violet-400',
  },
  {
    Icon: MusicNote,
    title: 'Releases',
    description: 'Gestioná tus lanzamientos, links y portadas.',
    href: '/dashboard/releases',
    color: 'text-cyan-400',
  },
  {
    Icon: Images,
    title: 'Galería',
    description: 'Subí y organizá tus fotos.',
    href: '/dashboard/gallery',
    color: 'text-violet-400',
  },
  {
    Icon: Gear,
    title: 'Configuración',
    description: 'Bio, redes sociales, YouTube, Instagram.',
    href: '/dashboard/settings',
    color: 'text-cyan-400',
  },
]

export default function DashboardCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {sections.map(({ Icon, title, description, href, color }) => (
        <a
          key={href}
          href={href}
          className="group flex items-start gap-4 p-6 rounded-2xl transition-colors hover:border-white/10"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div className={`mt-0.5 ${color}`}>
            <Icon size={22} weight="duotone" />
          </div>
          <div>
            <p className="font-display text-xl text-white tracking-wider mb-1 group-hover:text-violet-300 transition-colors">
              {title}
            </p>
            <p className="font-body text-sm text-slate-500">{description}</p>
          </div>
        </a>
      ))}
    </div>
  )
}
