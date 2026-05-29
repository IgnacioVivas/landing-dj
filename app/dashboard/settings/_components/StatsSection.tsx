import type { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form'
import type { SettingsInput } from '@/lib/validations/settings'
import { Field, SectionTitle, inputClass } from '@/app/dashboard/_components/Field'

type Props = {
  register: UseFormRegister<SettingsInput>
  errors:   FieldErrors<SettingsInput>
  watch:    UseFormWatch<SettingsInput>
}

export default function StatsSection({ register, errors, watch }: Props) {
  const showStats = watch('showStats')

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle>Estadísticas</SectionTitle>

      {/* Toggle */}
      <label className="flex items-center gap-3 cursor-pointer w-fit">
        <input {...register('showStats')} type="checkbox" className="sr-only" />
        <div
          className="w-10 h-5 rounded-full transition-colors relative flex-shrink-0"
          style={{ background: showStats ? 'var(--dj-accent)' : 'rgba(255,255,255,0.1)' }}
        >
          <div
            className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
            style={{ transform: showStats ? 'translateX(1.25rem)' : 'translateX(0.125rem)' }}
          />
        </div>
        <span className="font-mono text-xs text-slate-400">Mostrar estadísticas en la bio</span>
      </label>

      {showStats && (
        <div className="grid grid-cols-2 gap-4">
          <Field label="Años activo" error={errors.yearsActive?.message}>
            <input {...register('yearsActive')} className={inputClass} placeholder="10" />
          </Field>

          <Field label="Shows totales" error={errors.totalShows?.message}>
            <input {...register('totalShows')} className={inputClass} placeholder="200+" />
          </Field>

          <Field label="Países" error={errors.countries?.message}>
            <input {...register('countries')} className={inputClass} placeholder="15" />
          </Field>

          <Field label="Lanzamientos" error={errors.totalReleases?.message}>
            <input {...register('totalReleases')} className={inputClass} placeholder="30" />
          </Field>
        </div>
      )}

      {!showStats && (
        <p className="font-mono text-xs text-slate-700">
          Las estadísticas no se mostrarán en la landing.
        </p>
      )}
    </div>
  )
}
