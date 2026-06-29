'use client'

import type { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form'
import type { SettingsInput } from '@/lib/validations/settings'
import { SectionTitle, Field, inputClass } from '@/app/dashboard/_components/Field'
import PhotoUploader from './PhotoUploader'
import VideoUploader from './VideoUploader'
import { updateHeroPhotoAction, updateHeroMobilePhotoAction, updateBioPhotoAction, updateHeroVideoAction, updateHeroVideoMobileAction } from '../actions'

type Props = {
  register: UseFormRegister<SettingsInput>
  errors: FieldErrors<SettingsInput>
  watch: UseFormWatch<SettingsInput>
  initialHeroUrl: string | null
  initialHeroMobileUrl: string | null
  initialHeroVideoUrl: string | null
  initialHeroVideoMobileUrl: string | null
  initialBioUrl: string | null
}

export default function ThemeSection({ register, errors, watch, initialHeroUrl, initialHeroMobileUrl, initialHeroVideoUrl, initialHeroVideoMobileUrl, initialBioUrl }: Props) {
  const accent       = watch('accentColor')
  const accent2      = watch('accentColor2')
  const mode         = watch('showsMode')
  const heroOverlay  = watch('heroOverlay')
  const heroLayout   = watch('heroLayout')
  const galleryMode  = watch('galleryMode')

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

      {/* Hero layout */}
      <div className="flex flex-col gap-3">
        <p className="font-mono text-xs text-slate-600 tracking-widest uppercase">Layout del hero</p>
        <div className="flex gap-2">
          {(['center', 'integrated'] as const).map((val) => (
            <label
              key={val}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer transition-colors font-mono text-xs tracking-widest uppercase"
              style={{
                background: heroLayout === val ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: heroLayout === val ? '#e2e8f0' : '#475569',
              }}
            >
              <input {...register('heroLayout')} type="radio" value={val} className="sr-only" />
              {val === 'center' ? 'Clásico' : 'Integrado'}
            </label>
          ))}
        </div>
        <p className="font-mono text-xs text-slate-700">
          {heroLayout === 'integrated'
            ? 'Navegación integrada en el hero. El nombre y las redes quedan centradas en pantalla.'
            : 'Navbar clásica fija arriba. El nombre centrado en el hero.'}
        </p>
      </div>

      {/* Hero overlay toggle */}
      <div className="flex flex-col gap-3">
        <p className="font-mono text-xs text-slate-600 tracking-widest uppercase">Filtro del hero</p>
        <label className="flex items-center gap-3 cursor-pointer w-fit">
          <input {...register('heroOverlay')} type="checkbox" className="sr-only" />
          <div
            className="w-10 h-5 rounded-full transition-colors relative flex-shrink-0"
            style={{ background: heroOverlay ? 'var(--dj-accent)' : 'rgba(255,255,255,0.1)' }}
          >
            <div
              className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
              style={{ transform: heroOverlay ? 'translateX(1.25rem)' : 'translateX(0.125rem)' }}
            />
          </div>
          <span className="font-mono text-xs text-slate-400">Filtro oscuro sobre el hero</span>
        </label>
        <p className="font-mono text-xs text-slate-700">
          {heroOverlay ? 'La imagen tiene un filtro oscuro para mejorar la legibilidad.' : 'La imagen se muestra limpia sin filtro.'}
        </p>
      </div>

      {/* Gallery display mode */}
      <div className="flex flex-col gap-3">
        <p className="font-mono text-xs text-slate-600 tracking-widest uppercase">Modo de galería</p>
        <div className="flex gap-2">
          {(['grid', 'carousel'] as const).map((val) => (
            <label
              key={val}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer transition-colors font-mono text-xs tracking-widest uppercase"
              style={{
                background: galleryMode === val ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: galleryMode === val ? '#e2e8f0' : '#475569',
              }}
            >
              <input {...register('galleryMode')} type="radio" value={val} className="sr-only" />
              {val === 'grid' ? 'Cuadrícula' : 'Carrusel'}
            </label>
          ))}
        </div>
        <p className="font-mono text-xs text-slate-700">
          {galleryMode === 'carousel'
            ? 'Galería horizontal tipo carrusel.'
            : 'Galería en cuadrícula masonry.'}
        </p>
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
        <p className="font-mono text-xs text-slate-600 tracking-widest uppercase">Fotos del hero</p>
        <div className="flex flex-wrap gap-8">
          <PhotoUploader
            label="Escritorio"
            initialUrl={initialHeroUrl}
            onSave={updateHeroPhotoAction}
            aspect="aspect-video"
          />
          <PhotoUploader
            label="Móvil"
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

      {/* Video uploads (independent of form submit) */}
      <div className="flex flex-col gap-4">
        <p className="font-mono text-xs text-slate-600 tracking-widest uppercase">Videos del hero</p>
        <div className="flex flex-wrap gap-8">
          <VideoUploader
            label="Escritorio"
            initialUrl={initialHeroVideoUrl}
            onSave={updateHeroVideoAction}
          />
          <VideoUploader
            label="Móvil"
            initialUrl={initialHeroVideoMobileUrl}
            onSave={updateHeroVideoMobileAction}
          />
        </div>
        <p className="font-mono text-xs text-slate-700 leading-relaxed">
          El video reemplaza a la foto cuando ambos están cargados. Formatos: MP4, WebM. Máx. 200 MB.<br />
          Recomendado: 5–15 segundos · 16:9 · menos de 30 MB para carga rápida.<br />
          Videos gratuitos: <span className="text-slate-500">pexels.com/videos · pixabay.com/videos · coverr.co</span>
        </p>
      </div>
    </div>
  )
}
