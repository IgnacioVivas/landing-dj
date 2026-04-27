'use client'

import type { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form'
import type { SettingsInput } from '@/lib/validations/settings'
import { SectionTitle, Field, inputClass } from '@/app/dashboard/_components/Field'
import PhotoUploader from './PhotoUploader'
import { updateHeroPhotoAction, updateHeroMobilePhotoAction, updateBioPhotoAction } from '../actions'

type Props = {
  register: UseFormRegister<SettingsInput>
  errors: FieldErrors<SettingsInput>
  watch: UseFormWatch<SettingsInput>
  initialHeroUrl: string | null
  initialHeroMobileUrl: string | null
  initialBioUrl: string | null
}

export default function ThemeSection({ register, errors, watch, initialHeroUrl, initialHeroMobileUrl, initialBioUrl }: Props) {
  const accent  = watch('accentColor')
  const accent2 = watch('accentColor2')
  const mode    = watch('showsMode')

  return (
    <div className="flex flex-col gap-8">
      <SectionTitle>Apariencia</SectionTitle>

      {/* Accent colors */}
      <div className="flex flex-col gap-4">
        <p className="font-mono text-xs text-slate-600 tracking-widest uppercase">Colores de acento</p>
        <div className="flex flex-wrap gap-6">
          <Field label="Color primario" error={errors.accentColor?.message}>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg border border-white/10 shrink-0"
                style={{ backgroundColor: accent }}
              />
              <input
                {...register('accentColor')}
                type="color"
                className="w-12 h-10 rounded-lg cursor-pointer bg-transparent border border-white/10"
              />
              <span className="font-mono text-xs text-slate-500">{accent}</span>
            </div>
          </Field>

          <Field label="Color secundario" error={errors.accentColor2?.message}>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg border border-white/10 shrink-0"
                style={{ backgroundColor: accent2 }}
              />
              <input
                {...register('accentColor2')}
                type="color"
                className="w-12 h-10 rounded-lg cursor-pointer bg-transparent border border-white/10"
              />
              <span className="font-mono text-xs text-slate-500">{accent2}</span>
            </div>
          </Field>
        </div>

        {/* Live preview strip */}
        <div
          className="h-2 rounded-full w-full max-w-xs"
          style={{ background: `linear-gradient(90deg, ${accent} 0%, ${accent2} 100%)` }}
        />
      </div>

      {/* Hero title override */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field
          label="Título del hero (Español)"
          error={errors.heroTitle?.message}
          hint="Vacío = usa el nombre artístico."
        >
          <input
            {...register('heroTitle')}
            className={inputClass}
            placeholder={watch('djName') || 'DJ Example'}
          />
        </Field>
        <Field
          label="Título del hero (English)"
          error={errors.heroTitleEn?.message}
          hint="Empty = uses Spanish title or artist name."
        >
          <input
            {...register('heroTitleEn')}
            className={inputClass}
            placeholder={watch('djName') || 'DJ Example'}
          />
        </Field>
      </div>

      {/* Shows display mode */}
      <div className="flex flex-col gap-3">
        <p className="font-mono text-xs text-slate-600 tracking-widest uppercase">Modo de shows</p>
        <div className="flex gap-2">
          <label
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer transition-colors font-mono text-xs tracking-widest uppercase"
            style={{
              background: mode === 'list' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: mode === 'list' ? '#e2e8f0' : '#475569',
            }}
          >
            <input {...register('showsMode')} type="radio" value="list" className="sr-only" />
            Lista
          </label>
          <label
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer transition-colors font-mono text-xs tracking-widest uppercase"
            style={{
              background: mode === 'flyer' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: mode === 'flyer' ? '#e2e8f0' : '#475569',
            }}
          >
            <input {...register('showsMode')} type="radio" value="flyer" className="sr-only" />
            Flyers
          </label>
        </div>
        <p className="font-mono text-xs text-slate-700">
          {mode === 'flyer' ? 'Cada show muestra una imagen flyer.' : 'Los shows se listan en formato tabla.'}
        </p>
      </div>

      {/* Photo uploads (independent of form submit) */}
      <div className="flex flex-col gap-4">
        <p className="font-mono text-xs text-slate-600 tracking-widest uppercase">Fotos</p>
        <div className="flex flex-wrap gap-8">
          <PhotoUploader
            label="Hero (escritorio)"
            initialUrl={initialHeroUrl}
            onSave={updateHeroPhotoAction}
            aspect="aspect-video"
          />
          <PhotoUploader
            label="Hero (móvil)"
            initialUrl={initialHeroMobileUrl}
            onSave={updateHeroMobilePhotoAction}
            aspect="aspect-[9/16]"
          />
          <PhotoUploader
            label="Foto de bio"
            initialUrl={initialBioUrl}
            onSave={updateBioPhotoAction}
            aspect="aspect-[3/4]"
          />
        </div>
        <p className="font-mono text-xs text-slate-700">Las fotos se aplican al instante, sin necesidad de guardar.</p>
      </div>
    </div>
  )
}
