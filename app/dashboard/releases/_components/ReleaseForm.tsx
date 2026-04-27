'use client'

import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { releaseSchema, type ReleaseInput } from '@/lib/validations/release'
import { Field, inputClass, selectClass, SelectWrapper } from '@/app/dashboard/_components/Field'
import GradientPicker from './GradientPicker'
import { useUploadThing } from '@/lib/uploadthing'

const DEFAULT_GRADIENT = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'

const TYPE_OPTIONS = [
  { value: 'single', label: 'Single' },
  { value: 'ep',     label: 'EP' },
  { value: 'album',  label: 'Álbum' },
] as const

type Props = {
  defaultValues?: Partial<ReleaseInput>
  onSubmit: (data: ReleaseInput) => Promise<void>
  submitLabel: string
}

export default function ReleaseForm({ defaultValues, onSubmit, submitLabel }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ReleaseInput>({
    resolver: zodResolver(releaseSchema),
    defaultValues: {
      type:          'single',
      year:          new Date().getFullYear(),
      label:         '',
      coverGradient: DEFAULT_GRADIENT,
      coverImageUrl: '',
      spotifyUrl:    '',
      soundcloudUrl: '',
      appleMusicUrl: '',
      beatportUrl:   '',
      ...defaultValues,
    },
  })

  const coverImageUrl = watch('coverImageUrl')
  const [uploadError, setUploadError] = useState<string | null>(null)

  const { startUpload, isUploading } = useUploadThing('djPhoto', {
    onClientUploadComplete: useCallback((res: { ufsUrl: string }[]) => {
      const url = res[0]?.ufsUrl
      if (url) setValue('coverImageUrl', url, { shouldDirty: true })
    }, [setValue]),
    onUploadError: (err: Error) => setUploadError(err.message),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field label="Título" error={errors.title?.message}>
        <input {...register('title')} className={inputClass} placeholder="Nombre del lanzamiento" />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Tipo" error={errors.type?.message}>
          <SelectWrapper>
            <select {...register('type')} className={selectClass}>
              {TYPE_OPTIONS.map(o => (
                <option key={o.value} value={o.value} className="bg-[#07070f]">{o.label}</option>
              ))}
            </select>
          </SelectWrapper>
        </Field>

        <Field label="Año" error={errors.year?.message}>
          <input
            {...register('year', { valueAsNumber: true })}
            type="number"
            className={inputClass}
            placeholder={String(new Date().getFullYear())}
          />
        </Field>
      </div>

      <Field label="Sello / Label" error={errors.label?.message}>
        <input {...register('label')} className={inputClass} placeholder="Drumcode (opcional)" />
      </Field>

      <Field label="Color de portada" error={errors.coverGradient?.message}>
        <GradientPicker setValue={setValue} watch={watch} />
      </Field>

      {/* Cover image upload */}
      <div className="flex flex-col gap-2">
        <p className="font-mono text-xs text-slate-500 tracking-widest uppercase">Imagen de portada</p>
        <div className="flex items-start gap-3">
          {coverImageUrl && (
            <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
              <Image src={coverImageUrl} alt="Cover" fill className="object-cover" sizes="64px" />
            </div>
          )}
          <div className="flex flex-col gap-2">
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
              <span
                className="inline-flex items-center font-mono text-xs px-3 py-2 rounded-lg transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: isUploading ? '#475569' : '#e2e8f0' }}
              >
                {isUploading ? 'Subiendo...' : coverImageUrl ? 'Cambiar imagen' : 'Subir imagen'}
              </span>
            </label>
            {coverImageUrl && (
              <button
                type="button"
                onClick={() => setValue('coverImageUrl', '', { shouldDirty: true })}
                className="font-mono text-xs text-red-400 hover:text-red-300 transition-colors text-left"
              >
                Eliminar imagen
              </button>
            )}
          </div>
        </div>
        {uploadError && <p className="font-mono text-xs text-red-400">{uploadError}</p>}
        <p className="font-mono text-xs text-slate-700">
          Si subís una imagen, reemplaza el gradiente de color.
        </p>
        <input type="hidden" {...register('coverImageUrl')} />
      </div>

      <div className="border-t border-white/5 pt-4">
        <p className="font-mono text-xs text-slate-600 tracking-widest uppercase mb-3">
          Links de plataformas
        </p>
        <div className="flex flex-col gap-3">
          <Field label="Spotify" error={errors.spotifyUrl?.message}>
            <input {...register('spotifyUrl')} className={inputClass} placeholder="https://open.spotify.com/..." />
          </Field>
          <Field label="SoundCloud" error={errors.soundcloudUrl?.message}>
            <input {...register('soundcloudUrl')} className={inputClass} placeholder="https://soundcloud.com/..." />
          </Field>
          <Field label="Apple Music" error={errors.appleMusicUrl?.message}>
            <input {...register('appleMusicUrl')} className={inputClass} placeholder="https://music.apple.com/..." />
          </Field>
          <Field label="Beatport" error={errors.beatportUrl?.message}>
            <input {...register('beatportUrl')} className={inputClass} placeholder="https://www.beatport.com/..." />
          </Field>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || isUploading}
        className="btn-accent mt-2 disabled:opacity-50 disabled:cursor-not-allowed text-white font-body font-medium py-3 rounded-lg"
      >
        {isSubmitting ? 'Guardando...' : submitLabel}
      </button>
    </form>
  )
}
