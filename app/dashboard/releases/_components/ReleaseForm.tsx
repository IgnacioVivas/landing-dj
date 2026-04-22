'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { releaseSchema, type ReleaseInput } from '@/lib/validations/release'
import { Field, inputClass } from '@/app/dashboard/_components/Field'
import GradientPicker from './GradientPicker'

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
      spotifyUrl:    '',
      soundcloudUrl: '',
      appleMusicUrl: '',
      beatportUrl:   '',
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field label="Título" error={errors.title?.message}>
        <input {...register('title')} className={inputClass} placeholder="Nombre del lanzamiento" />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Tipo" error={errors.type?.message}>
          <select {...register('type')} className={inputClass}>
            {TYPE_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </Field>

        <Field label="Año" error={errors.year?.message}>
          <input
            {...register('year')}
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
        disabled={isSubmitting}
        className="mt-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-body font-medium py-3 rounded-lg transition-colors"
      >
        {isSubmitting ? 'Guardando...' : submitLabel}
      </button>
    </form>
  )
}
