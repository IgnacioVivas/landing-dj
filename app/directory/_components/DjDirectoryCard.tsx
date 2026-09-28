import Image from 'next/image'
import type { ActiveDj } from '@/lib/queries/directory'
import { djOrigin } from '@/lib/site-url'

export default function DjDirectoryCard({ dj }: { dj: ActiveDj }) {
  const href  = djOrigin(dj.slug)
  if (!href) return null

  const photo  = dj.bioPhoto ?? dj.settings?.heroImageUrl ?? null
  const accent = dj.settings?.accentColor ?? '#8b5cf6'

  return (
    <a
      href={href}
      className="group relative flex flex-col rounded-2xl overflow-hidden transition-transform duration-300 hover:-translate-y-1"
      style={{ '--dj-accent': accent, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' } as React.CSSProperties}
    >
      <div className="relative aspect-square overflow-hidden">
        {photo ? (
          <Image
            src={photo}
            alt={dj.djName}
            fill
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center p-4"
            style={{ background: 'linear-gradient(160deg, #0d0221 0%, #1a0050 40%, #2d0080 70%, #3a00a0 100%)' }}
          >
            <span className="font-display text-4xl text-white/15 text-center select-none">{dj.djName}</span>
          </div>
        )}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(7,7,15,0.9) 0%, transparent 55%)' }}
        />
      </div>

      <div className="flex flex-col gap-1.5 p-5">
        <h3 className="font-display text-2xl text-white tracking-wide leading-none">{dj.djName}</h3>

        {dj.genres.length > 0 && (
          <p className="font-mono text-xs text-slate-500 tracking-wider uppercase">{dj.genres.join(' · ')}</p>
        )}

        {dj.tagline && (
          <p className="font-body text-sm text-slate-400 mt-1">{dj.tagline}</p>
        )}

        <span className="mt-3 font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--dj-accent)' }}>
          Ver perfil →
        </span>
      </div>

      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ boxShadow: 'inset 0 0 0 1px color-mix(in srgb, var(--dj-accent) 50%, transparent)' }}
      />
    </a>
  )
}
