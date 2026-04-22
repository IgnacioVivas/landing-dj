import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { SettingsInput } from '@/lib/validations/settings'
import { Field, SectionTitle, inputClass } from '@/app/dashboard/_components/Field'

type Props = {
  register: UseFormRegister<SettingsInput>
  errors: FieldErrors<SettingsInput>
}

export default function SocialSection({ register, errors }: Props) {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <SectionTitle>Redes sociales</SectionTitle>
        <div className="flex flex-col gap-4">
          <Field label="Instagram URL" error={errors.instagramUrl?.message}>
            <input
              {...register('instagramUrl')}
              className={inputClass}
              placeholder="https://instagram.com/djexample"
            />
          </Field>

          <Field
            label="Instagram username"
            error={errors.instagramUsername?.message}
            hint="Sin @. Se usa para el feed de fotos."
          >
            <input
              {...register('instagramUsername')}
              className={inputClass}
              placeholder="djexample"
            />
          </Field>

          <Field label="Spotify" error={errors.spotifyProfileUrl?.message}>
            <input
              {...register('spotifyProfileUrl')}
              className={inputClass}
              placeholder="https://open.spotify.com/artist/..."
            />
          </Field>

          <Field label="SoundCloud" error={errors.soundcloudUrl?.message}>
            <input
              {...register('soundcloudUrl')}
              className={inputClass}
              placeholder="https://soundcloud.com/djexample"
            />
          </Field>
        </div>
      </div>

      <div>
        <SectionTitle>YouTube</SectionTitle>
        <div className="flex flex-col gap-4">
          <Field label="URL del canal" error={errors.youtubeChannelUrl?.message}>
            <input
              {...register('youtubeChannelUrl')}
              className={inputClass}
              placeholder="https://youtube.com/@djexample"
            />
          </Field>

          <Field
            label="ID del video destacado"
            error={errors.featuredVideoId?.message}
            hint="Solo el ID: lo que va después de ?v= en la URL de YouTube."
          >
            <input
              {...register('featuredVideoId')}
              className={inputClass}
              placeholder="dQw4w9WgXcQ"
            />
          </Field>
        </div>
      </div>

      <div>
        <SectionTitle>Contacto</SectionTitle>
        <div className="flex flex-col gap-4">
          <Field label="Email de booking" error={errors.bookingEmail?.message}>
            <input
              {...register('bookingEmail')}
              type="email"
              className={inputClass}
              placeholder="booking@djexample.com"
            />
          </Field>

          <Field label="Email de prensa" error={errors.pressEmail?.message}>
            <input
              {...register('pressEmail')}
              type="email"
              className={inputClass}
              placeholder="press@djexample.com"
            />
          </Field>
        </div>
      </div>
    </div>
  )
}
