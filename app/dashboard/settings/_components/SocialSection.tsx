'use client'

import { useState } from 'react'
import type { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form'
import type { SettingsInput } from '@/lib/validations/settings'
import { Field, SectionTitle, inputClass } from '@/app/dashboard/_components/Field'
import { extractYouTubeId } from '@/lib/youtube'
import { X, Plus } from '@phosphor-icons/react'

type Props = {
  register: UseFormRegister<SettingsInput>
  errors:   FieldErrors<SettingsInput>
  watch:    UseFormWatch<SettingsInput>
  setValue: UseFormSetValue<SettingsInput>
}

function VideoItem({ videoId, onRemove }: { videoId: string; onRemove: () => void }) {
  return (
    <div
      className="flex items-center gap-3 p-2 rounded-lg"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Thumbnail */}
      <div className="w-24 h-14 rounded overflow-hidden shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <p className="font-mono text-xs text-slate-500 flex-1 truncate">{videoId}</p>
      <button
        type="button"
        onClick={onRemove}
        className="p-1.5 text-slate-600 hover:text-red-400 transition-colors shrink-0"
        aria-label="Quitar video"
      >
        <X size={14} />
      </button>
    </div>
  )
}

export default function SocialSection({ register, errors, watch, setValue }: Props) {
  const [input, setInput] = useState('')
  const [inputError, setInputError] = useState('')

  const videoIds = watch('youtubeVideoIds') ?? []

  function addVideo() {
    const id = extractYouTubeId(input)
    if (!id) { setInputError('URL o ID inválido'); return }
    if (videoIds.includes(id)) { setInputError('Este video ya está en la lista'); return }
    if (videoIds.length >= 10) { setInputError('Máximo 10 videos'); return }
    setValue('youtubeVideoIds', [...videoIds, id], { shouldDirty: true })
    setInput('')
    setInputError('')
  }

  function removeVideo(id: string) {
    setValue('youtubeVideoIds', videoIds.filter(v => v !== id), { shouldDirty: true })
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') { e.preventDefault(); addVideo() }
  }

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
            label="Videos del carrusel"
            hint="Pegá la URL o el ID de cada video (youtu.be, Shorts, watch?v=…). Máx. 10."
          >
            <div className="flex gap-2">
              <input
                value={input}
                onChange={e => { setInput(e.target.value); setInputError('') }}
                onKeyDown={handleKeyDown}
                className={inputClass}
                placeholder="https://youtu.be/dQw4w9WgXcQ"
              />
              <button
                type="button"
                onClick={addVideo}
                disabled={videoIds.length >= 10}
                className="btn-accent flex items-center gap-1.5 text-white font-body text-sm px-3 py-2 rounded-lg shrink-0 disabled:opacity-40"
              >
                <Plus size={14} weight="bold" />
                Agregar
              </button>
            </div>
            {inputError && (
              <p className="font-mono text-xs text-red-400 mt-1">{inputError}</p>
            )}
          </Field>

          {videoIds.length > 0 && (
            <div className="flex flex-col gap-2">
              {videoIds.map(id => (
                <VideoItem key={id} videoId={id} onRemove={() => removeVideo(id)} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <SectionTitle>Integraciones</SectionTitle>
        <div className="flex flex-col gap-4">
          <Field
            label="Meta Pixel ID"
            hint="Pegá el ID numérico de tu Pixel (ej. 1234567890123456). Lo encontrás en Meta Business → Events Manager."
            error={errors.metaPixelId?.message}
          >
            <input
              {...register('metaPixelId')}
              className={inputClass}
              placeholder="1234567890123456"
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
