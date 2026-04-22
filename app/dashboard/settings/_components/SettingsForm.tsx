'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { settingsSchema, type SettingsInput } from '@/lib/validations/settings'
import { updateSettingsAction } from '../actions'
import type { UserSettings } from '@/lib/queries/user'
import BioSection from './BioSection'
import StatsSection from './StatsSection'
import SocialSection from './SocialSection'

function toDefaults(d: UserSettings): SettingsInput {
  return {
    djName:            d.djName,
    tagline:           d.tagline,
    bioShort:          d.bioShort,
    bioFull:           d.bioFull,
    genres:            d.genres.join(', '),
    yearsActive:       d.yearsActive,
    totalShows:        d.totalShows,
    countries:         d.countries,
    totalReleases:     d.totalReleases,
    instagramUrl:      d.settings?.instagramUrl      ?? '',
    instagramUsername: d.settings?.instagramUsername  ?? '',
    spotifyProfileUrl: d.settings?.spotifyProfileUrl  ?? '',
    soundcloudUrl:     d.settings?.soundcloudUrl      ?? '',
    youtubeChannelUrl: d.settings?.youtubeChannelUrl  ?? '',
    featuredVideoId:   d.settings?.featuredVideoId    ?? '',
    bookingEmail:      d.settings?.bookingEmail       ?? '',
    pressEmail:        d.settings?.pressEmail         ?? '',
  }
}

export default function SettingsForm({ data }: { data: UserSettings }) {
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SettingsInput>({
    resolver: zodResolver(settingsSchema),
    defaultValues: toDefaults(data),
  })

  async function onSubmit(values: SettingsInput) {
    setSaved(false)
    setServerError(null)

    const result = await updateSettingsAction(values)

    if ('error' in result) {
      setServerError(result.error)
      return
    }

    reset(values)
    setSaved(true)
    router.refresh()
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-12">
      <BioSection    register={register} errors={errors} />
      <StatsSection  register={register} errors={errors} />
      <SocialSection register={register} errors={errors} />

      <div className="flex items-center gap-4 pb-12 border-t border-white/5 pt-6">
        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-body font-medium px-8 py-3 rounded-lg transition-colors"
        >
          {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
        </button>

        {saved && (
          <p className="font-mono text-xs text-cyan-400">Cambios guardados.</p>
        )}
        {serverError && (
          <p className="font-mono text-xs text-red-400">{serverError}</p>
        )}
      </div>
    </form>
  )
}
