'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from '@phosphor-icons/react'
import type { ShowItem } from '@/lib/queries/shows'
import type { ShowInput } from '@/lib/validations/show'
import { createShowAction, updateShowAction, deleteShowAction } from '../actions'
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

export default function ShowList({ shows, showsMode }: Props) {
  const router = useRouter()
  const [dialog, setDialog] = useState<DialogState>({ mode: 'closed' })
  const [error, setError] = useState<string | null>(null)

  const close = useCallback(() => setDialog({ mode: 'closed' }), [])

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

  const upcoming = shows.filter(s => s.date >= new Date())
  const past      = shows.filter(s => s.date <  new Date())

  return (
    <>
      <BackButton />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-4xl text-white tracking-wider mb-1">Shows</h2>
          <p className="font-mono text-xs text-slate-500">
            Modo: <span className="text-slate-400">{showsMode === 'flyer' ? 'Flyers' : 'Lista'}</span>
            {' · '}
            <a href="/dashboard/settings" className="text-violet-400 hover:text-violet-300 transition-colors">
              Cambiar en Configuración
            </a>
          </p>
        </div>
        <button
          onClick={() => { setError(null); setDialog({ mode: 'create' }) }}
          className="btn-accent flex items-center gap-2 text-white font-body text-sm font-medium px-4 py-2.5 rounded-lg"
        >
          <Plus size={15} weight="bold" />
          Agregar
        </button>
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
