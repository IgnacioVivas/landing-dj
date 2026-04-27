'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useUploadThing } from '@/lib/uploadthing'

type Props = {
  label: string
  initialUrl: string | null
  onSave: (url: string | null) => Promise<{ error: string } | { success: true }>
  aspect?: string
}

export default function PhotoUploader({ label, initialUrl, onSave, aspect = 'aspect-square' }: Props) {
  const router = useRouter()
  const [url, setUrl] = useState<string | null>(initialUrl)
  const [error, setError] = useState<string | null>(null)
  const [removing, setRemoving] = useState(false)

  const { startUpload, isUploading } = useUploadThing('djPhoto', {
    onClientUploadComplete: useCallback(async (res: { ufsUrl: string }[]) => {
      const newUrl = res[0]?.ufsUrl
      if (!newUrl) return
      const result = await onSave(newUrl)
      if ('error' in result) { setError(result.error); return }
      setUrl(newUrl)
      setError(null)
      router.refresh()
    }, [onSave, router]),
    onUploadError: (err: Error) => setError(err.message),
  })

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

      <div className={`relative ${aspect} w-40 rounded-xl overflow-hidden`}
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        {url ? (
          <Image src={url} alt={label} fill className="object-cover" sizes="160px" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-xs text-slate-700">Sin foto</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={isUploading}
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) startUpload([file])
              e.target.value = ''
            }}
          />
          <span className="inline-flex items-center font-mono text-xs px-3 py-2 rounded-lg transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: isUploading ? '#475569' : '#e2e8f0' }}>
            {isUploading ? 'Subiendo...' : 'Cambiar foto'}
          </span>
        </label>

        {url && (
          <button
            type="button"
            disabled={removing}
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
