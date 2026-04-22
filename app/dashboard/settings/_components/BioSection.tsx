import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { SettingsInput } from '@/lib/validations/settings'
import { Field, SectionTitle, inputClass, textareaClass } from '@/app/dashboard/_components/Field'

type Props = {
  register: UseFormRegister<SettingsInput>
  errors: FieldErrors<SettingsInput>
}

export default function BioSection({ register, errors }: Props) {
  return (
    <div>
      <SectionTitle>Bio</SectionTitle>
      <div className="flex flex-col gap-4">
        <Field label="Nombre artístico" error={errors.djName?.message}>
          <input
            {...register('djName')}
            className={inputClass}
            placeholder="DJ Example"
          />
        </Field>

        <Field
          label="Tagline"
          error={errors.tagline?.message}
          hint="Frase corta que aparece bajo tu nombre en la landing."
        >
          <input
            {...register('tagline')}
            className={inputClass}
            placeholder="Minimal techno from Buenos Aires"
          />
        </Field>

        <Field
          label="Bio corta"
          error={errors.bioShort?.message}
          hint="Se muestra en la sección hero. Máx. 300 caracteres."
        >
          <textarea {...register('bioShort')} rows={3} className={textareaClass} />
        </Field>

        <Field label="Bio completa" error={errors.bioFull?.message}>
          <textarea {...register('bioFull')} rows={7} className={textareaClass} />
        </Field>

        <Field
          label="Géneros"
          error={errors.genres?.message}
          hint="Separados por coma: Techno, House, Minimal"
        >
          <input
            {...register('genres')}
            className={inputClass}
            placeholder="Techno, House, Minimal"
          />
        </Field>
      </div>
    </div>
  )
}
