import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { SettingsInput } from '@/lib/validations/settings'
import { Field, SectionTitle, inputClass } from '@/app/dashboard/_components/Field'

type Props = {
  register: UseFormRegister<SettingsInput>
  errors:   FieldErrors<SettingsInput>
}

const mixes = [
  { index: 0, label: 'Mix 1',         required: false },
  { index: 1, label: 'Mix 2',         required: false },
  { index: 2, label: 'Mix 3',         required: false },
] as const

export default function MixSection({ register, errors }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle>Mix / Podcast</SectionTitle>

      <div className="flex flex-col gap-4">
        {mixes.map(({ index, label }) => (
          <Field
            key={index}
            label={label}
            error={errors.mixUrls?.[index]?.message}
          >
            <input
              {...register(`mixUrls.${index}`)}
              className={inputClass}
              placeholder="https://soundcloud.com/artista/nombre-del-mix"
            />
          </Field>
        ))}
      </div>

      <p className="font-mono text-xs text-slate-700">
        Plataformas soportadas: SoundCloud · Spotify (track, álbum, playlist) · Mixcloud
      </p>
    </div>
  )
}
