'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from '@phosphor-icons/react'
import type { ShowItem } from '@/lib/queries/shows'
import type { ShowInput } from '@/lib/validations/show'
import { createShowAction, updateShowAction, deleteShowAction, toggleFeaturedAction, updateShowsModeAction } from '../actions'
import ShowDialog from '@/app/dashboard/_components/Dialog'
import ShowForm from './ShowForm'
import ShowCard from './ShowCard'
import BackButton from '@/app/dashboard/_components/BackButton'

function toFormValues(show: ShowItem): ShowInput {
  return {
    date:      show.date.toISOString().split('T')[0],
    venue:     show.venue,
    city:      show.city,
    country:   show.country,
    address:   show.address   ?? '',
    festival:  show.festival  ?? '',
    ticketUrl: show.ticketUrl ?? '',
    flyerUrl:  show.flyerUrl  ?? '',
    isSoldOut: show.isSoldOut,
  }
}

type DialogState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; show: ShowItem }

type Props = {
  shows: ShowItem[]
  showsMode: 'list' | 'flyer'
}

export default function ShowList({ shows, showsMode: initialShowsMode }: Props) {
  const router = useRouter()
  const [dialog, setDialog] = useState<DialogState>({ mode: 'closed' })
  const [error, setError] = useState<string | null>(null)
  const [showsMode, setShowsMode] = useState(initialShowsMode)
  const [changingMode, setChangingMode] = useState(false)

  const close = useCallback(() => setDialog({ mode: 'closed' }), [])

  async function handleModeChange(mode: 'list' | 'flyer') {
    if (mode === showsMode || changingMode) return
    setChangingMode(true)
    setError(null)
    const result = await updateShowsModeAction(mode)
    setChangingMode(false)
    if ('error' in result) { setError(result.error); return }
    setShowsMode(mode)
    router.refresh()
  }

  async function handleCreate(data: ShowInput) {
    const result = await createShowAction(data)
    if ('error' in result) { setError(result.error); return }
    close()
    router.refresh()
  }

  async function handleUpdate(data: ShowInput) {
    if (dialog.mode !== 'edit') return
    const result = await updateShowAction(dialog.show.id, data)
    if ('error' in result) { setError(result.error); return }
    close()
    router.refresh()
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este show?')) return
    const result = await deleteShowAction(id)
    if ('error' in result) { setError(result.error); return }
    router.refresh()
  }

  async function handleFeature(id: string) {
    const result = await toggleFeaturedAction(id)
    if ('error' in result) { setError(result.error); return }
    router.refresh()
  }

  const upcoming = shows.filter(s => s.date >= new Date())
  const past      = shows.filter(s => s.date <  new Date())

  return (
    <>
      <BackButton />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-4xl text-white tracking-wider mb-1">Shows</h2>
          <p className="font-mono text-xs text-slate-500">Gestioná tus fechas y elegí cómo se muestran.</p>
        </div>
        <button
          onClick={() => { setError(null); setDialog({ mode: 'create' }) }}
          className="btn-accent flex items-center gap-2 text-white font-body text-sm font-medium px-4 py-2.5 rounded-lg"
        >
          <Plus size={15} weight="bold" />
          Agregar
        </button>
      </div>

      <div className="flex flex-col gap-3 mb-8">
        <p className="font-mono text-xs text-slate-600 tracking-widest uppercase">Modo de visualización</p>
        <div className="flex gap-2">
          {(['list', 'flyer'] as const).map(val => (
            <button
              key={val}
              type="button"
              disabled={changingMode}
              onClick={() => handleModeChange(val)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors font-mono text-xs tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: showsMode === val ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: showsMode === val ? '#e2e8f0' : '#475569',
              }}
            >
              {val === 'list' ? 'Lista' : 'Flyers'}
            </button>
          ))}
        </div>
        <p className="font-mono text-xs text-slate-700">
          {showsMode === 'flyer' ? 'Cada show muestra una imagen flyer.' : 'Los shows se listan en formato tabla.'}
        </p>
      </div>

      {error && <p className="font-mono text-xs text-red-400 mb-4">{error}</p>}

      {shows.length === 0 && (
        <p className="font-mono text-xs text-slate-600 text-center py-16">No hay shows todavía.</p>
      )}

      {upcoming.length > 0 && (
        <section className="mb-8">
          <p className="font-mono text-xs text-slate-600 tracking-widest uppercase mb-3">Próximos</p>
          <div className="flex flex-col gap-2">
            {upcoming.map(show => (
              <ShowCard key={show.id} show={show} showsMode={showsMode}
                onEdit={s => { setError(null); setDialog({ mode: 'edit', show: s }) }}
                onDelete={handleDelete}
                onFeature={handleFeature}
              />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <p className="font-mono text-xs text-slate-600 tracking-widest uppercase mb-3">Pasados</p>
          <div className="flex flex-col gap-2">
            {past.map(show => (
              <ShowCard key={show.id} show={show} showsMode={showsMode}
                onEdit={s => { setError(null); setDialog({ mode: 'edit', show: s }) }}
                onDelete={handleDelete}
                onFeature={handleFeature}
              />
            ))}
          </div>
        </section>
      )}

      <ShowDialog
        open={dialog.mode !== 'closed'}
        onClose={close}
        title={dialog.mode === 'edit' ? 'Editar show' : 'Nuevo show'}
      >
        {dialog.mode === 'create' && (
          <ShowForm onSubmit={handleCreate} submitLabel="Agregar show" showFlyerUpload={showsMode === 'flyer'} />
        )}
        {dialog.mode === 'edit' && (
          <ShowForm
            key={dialog.show.id}
            defaultValues={toFormValues(dialog.show)}
            onSubmit={handleUpdate}
            submitLabel="Guardar cambios"
            showFlyerUpload={showsMode === 'flyer'}
          />
        )}
      </ShowDialog>
    </>
  )
}
