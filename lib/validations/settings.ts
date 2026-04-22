import { z } from 'zod'

const optionalUrl = z.union([
  z.literal(''),
  z.string().url('URL inválida'),
])

const optionalEmail = z.union([
  z.literal(''),
  z.string().email('Email inválido'),
])

export const settingsSchema = z.object({
  // Bio
  djName:   z.string().min(2, 'Mínimo 2 caracteres').max(40, 'Máximo 40 caracteres'),
  tagline:  z.string().max(100, 'Máximo 100 caracteres'),
  bioShort: z.string().max(300, 'Máximo 300 caracteres'),
  bioFull:  z.string().max(2000, 'Máximo 2000 caracteres'),
  genres:   z.string().max(200),

  // Stats
  yearsActive:   z.string(),
  totalShows:    z.string(),
  countries:     z.string(),
  totalReleases: z.string(),

  // Social
  instagramUrl:      optionalUrl,
  instagramUsername: z.string().max(60),
  spotifyProfileUrl: optionalUrl,
  soundcloudUrl:     optionalUrl,
  youtubeChannelUrl: optionalUrl,
  featuredVideoId:   z.string().max(20),

  // Booking
  bookingEmail: optionalEmail,
  pressEmail:   optionalEmail,
})

export type SettingsInput = z.infer<typeof settingsSchema>
