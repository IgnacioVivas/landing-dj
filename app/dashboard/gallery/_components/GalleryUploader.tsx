'use client'

import { useRef, useState } from 'react'
import { CloudArrowUp } from '@phosphor-icons/react'
import imageCompression from 'browser-image-compression'
import { useUploadThing } from '@/lib/uploadthing'

type Props = {
  onUploaded: (url: string) => void
}

export default function GalleryUploader({ onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<'idle' | 'compressing' | 'uploading'>('idle')

  const { startUpload } = useUploadThing('galleryImage', {
    onClientUploadComplete: (res) => {
      const url = res?.[0]?.ufsUrl
      if (url) onUploaded(url)
      setStatus('idle')
    },
    onUploadError: () => setStatus('idle'),
  })

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    setStatus('compressing')
    const compressed = await imageCompression(file, {
      maxSizeMB:         0.8,
      maxWidthOrHeight:  1920,
      useWebWorker:      true,
    })
    const compressedFile = new File([compressed], file.name, { type: compressed.type })

    setStatus('uploading')
    await startUpload([compressedFile])
  }

  const loading = status !== 'idle'
  const label = status === 'compressing' ? 'Comprimiendo...'
              : status === 'uploading'   ? 'Subiendo...'
              : 'Subir foto'

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="btn-accent flex items-center gap-2 text-white font-body text-sm font-medium px-4 py-2.5 rounded-lg"
      >
        <CloudArrowUp size={16} weight="bold" />
        {label}
      </button>
    </>
  )
}
