import Image from 'next/image'
import { PencilSimple, Trash, Star } from '@phosphor-icons/react/dist/ssr'
import type { ShowItem } from '@/lib/queries/shows'

type Props = {
  show: ShowItem
  showsMode: 'list' | 'flyer'
  onEdit:    (show: ShowItem) => void
  onDelete:  (id: string) => void
  onFeature: (id: string) => void
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC',
  }).format(date)
}

export default function ShowCard({ show, showsMode, onEdit, onDelete, onFeature }: Props) {
  const isPast = show.date < new Date()

  return (
    <div
      className="flex items-start justify-between gap-4 p-4 rounded-xl transition-colors"
      style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${show.isFeatured ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.06)'}` }}
    >
      <div className="flex gap-4 items-start min-w-0">
        {showsMode === 'flyer' && (
          <div
            className="relative w-10 aspect-[3/4] rounded-md overflow-hidden shrink-0"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            {show.flyerUrl ? (
              <Image src={show.flyerUrl} alt="Flyer" fill className="object-cover" sizes="40px" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-[8px] text-slate-700">IMG</span>
              </div>
            )}
          </div>
        )}

        <div className="text-center min-w-[56px]">
          <p className={`font-mono text-xs font-bold ${isPast ? 'text-slate-600' : 'text-violet-400'}`}>
            {formatDate(show.date)}
          </p>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className={`font-body font-medium text-sm truncate ${isPast ? 'text-slate-500' : 'text-white'}`}>
              {show.venue}
            </p>
            {show.isFeatured && !isPast && (
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded tracking-wider"
                style={{ color: '#a78bfa', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}>
                COUNTDOWN
              </span>
            )}
          </div>
          <p className="font-mono text-xs text-slate-600">
            {show.city}, {show.country}
            {show.festival && ` · ${show.festival}`}
          </p>
          {show.isSoldOut && (
            <span className="inline-block mt-1 font-mono text-[10px] text-red-400 border border-red-400/30 rounded px-1.5 py-0.5">
              SOLD OUT
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {!isPast && (
          <button
            onClick={() => onFeature(show.id)}
            className="p-2 transition-colors"
            aria-label={show.isFeatured ? 'Quitar del countdown' : 'Usar en countdown'}
            title={show.isFeatured ? 'Quitar del countdown' : 'Usar en countdown'}
            style={{ color: show.isFeatured ? '#a78bfa' : '#334155' }}
          >
            <Star size={15} weight={show.isFeatured ? 'fill' : 'regular'} />
          </button>
        )}
        <button onClick={() => onEdit(show)} className="p-2 text-slate-600 hover:text-violet-400 transition-colors" aria-label="Editar">
          <PencilSimple size={15} />
        </button>
        <button onClick={() => onDelete(show.id)} className="p-2 text-slate-600 hover:text-red-400 transition-colors" aria-label="Eliminar">
          <Trash size={15} />
        </button>
      </div>
    </div>
  )
}
