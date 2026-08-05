'use client'

import type { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form'
import type { SettingsInput } from '@/lib/validations/settings'
import { SectionTitle, Field, inputClass } from '@/app/dashboard/_components/Field'
import PhotoUploader from './PhotoUploader'
import VideoUploader from './VideoUploader'
import { updateHeroPhotoAction, updateHeroMobilePhotoAction, updateBioPhotoAction, updateHeroVideoAction, updateHeroVideoMobileAction, updateHeroLogoAction, updateFaviconAction } from '../actions'
import { HERO_TITLE_SIZES, HERO_SIZE_SCALE, HERO_SIZE_LABELS } from '@/lib/hero-size'
import { HERO_ALIGNS, HERO_ALIGN_LABELS } from '@/lib/hero-align'

const PREVIEW_BASE_PX = 46

type Props = {
  register: UseFormRegister<SettingsInput>
  errors: FieldErrors<SettingsInput>
  watch: UseFormWatch<SettingsInput>
  setValue: UseFormSetValue<SettingsInput>
  initialHeroUrl: string | null
  initialHeroMobileUrl: string | null
  initialHeroVideoUrl: string | null
  initialHeroVideoMobileUrl: string | null
  initialHeroLogoUrl: string | null
  initialFaviconUrl: string | null
  initialBioUrl: string | null
}

export default function ThemeSection({ register, errors, watch, setValue, initialHeroUrl, initialHeroMobileUrl, initialHeroVideoUrl, initialHeroVideoMobileUrl, initialHeroLogoUrl, initialFaviconUrl, initialBioUrl }: Props) {
  const accent        = watch('accentColor')
  const accent2       = watch('accentColor2')
  const heroOverlay   = watch('heroOverlay')
  const heroLayout    = watch('heroLayout')
  const scrollMode    = watch('scrollMode')
  const heroTitleSize    = watch('heroTitleSize')
  const heroContentAlign = watch('heroContentAlign')
  const heroTextColor    = watch('heroTextColor')
  const heroTitle     = watch('heroTitle')
  const djName        = watch('djName')

  const previewLabel = heroTitle || djName || 'DJ Example'
  const previewPx    = Math.round(PREVIEW_BASE_PX * HERO_SIZE_SCALE[heroTitleSize])

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

      {/* Hero title/logo size */}
      <div className="flex flex-col gap-3">
        <p className="font-mono text-xs text-slate-600 tracking-widest uppercase">Tamaño del título / logo</p>
        <div className="flex gap-2 flex-wrap">
          {HERO_TITLE_SIZES.map((val) => (
            <label
              key={val}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer transition-colors font-mono text-xs tracking-widest uppercase"
              style={{
                background: heroTitleSize === val ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: heroTitleSize === val ? '#e2e8f0' : '#475569',
              }}
            >
              <input {...register('heroTitleSize')} type="radio" value={val} className="sr-only" />
              {HERO_SIZE_LABELS[val]}
            </label>
          ))}
        </div>

        {/* Preview aproximado — compara el tamaño relativo entre las 5 opciones */}
        <div
          className="flex items-center justify-center h-40 rounded-lg overflow-hidden px-4"
          style={{ background: '#07070f', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {initialHeroLogoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={initialHeroLogoUrl}
              alt={previewLabel}
              className="w-auto object-contain"
              style={{ maxHeight: previewPx * 1.4 }}
            />
          ) : (
            <span
              className="font-display gradient-text leading-none tracking-tight truncate max-w-full"
              style={{ fontSize: previewPx }}
            >
              {previewLabel}
            </span>
          )}
        </div>
        <p className="font-mono text-xs text-slate-700">
          Vista previa aproximada, solo para comparar los 5 tamaños entre sí — el resultado real en pantalla completa puede verse distinto según el dispositivo. Para el chequeo final, abrí tu página desde el link de arriba a la derecha (<span className="text-slate-500">tuslug.{'{dominio}'} ↗</span>).
        </p>
      </div>

      {/* Hero content alignment */}
      <div className="flex flex-col gap-3">
        <p className="font-mono text-xs text-slate-600 tracking-widest uppercase">Alineación del contenido del hero</p>
        <div className="flex gap-2">
          {HERO_ALIGNS.map((val) => (
            <label
              key={val}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer transition-colors font-mono text-xs tracking-widest uppercase"
              style={{
                background: heroContentAlign === val ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: heroContentAlign === val ? '#e2e8f0' : '#475569',
              }}
            >
              <input {...register('heroContentAlign')} type="radio" value={val} className="sr-only" />
              {HERO_ALIGN_LABELS[val]}
            </label>
          ))}
        </div>
        <p className="font-mono text-xs text-slate-700">
          Mueve el título/logo, tagline, botón de reservar, redes y menú a un costado. Solo afecta pantallas grandes — en mobile siempre queda centrado.
        </p>
      </div>

      {/* Hero text color override */}
      <div className="flex flex-col gap-3">
        <p className="font-mono text-xs text-slate-600 tracking-widest uppercase">Color de texto del hero</p>
        <label className="flex items-center gap-3 cursor-pointer w-fit">
          <input
            type="checkbox"
            checked={heroTextColor !== null}
            onChange={e => setValue('heroTextColor', e.target.checked ? (heroTextColor ?? '#e2e8f0') : null, { shouldDirty: true })}
            className="sr-only"
          />
          <div
            className="w-10 h-5 rounded-full transition-colors relative flex-shrink-0"
            style={{ background: heroTextColor !== null ? 'var(--dj-accent)' : 'rgba(255,255,255,0.1)' }}
          >
            <div
              className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
              style={{ transform: heroTextColor !== null ? 'translateX(1.25rem)' : 'translateX(0.125rem)' }}
            />
          </div>
          <span className="font-mono text-xs text-slate-400">Personalizar color</span>
        </label>

        {heroTextColor !== null && (
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg border border-white/10 shrink-0"
              style={{ backgroundColor: heroTextColor }}
            />
            <input
              type="color"
              value={heroTextColor}
              onChange={e => setValue('heroTextColor', e.target.value, { shouldDirty: true })}
              className="w-12 h-10 rounded-lg cursor-pointer bg-transparent border border-white/10"
            />
            <span className="font-mono text-xs text-slate-500">{heroTextColor}</span>
          </div>
        )}

        <p className="font-mono text-xs text-slate-700">
          Afecta el menú, el subtítulo y los íconos de redes del hero — igual en mobile y desktop. El título mantiene siempre su degradado de colores de acento.
        </p>
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

      {/* Scroll mode */}
      <div className="flex flex-col gap-3">
        <p className="font-mono text-xs text-slate-600 tracking-widest uppercase">Modo de scroll</p>
        <div className="flex gap-2">
          {(['free', 'snap'] as const).map((val) => (
            <label
              key={val}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer transition-colors font-mono text-xs tracking-widest uppercase"
              style={{
                background: scrollMode === val ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: scrollMode === val ? '#e2e8f0' : '#475569',
              }}
            >
              <input {...register('scrollMode')} type="radio" value={val} className="sr-only" />
              {val === 'free' ? 'Libre' : 'Por secciones'}
            </label>
          ))}
        </div>
        <p className="font-mono text-xs text-slate-700">
          {scrollMode === 'snap'
            ? 'Cada scroll salta a la siguiente sección completa.'
            : 'Scroll continuo sin saltos.'}
        </p>
      </div>

      {/* Logo upload (independent of form submit) */}
      <div className="flex flex-col gap-4">
        <p className="font-mono text-xs text-slate-600 tracking-widest uppercase">Logo del hero</p>
        <div className="flex flex-wrap gap-8">
          <PhotoUploader
            label="Logo (PNG recomendado)"
            initialUrl={initialHeroLogoUrl}
            onSave={updateHeroLogoAction}
            aspect="aspect-[3/1]"
            maxSizeMB={1}
            maxWidthOrHeight={1200}
            objectFit="contain"
          />
        </div>
        <p className="font-mono text-xs text-slate-700">
          Reemplaza el título de texto. Usá PNG con fondo transparente para mejor resultado.
        </p>
      </div>

      {/* Favicon upload (independent of form submit) */}
      <div className="flex flex-col gap-4">
        <p className="font-mono text-xs text-slate-600 tracking-widest uppercase">Favicon</p>
        <div className="flex flex-wrap gap-8">
          <PhotoUploader
            label="Favicon (PNG cuadrado)"
            initialUrl={initialFaviconUrl}
            onSave={updateFaviconAction}
            aspect="aspect-square"
            maxSizeMB={1}
            maxWidthOrHeight={512}
            objectFit="contain"
          />
        </div>
        <p className="font-mono text-xs text-slate-700">
          Se muestra en la pestaña del navegador cuando alguien abre tu presskit. Usá una imagen cuadrada.
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
            maxSizeMB={4}
            maxWidthOrHeight={2560}
          />
          <PhotoUploader
            label="Móvil"
            initialUrl={initialHeroMobileUrl}
            onSave={updateHeroMobilePhotoAction}
            aspect="aspect-[9/16]"
            maxSizeMB={3}
            maxWidthOrHeight={1920}
          />
          <PhotoUploader
            label="Foto de bio"
            initialUrl={initialBioUrl}
            onSave={updateBioPhotoAction}
            aspect="aspect-[3/4]"
            maxSizeMB={2}
            maxWidthOrHeight={1600}
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
          El video reemplaza a la foto cuando ambos están cargados. Formatos soportados: MP4, WebM. Máx. 200 MB.<br />
          Recomendado: 5–15 segundos · 16:9 · menos de 30 MB para carga rápida.<br />
          <span className="text-amber-700">MOV (iPhone/QuickTime) no es compatible con todos los navegadores — convertilo a MP4 antes de subir.</span>
        </p>
      </div>
    </div>
  )
}
