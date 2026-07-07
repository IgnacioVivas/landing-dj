'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import imageCompression from 'browser-image-compression'
import { uploadFile } from '@/lib/uploadthing'
import type { GalleryDbItem } from '@/lib/queries/gallery'
import { createGalleryItemAction, updateGalleryItemAction, deleteGalleryItemAction, reorderGalleryAction, updateGalleryModeAction } from '../actions'
import Dialog from '@/app/dashboard/_components/Dialog'
import { Field, inputClass, selectClass, SelectWrapper } from '@/app/dashboard/_components/Field'
import GalleryUploader, { type UploadResult } from './GalleryUploader'
import GalleryItemCard from './GalleryItemCard'
import BackButton from '@/app/dashboard/_components/BackButton'

const GALLERY_LIMIT = 12

const ASPECT_OPTIONS = [
  { value: 'square',    label: 'Cuadrado (1:1)' },
  { value: 'portrait',  label: 'Portrait (3:4)' },
  { value: 'landscape', label: 'Landscape (4:3)' },
]

type EditState = {
  id: string
  caption: string
  captionEn: string
  aspect: string
  videoUrl: string | null
  videoThumbnailUrl: string | null
} | null

function ThumbnailUploader({ value, onChange }: { value: string | null; onChange: (url: string | null) => void }) {
  const [status, setStatus] = useState<'idle' | 'compressing' | 'uploading'>('idle')
  const [error,  setError]  = useState<string | null>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setStatus('compressing')
    setError(null)
    try {
      const compressed = await imageCompression(file, { maxSizeMB: 0.8, maxWidthOrHeight: 1280, useWebWorker: true })
      setStatus('uploading')
      const url = await uploadFile(new File([compressed], file.name, { type: compressed.type }))
      onChange(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir')
    } finally {
      setStatus('idle')
    }
  }

  return (
    <Field label="Foto de portada" hint="Se muestra como preview del video antes de reproducirlo.">
      <div className="flex items-start gap-3">
        {value && (
          <div className="relative w-20 aspect-square rounded-lg overflow-hidden shrink-0">
            <Image src={value} alt="Portada" fill unoptimized className="object-cover" sizes="80px" />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <label className="cursor-pointer">
            <input type="file" accept="image/*" className="sr-only" disabled={status !== 'idle'} onChange={handleFile} />
            <span
              className="inline-flex items-center font-mono text-xs px-3 py-2 rounded-lg transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: status !== 'idle' ? '#475569' : '#e2e8f0' }}
            >
              {status === 'compressing' ? 'Comprimiendo...' : status === 'uploading' ? 'Subiendo...' : value ? 'Cambiar portada' : 'Subir portada'}
            </span>
          </label>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="font-mono text-xs text-red-400 hover:text-red-300 transition-colors text-left"
            >
              Eliminar portada
            </button>
          )}
        </div>
      </div>
      {error && <p className="font-mono text-xs text-red-400 mt-1">{error}</p>}
    </Field>
  )
}

