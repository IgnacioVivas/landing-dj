'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { GalleryDbItem } from '@/lib/queries/gallery'
import { createGalleryItemAction, updateGalleryItemAction, deleteGalleryItemAction, reorderGalleryAction } from '../actions'
import Dialog from '@/app/dashboard/_components/Dialog'
import { Field, inputClass, selectClass, SelectWrapper } from '@/app/dashboard/_components/Field'
import GalleryUploader from './GalleryUploader'
import GalleryItemCard from './GalleryItemCard'
import BackButton from '@/app/dashboard/_components/BackButton'

const GALLERY_LIMIT = 12

const ASPECT_OPTIONS = [
  { value: 'square',    label: 'Cuadrado (1:1)' },
  { value: 'portrait',  label: 'Portrait (3:4)' },
  { value: 'landscape', label: 'Landscape (4:3)' },
]

type EditState = { id: string; caption: string; captionEn: string; aspect: string } | null

function EditDialog({
  state,
  onClose,
  onSave,
}: {
  state: EditState
  onClose: () => void
  onSave: (caption: string, captionEn: string, aspect: string) => Promise<void>
}) {
  const [caption,   setCaption]   = useState(state?.caption   ?? '')
  const [captionEn, setCaptionEn] = useState(state?.captionEn ?? '')
  const [aspect,    setAspect]    = useState(state?.aspect    ?? 'square')
  const [saving,    setSaving]    = useState(false)

  async function handleSave() {
    setSaving(true)
    await onSave(caption, captionEn, aspect)
    setSaving(false)
  }

  return (
    <Dialog open={!!state} onClose={onClose} title="Editar imagen">
      <div className="flex flex-col gap-4">
        <Field label="Caption (Español)">
          <input
            value={caption}
            onChange={e => setCaption(e.target.value)}
            className={inputClass}
            placeholder="Berghain, Berlín 2025"
          />
        </Field>
        <Field label="Caption (English)" hint="Optional — shown when visitors switch to English.">
          <input
            value={captionEn}
            onChange={e => setCaptionEn(e.target.value)}
            className={inputClass}
            placeholder="Berghain, Berlin 2025"
          />
        </Field>
        <Field label="Formato">
          <SelectWrapper>
            <select
              value={aspect}
              onChange={e => setAspect(e.target.value)}
              className={selectClass}
            >
              {ASPECT_OPTIONS.map(o => (
                <option key={o.value} value={o.value} className="bg-[#07070f]">{o.label}</option>
              ))}
            </select>
          </SelectWrapper>
        </Field>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-accent text-white font-body font-medium py-3 rounded-lg"
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </Dialog>
  )
}

export default function GalleryGrid({ items: initial }: { items: GalleryDbItem[] }) {
  const router  = useRouter()
  const [items,   setItems]   = useState(initial)
  const [editing, setEditing] = useState<EditState>(null)
  const [pending, setPending] = useState<string | null>(null)
  const [error,   setError]   = useState<string | null>(null)
  const [saved,   setSaved]   = useState(false)

  const closeEdit = useCallback(() => setEditing(null), [])

  function handleUploaded(url: string) {
    setPending(url)
  }

  async function handleConfirmUpload(caption: string, captionEn: string, aspect: string) {
    if (!pending) return
    const result = await createGalleryItemAction(pending, caption, aspect)
    if ('error' in result) { setError(result.error ?? null); return }
    // Update captionEn separately if provided
    if (captionEn) {
      await updateGalleryItemAction(result.item.id, caption, captionEn, aspect)
    }
    setItems(prev => [...prev, { ...result.item, captionEn }])
    setPending(null)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    router.refresh()
  }

  async function handleSaveEdit(caption: string, captionEn: string, aspect: string) {
    if (!editing) return
    const result = await updateGalleryItemAction(editing.id, caption, captionEn, aspect)
    if ('error' in result) { setError(result.error); return }
    setItems(prev => prev.map(i => i.id === editing.id ? { ...i, caption, captionEn, aspect } : i))
    closeEdit()
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta imagen?')) return
    const result = await deleteGalleryItemAction(id)
    if ('error' in result) { setError(result.error); return }
    setItems(prev => prev.filter(i => i.id !== id))
  }

  async function handleMove(id: string, dir: 'up' | 'down') {
    const idx  = items.findIndex(i => i.id === id)
    const next = dir === 'up' ? idx - 1 : idx + 1
    if (next < 0 || next >= items.length) return

    const reordered = [...items]
    ;[reordered[idx], reordered[next]] = [reordered[next], reordered[idx]]
    setItems(reordered)
    await reorderGalleryAction(reordered.map(i => i.id))
    router.refresh()
  }

  return (
    <>
      <BackButton />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-4xl text-white tracking-wider mb-1">Galería</h2>
          <p className="font-mono text-xs text-slate-500">
            Las fotos se comprimen automáticamente.{' '}
            <span className={items.length >= GALLERY_LIMIT ? 'text-red-400' : 'text-slate-600'}>
              {items.length}/{GALLERY_LIMIT} imágenes
            </span>
          </p>
        </div>
        {items.length < GALLERY_LIMIT && <GalleryUploader onUploaded={handleUploaded} />}
        {items.length >= GALLERY_LIMIT && (
          <p className="font-mono text-xs text-red-400">Límite alcanzado</p>
        )}
      </div>

      {error && <p className="font-mono text-xs text-red-400 mb-4">{error}</p>}
      {saved && <p className="font-mono text-xs text-cyan-400 mb-4">Imagen guardada.</p>}

      {items.length === 0 && (
        <p className="font-mono text-xs text-slate-600 text-center py-16">
          No hay fotos todavía.
        </p>
      )}

      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <GalleryItemCard
            key={item.id}
            item={item}
            isFirst={i === 0}
            isLast={i === items.length - 1}
            onEdit={it => setEditing({ id: it.id, caption: it.caption, captionEn: it.captionEn, aspect: it.aspect })}
            onDelete={handleDelete}
            onMove={handleMove}
          />
        ))}
      </div>

      <EditDialog state={editing} onClose={closeEdit} onSave={handleSaveEdit} />

      {pending && (
        <EditDialog
          state={{ id: '', caption: '', captionEn: '', aspect: 'square' }}
          onClose={() => setPending(null)}
          onSave={handleConfirmUpload}
        />
      )}
    </>
  )
}
