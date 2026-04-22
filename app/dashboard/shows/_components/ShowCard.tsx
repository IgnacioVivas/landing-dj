import { PencilSimple, Trash } from '@phosphor-icons/react/dist/ssr'
import type { ShowItem } from '@/lib/queries/shows'

type Props = {
  show: ShowItem
  onEdit: (show: ShowItem) => void
  onDelete: (id: string) => void
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('es-AR', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
    timeZone: 'UTC',
  }).format(date)
}

export default function ShowCard({ show, onEdit, onDelete }: Props) {
  const isPast = show.date < new Date()

  return (
    <div
      className="flex items-start justify-between gap-4 p-4 rounded-xl transition-colors"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex gap-4 items-start min-w-0">
        <div className="text-center min-w-[56px]">
          <p className={`font-mono text-xs font-bold ${isPast ? 'text-slate-600' : 'text-violet-400'}`}>
            {formatDate(show.date)}
          </p>
        </div>

        <div className="min-w-0">
          <p className={`font-body font-medium text-sm truncate ${isPast ? 'text-slate-500' : 'text-white'}`}>
            {show.venue}
          </p>
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

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onEdit(show)}
          className="p-2 text-slate-600 hover:text-violet-400 transition-colors"
          aria-label="Editar"
        >
          <PencilSimple size={15} />
        </button>
        <button
          onClick={() => onDelete(show.id)}
          className="p-2 text-slate-600 hover:text-red-400 transition-colors"
          aria-label="Eliminar"
        >
          <Trash size={15} />
        </button>
      </div>
    </div>
  )
}
