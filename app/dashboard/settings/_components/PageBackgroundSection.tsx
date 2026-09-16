import type { UseFormRegister, UseFormWatch } from 'react-hook-form'
import type { SettingsInput } from '@/lib/validations/settings'
import PhotoUploader from './PhotoUploader'
import { updatePageBackgroundAction } from '../actions'

type Props = {
  register:   UseFormRegister<SettingsInput>
  watch:      UseFormWatch<SettingsInput>
  initialUrl: string | null
}

function Slider({
  label, value, unit, hint, register, min, max, step = 1,
}: {
  label: string
  value: number
  unit: string
  hint: string
  register: ReturnType<UseFormRegister<SettingsInput>>
  min: number
  max: number
  step?: number
}) {
  return (
    <div className="flex flex-col gap-2 max-w-xs">
      <div className="flex items-center justify-between">
        <label className="font-mono text-xs text-slate-400 tracking-wider uppercase">{label}</label>
        <span className="font-mono text-xs text-slate-500">{value}{unit}</span>
      </div>
      <input {...register} type="range" min={min} max={max} step={step} className="w-full accent-[var(--dj-accent)]" />
      <p className="font-mono text-xs text-slate-700">{hint}</p>
    </div>
  )
}

export default function PageBackgroundSection({ register, watch, initialUrl }: Props) {
  const overlayOpacity = watch('pageBackgroundOverlayOpacity')
  const blur           = watch('pageBackgroundBlur')

  return (
    <div className="flex flex-col gap-4">
      <p className="font-mono text-xs text-slate-600 tracking-widest uppercase">Fondo de toda la página</p>

      <div className="flex flex-wrap gap-8">
        <PhotoUploader
          label="Fondo (opcional)"
          initialUrl={initialUrl}
          onSave={updatePageBackgroundAction}
          aspect="aspect-video"
          maxSizeMB={4}
          maxWidthOrHeight={2560}
          objectFit="cover"
        />
      </div>
      <p className="font-mono text-xs text-slate-700">
        Se aplica detrás de toda la landing (no solo el hero), fija mientras se hace scroll.
        Recomendado: imagen horizontal, 1920×1080 o más grande. Sin foto acá, la página usa el fondo oscuro de siempre.
      </p>

      <Slider
        label="Filtro oscuro"
        value={overlayOpacity}
        unit="%"
        min={0}
        max={100}
        step={5}
        hint={overlayOpacity === 0
          ? 'Sin filtro — la imagen se muestra limpia.'
          : 'Más alto = más oscuro, mejor lectura del texto.'}
        register={register('pageBackgroundOverlayOpacity', { valueAsNumber: true })}
      />

      <Slider
        label="Desenfoque"
        value={blur}
        unit="px"
        min={0}
        max={20}
        hint="Efecto vidrio esmerilado — ayuda a leer el texto sin oscurecer tanto la imagen."
        register={register('pageBackgroundBlur', { valueAsNumber: true })}
      />
    </div>
  )
}