function EditDialog({
  state,
  isVideo = false,
  onClose,
  onSave,
  title = 'Editar elemento',
}: {
  state: EditState
  isVideo?: boolean
  onClose: () => void
  onSave: (caption: string, captionEn: string, aspect: string, videoThumbnailUrl: string | null) => Promise<void>
  title?: string
}) {
  const [caption,   setCaption]   = useState(state?.caption   ?? '')
  const [captionEn, setCaptionEn] = useState(state?.captionEn ?? '')
  const [aspect,    setAspect]    = useState(state?.aspect    ?? 'square')
  const [thumbnailUrl, setThumbnailUrl] = useState(state?.videoThumbnailUrl ?? null)
  const [saving,    setSaving]    = useState(false)

  async function handleSave() {
    setSaving(true)
    await onSave(caption, captionEn, aspect, thumbnailUrl)
    setSaving(false)
  }

  return (
    <Dialog open={!!state} onClose={onClose} title={title}>
      <div className="flex flex-col gap-4">
        {isVideo && <ThumbnailUploader value={thumbnailUrl} onChange={setThumbnailUrl} />}
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

type Props = {
  items: GalleryDbItem[]
  galleryMode: 'grid' | 'carousel'
}

export default function GalleryGrid({ items: initial, galleryMode: initialGalleryMode }: Props) {
  const router  = useRouter()
  const [items,   setItems]   = useState(initial)
  const [editing, setEditing] = useState<EditState>(null)
  const [pending, setPending] = useState<UploadResult | null>(null)
  const [error,   setError]   = useState<string | null>(null)
  const [saved,   setSaved]   = useState(false)
  const [galleryMode, setGalleryMode] = useState(initialGalleryMode)
  const [changingMode, setChangingMode] = useState(false)

  const closeEdit = useCallback(() => setEditing(null), [])

  async function handleModeChange(mode: 'grid' | 'carousel') {
    if (mode === galleryMode || changingMode) return
    setChangingMode(true)
    setError(null)
    const result = await updateGalleryModeAction(mode)
    setChangingMode(false)
    if ('error' in result) { setError(result.error); return }
    setGalleryMode(mode)
    router.refresh()
  }

  function handleUploaded(result: UploadResult) {
    setPending(result)
  }

  async function handleConfirmUpload(caption: string, captionEn: string, aspect: string, videoThumbnailUrl: string | null) {
    if (!pending) return
    const imageUrl = pending.mediaType === 'image' ? pending.url : null
    const videoUrl = pending.mediaType === 'video' ? pending.url : null
    const result = await createGalleryItemAction(imageUrl, videoUrl, caption, aspect, videoThumbnailUrl)
    if ('error' in result) { setError(result.error ?? null); return }
    // Update captionEn separately if provided
    if (captionEn) {
      await updateGalleryItemAction(result.item.id, caption, captionEn, aspect, videoThumbnailUrl)
    }
    setItems(prev => [...prev, { ...result.item, captionEn }])
    setPending(null)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    router.refresh()
  }

  async function handleSaveEdit(caption: string, captionEn: string, aspect: string, videoThumbnailUrl: string | null) {
    if (!editing) return
    const result = await updateGalleryItemAction(editing.id, caption, captionEn, aspect, videoThumbnailUrl)
    if ('error' in result) { setError(result.error); return }
    setItems(prev => prev.map(i => i.id === editing.id ? { ...i, caption, captionEn, aspect, videoThumbnailUrl } : i))
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
            Fotos comprimidas automáticamente · Vídeos hasta 64 MB.{' '}
            <span className={items.length >= GALLERY_LIMIT ? 'text-red-400' : 'text-slate-600'}>
              {items.length}/{GALLERY_LIMIT} elementos
            </span>
          </p>
          <p className="font-mono text-xs text-slate-600 mt-0.5">
            Carrusel: tamaño recomendado <span className="text-slate-500">900 × 1200 px (portrait 3:4)</span>
          </p>
        </div>
        {items.length < GALLERY_LIMIT && <GalleryUploader onUploaded={handleUploaded} />}
        {items.length >= GALLERY_LIMIT && (
          <p className="font-mono text-xs text-red-400">Límite alcanzado</p>
        )}
      </div>

      <div className="flex flex-col gap-3 mb-8">
        <p className="font-mono text-xs text-slate-600 tracking-widest uppercase">Modo de visualización</p>
        <div className="flex gap-2">
          {(['grid', 'carousel'] as const).map(val => (
            <button
              key={val}
              type="button"
              disabled={changingMode}
              onClick={() => handleModeChange(val)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors font-mono text-xs tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: galleryMode === val ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: galleryMode === val ? '#e2e8f0' : '#475569',
              }}
            >
              {val === 'grid' ? 'Cuadrícula' : 'Carrusel'}
            </button>
          ))}
        </div>
        <p className="font-mono text-xs text-slate-700">
          {galleryMode === 'carousel' ? 'Galería horizontal tipo carrusel.' : 'Galería en cuadrícula masonry.'}
        </p>
      </div>

      {error && <p className="font-mono text-xs text-red-400 mb-4">{error}</p>}
      {saved && <p className="font-mono text-xs text-cyan-400 mb-4">Imagen guardada.</p>}

      {items.length === 0 && (
        <p className="font-mono text-xs text-slate-600 text-center py-16">
          No hay elementos todavía.
        </p>
      )}

      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <GalleryItemCard
            key={item.id}
            item={item}
            isFirst={i === 0}
            isLast={i === items.length - 1}
            onEdit={it => setEditing({ id: it.id, caption: it.caption, captionEn: it.captionEn, aspect: it.aspect, videoUrl: it.videoUrl, videoThumbnailUrl: it.videoThumbnailUrl })}
            onDelete={handleDelete}
            onMove={handleMove}
          />
        ))}
      </div>

      <EditDialog state={editing} isVideo={!!editing?.videoUrl} onClose={closeEdit} onSave={handleSaveEdit} />

      {pending && (
        <EditDialog
          state={{ id: '', caption: '', captionEn: '', aspect: 'square', videoUrl: pending.mediaType === 'video' ? pending.url : null, videoThumbnailUrl: null }}
          isVideo={pending.mediaType === 'video'}
          onClose={() => setPending(null)}
          onSave={handleConfirmUpload}
          title={`Agregar ${pending.mediaType === 'video' ? 'video' : 'foto'}`}
        />
      )}
    </>
  )
}
