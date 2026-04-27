import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { SettingsInput } from '@/lib/validations/settings'
import { Field, SectionTitle, inputClass } from '@/app/dashboard/_components/Field'

type Props = {
  register: UseFormRegister<SettingsInput>
  errors:   FieldErrors<SettingsInput>
}

export default function PressKitSection({ register, errors }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle>Press Kit</SectionTitle>

      <div className="flex flex-col gap-4">
        <Field
          label="Rider técnico (URL)"
          error={errors.riderUrl?.message}
          hint="Link directo al PDF de tu rider (Google Drive, Dropbox, etc.)."
        >
          <input
            {...register('riderUrl')}
            className={inputClass}
            placeholder="https://drive.google.com/... (opcional)"
          />
        </Field>

        <Field
          label="Press Kit / EPK (URL)"
          error={errors.epkUrl?.message}
          hint="Link directo al PDF de tu press kit o EPK."
        >
          <input
            {...register('epkUrl')}
            className={inputClass}
            placeholder="https://drive.google.com/... (opcional)"
          />
        </Field>
      </div>

      <p className="font-mono text-xs text-slate-700">
        Para compartir PDFs gratis: subí a Google Drive y copiá el link de "Cualquier persona con el enlace".
      </p>
    </div>
  )
}
