'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from '@phosphor-icons/react'
import type { ReleaseItem } from '@/lib/queries/releases'
import type { ReleaseInput } from '@/lib/validations/release'
import { createReleaseAction, updateReleaseAction, deleteReleaseAction, reorderReleasesAction } from '../actions'
import Dialog from '@/app/dashboard/_components/Dialog'
import ReleaseForm from './ReleaseForm'
import ReleaseCard from './ReleaseCard'

function toFormValues(r: ReleaseItem): ReleaseInput {
  return {
    title:         r.title,
    type:          r.type as ReleaseInput['type'],
    year:          r.year,
    label:         r.label         ?? '',
    coverGradient: r.coverGradient,
    spotifyUrl:    r.spotifyUrl    ?? '',
    soundcloudUrl: r.soundcloudUrl ?? '',
    appleMusicUrl: r.appleMusicUrl ?? '',
    beatportUrl:   r.beatportUrl   ?? '',
  }
}

type DialogState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; release: ReleaseItem }

export default function ReleaseList({ releases: initial }: { releases: ReleaseItem[] }) {
  const router = useRouter()
  const [releases, setReleases] = useState(initial)
  const [dialog, setDialog]     = useState<DialogState>({ mode: 'closed' })
  const [error, setError]       = useState<string | null>(null)

  const close = useCallback(() => setDialog({ mode: 'closed' }), [])

  async function handleCreate(data: ReleaseInput) {
    const result = await createReleaseAction(data)
    if ('error' in result) { setError(result.error); return }
    close()
    router.refresh()
  }

  async function handleUpdate(data: ReleaseInput) {
    if (dialog.mode !== 'edit') return
    const result = await updateReleaseAction(dialog.release.id, data)
    if ('error' in result) { setError(result.error); return }
    close()
    router.refresh()
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este lanzamiento?')) return
    const result = await deleteReleaseAction(id)
    if ('error' in result) { setError(result.error); return }
    router.refresh()
  }

  async function handleMove(id: string, dir: 'up' | 'down') {
    const idx = releases.findIndex(r => r.id === id)
    if (idx === -1) return
    const next = dir === 'up' ? idx - 1 : idx + 1
    if (next < 0 || next >= releases.length) return

    const reordered = [...releases]
    ;[reordered[idx], reordered[next]] = [reordered[next], reordered[idx]]
    setReleases(reordered)

    await reorderReleasesAction(reordered.map(r => r.id))
    router.refresh()
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-4xl text-white tracking-wider mb-1">Releases</h2>
          <p className="font-mono text-xs text-slate-500">Gestioná tus lanzamientos.</p>
        </div>
        <button
          onClick={() => { setError(null); setDialog({ mode: 'create' }) }}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-body text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={15} weight="bold" />
          Agregar
        </button>
      </div>

      {error && <p className="font-mono text-xs text-red-400 mb-4">{error}</p>}

      {releases.length === 0 && (
        <p className="font-mono text-xs text-slate-600 text-center py-16">
          No hay lanzamientos todavía.
        </p>
      )}

      <div className="flex flex-col gap-2">
        {releases.map((r, i) => (
          <ReleaseCard
            key={r.id}
            release={r}
            isFirst={i === 0}
            isLast={i === releases.length - 1}
            onEdit={rel => { setError(null); setDialog({ mode: 'edit', release: rel }) }}
            onDelete={handleDelete}
            onMove={handleMove}
          />
        ))}
      </div>

      <Dialog
        open={dialog.mode !== 'closed'}
        onClose={close}
        title={dialog.mode === 'edit' ? 'Editar lanzamiento' : 'Nuevo lanzamiento'}
      >
        {dialog.mode === 'create' && (
          <ReleaseForm onSubmit={handleCreate} submitLabel="Agregar" />
        )}
        {dialog.mode === 'edit' && (
          <ReleaseForm
            key={dialog.release.id}
            defaultValues={toFormValues(dialog.release)}
            onSubmit={handleUpdate}
            submitLabel="Guardar cambios"
          />
        )}
      </Dialog>
    </>
  )
}
