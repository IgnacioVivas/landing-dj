import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { SettingsInput } from '@/lib/validations/settings'
import { Field, SectionTitle, inputClass } from '@/app/dashboard/_components/Field'

type Props = {
  register: UseFormRegister<SettingsInput>
  errors:   FieldErrors<SettingsInput>
}

export default function MixSection({ register, errors }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle>Mix / Podcast</SectionTitle>

      <Field
        label="URL del mix"
        error={errors.mixUrl?.message}
        hint="Pegá el link de SoundCloud, Spotify o Mixcloud. Se mostrará el player directamente en tu landing."
      >
        <input
          {...register('mixUrl')}
          className={inputClass}
          placeholder="https://soundcloud.com/artista/nombre-del-mix"
        />
      </Field>

      <p className="font-mono text-xs text-slate-700">
        Plataformas soportadas: SoundCloud · Spotify (track, álbum, playlist) · Mixcloud
      </p>
    </div>
  )
}
