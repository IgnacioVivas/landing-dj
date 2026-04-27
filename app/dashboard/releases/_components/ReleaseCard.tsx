import Image from 'next/image'
import { PencilSimple, Trash, ArrowUp, ArrowDown } from '@phosphor-icons/react/dist/ssr'
import type { ReleaseItem } from '@/lib/queries/releases'

type Props = {
  release: ReleaseItem
  isFirst: boolean
  isLast: boolean
  onEdit:   (r: ReleaseItem) => void
  onDelete: (id: string) => void
  onMove:   (id: string, dir: 'up' | 'down') => void
}

const TYPE_LABEL: Record<string, string> = { album: 'Álbum', ep: 'EP', single: 'Single' }

export default function ReleaseCard({ release, isFirst, isLast, onEdit, onDelete, onMove }: Props) {
  return (
    <div
      className="flex items-center gap-4 p-4 rounded-xl"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Cover preview */}
      <div className="relative w-12 h-12 rounded-lg shrink-0 overflow-hidden">
        {release.coverImageUrl ? (
          <Image
            src={release.coverImageUrl}
            alt={release.title}
            fill
            className="object-cover"
            sizes="48px"
          />
        ) : (
          <div className="absolute inset-0" style={{ background: release.coverGradient }} />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-body font-medium text-sm text-white truncate">{release.title}</p>
        <p className="font-mono text-xs text-slate-600">
          {TYPE_LABEL[release.type] ?? release.type} · {release.year}
          {release.label && ` · ${release.label}`}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onMove(release.id, 'up')}
          disabled={isFirst}
          className="p-1.5 text-slate-600 hover:text-white disabled:opacity-20 transition-colors"
          aria-label="Subir"
        >
          <ArrowUp size={14} />
        </button>
        <button
          onClick={() => onMove(release.id, 'down')}
          disabled={isLast}
          className="p-1.5 text-slate-600 hover:text-white disabled:opacity-20 transition-colors"
          aria-label="Bajar"
        >
          <ArrowDown size={14} />
        </button>
        <button
          onClick={() => onEdit(release)}
          className="p-1.5 text-slate-600 hover:text-violet-400 transition-colors"
          aria-label="Editar"
        >
          <PencilSimple size={14} />
        </button>
        <button
          onClick={() => onDelete(release.id)}
          className="p-1.5 text-slate-600 hover:text-red-400 transition-colors"
          aria-label="Eliminar"
        >
          <Trash size={14} />
        </button>
      </div>
    </div>
  )
}
