'use client'

import { useRef, useState } from 'react'
import { CloudArrowUp } from '@phosphor-icons/react'
import imageCompression from 'browser-image-compression'
import { useUploadThing } from '@/lib/uploadthing'

export type UploadResult = { url: string; mediaType: 'image' | 'video' }

type Props = {
  onUploaded: (result: UploadResult) => void
}

export default function GalleryUploader({ onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<'idle' | 'compressing' | 'uploading'>('idle')

  const { startUpload: uploadImage } = useUploadThing('galleryImage', {
    onClientUploadComplete: (res) => {
      const url = res?.[0]?.ufsUrl
      if (url) onUploaded({ url, mediaType: 'image' })
      setStatus('idle')
    },
    onUploadError: () => setStatus('idle'),
  })

  const { startUpload: uploadVideo } = useUploadThing('galleryVideo', {
    onClientUploadComplete: (res) => {
      const url = res?.[0]?.ufsUrl
      if (url) onUploaded({ url, mediaType: 'video' })
      setStatus('idle')
    },
    onUploadError: () => setStatus('idle'),
  })

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    if (file.type.startsWith('video/')) {
      setStatus('uploading')
      await uploadVideo([file])
    } else {
      setStatus('compressing')
      const compressed = await imageCompression(file, {
        maxSizeMB:        0.8,
        maxWidthOrHeight: 1920,
        useWebWorker:     true,
      })
      setStatus('uploading')
      await uploadImage([new File([compressed], file.name, { type: compressed.type })])
    }
  }

  const loading = status !== 'idle'
  const label = status === 'compressing' ? 'Comprimiendo...'
              : status === 'uploading'   ? 'Subiendo...'
              : 'Subir foto o video'

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFile}
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="btn-accent flex items-center gap-2 text-white font-body text-sm font-medium px-4 py-2.5 rounded-lg disabled:opacity-50"
      >
        <CloudArrowUp size={16} weight="bold" />
        {label}
      </button>
    </>
  )
}
