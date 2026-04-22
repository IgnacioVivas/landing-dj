import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { SettingsInput } from '@/lib/validations/settings'
import { Field, SectionTitle, inputClass } from '@/app/dashboard/_components/Field'

type Props = {
  register: UseFormRegister<SettingsInput>
  errors: FieldErrors<SettingsInput>
}

export default function StatsSection({ register, errors }: Props) {
  return (
    <div>
      <SectionTitle>Estadísticas</SectionTitle>
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
    </div>
  )
}
