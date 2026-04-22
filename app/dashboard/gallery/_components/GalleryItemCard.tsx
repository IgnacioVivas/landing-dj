import Image from 'next/image'
import { PencilSimple, Trash, ArrowUp, ArrowDown } from '@phosphor-icons/react/dist/ssr'
import type { GalleryDbItem } from '@/lib/queries/gallery'

const ASPECT_LABEL: Record<string, string> = {
  square:    '1:1',
  portrait:  '3:4',
  landscape: '4:3',
}

type Props = {
  item:    GalleryDbItem
  isFirst: boolean
  isLast:  boolean
  onEdit:   (item: GalleryDbItem) => void
  onDelete: (id: string)          => void
  onMove:   (id: string, dir: 'up' | 'down') => void
}

export default function GalleryItemCard({ item, isFirst, isLast, onEdit, onDelete, onMove }: Props) {
  return (
    <div
      className="flex items-center gap-4 p-3 rounded-xl"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Thumbnail */}
      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 relative">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.caption || 'Gallery'}
            fill
            className="object-cover"
            sizes="64px"
          />
        ) : (
          <div className="w-full h-full" style={{ background: item.gradient }} />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm text-white truncate">
          {item.caption || <span className="text-slate-600">Sin caption</span>}
        </p>
        <p className="font-mono text-xs text-slate-600">
          {ASPECT_LABEL[item.aspect] ?? item.aspect}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={() => onMove(item.id, 'up')}  disabled={isFirst} className="p-1.5 text-slate-600 hover:text-white disabled:opacity-20 transition-colors" aria-label="Subir"><ArrowUp size={14} /></button>
        <button onClick={() => onMove(item.id, 'down')} disabled={isLast}  className="p-1.5 text-slate-600 hover:text-white disabled:opacity-20 transition-colors" aria-label="Bajar"><ArrowDown size={14} /></button>
        <button onClick={() => onEdit(item)}   className="p-1.5 text-slate-600 hover:text-violet-400 transition-colors" aria-label="Editar"><PencilSimple size={14} /></button>
        <button onClick={() => onDelete(item.id)} className="p-1.5 text-slate-600 hover:text-red-400 transition-colors" aria-label="Eliminar"><Trash size={14} /></button>
      </div>
    </div>
  )
}
