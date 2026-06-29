'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { uploadFile } from '@/lib/uploadthing'

type Props = {
  label: string
  initialUrl: string | null
  onSave: (url: string | null) => Promise<{ error: string } | { success: true }>
}

export default function VideoUploader({ label, initialUrl, onSave }: Props) {
  const router = useRouter()
  const [url, setUrl]           = useState<string | null>(initialUrl)
  const [error, setError]       = useState<string | null>(null)
  const [status, setStatus]     = useState<'idle' | 'uploading'>('idle')
  const [removing, setRemoving] = useState(false)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setStatus('uploading')
    setError(null)
    try {
      const newUrl = await uploadFile(file)
      const result = await onSave(newUrl)
      if ('error' in result) { setError(result.error); return }
      setUrl(newUrl)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir')
    } finally {
      setStatus('idle')
    }
  }

  async function handleRemove() {
    setRemoving(true)
    const result = await onSave(null)
    if ('error' in result) { setError(result.error); setRemoving(false); return }
    setUrl(null)
    setError(null)
    setRemoving(false)
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="font-mono text-xs text-slate-500 tracking-widest uppercase">{label}</p>

      <div
        className="relative w-40 aspect-video rounded-xl overflow-hidden flex items-center justify-center"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {url ? (
          <video
            src={url}
            className="absolute inset-0 w-full h-full object-cover"
            muted
            loop
            autoPlay
            playsInline
          />
        ) : (
          <span className="font-mono text-xs text-slate-700">Sin video</span>
        )}
      </div>

      <div className="flex gap-2">
        <label className="cursor-pointer">
          <input
            type="file"
            accept="video/mp4,video/webm"
            className="sr-only"
            disabled={status !== 'idle'}
            onChange={handleFile}
          />
          <span
            className="inline-flex items-center font-mono text-xs px-3 py-2 rounded-lg transition-colors"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: status !== 'idle' ? '#475569' : '#e2e8f0',
            }}
          >
            {status === 'uploading' ? 'Subiendo...' : url ? 'Cambiar video' : 'Subir video'}
          </span>
        </label>

        {url && (
          <button
            type="button"
            disabled={removing || status !== 'idle'}
            onClick={handleRemove}
            className="font-mono text-xs px-3 py-2 rounded-lg text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {removing ? '...' : 'Eliminar'}
          </button>
        )}
      </div>

      {error && <p className="font-mono text-xs text-red-400">{error}</p>}
    </div>
  )
}
