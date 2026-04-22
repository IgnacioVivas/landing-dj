'use server'

import { auth } from '@/auth'
import { db } from '@/lib/db'
import { settingsSchema } from '@/lib/validations/settings'

type ActionResult = { error: string } | { success: true }

export async function updateSettingsAction(data: unknown): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  const parsed = settingsSchema.safeParse(data)
  if (!parsed.success) return { error: 'Datos inválidos.' }

  const {
    djName, tagline, bioShort, bioFull, genres,
    yearsActive, totalShows, countries, totalReleases,
    instagramUrl, instagramUsername, spotifyProfileUrl,
    soundcloudUrl, youtubeChannelUrl, featuredVideoId,
    bookingEmail, pressEmail,
  } = parsed.data

  const genresArray = genres
    .split(',')
    .map(g => g.trim())
    .filter(Boolean)

  // nullable conversion — empty string → null for optional DB fields
  const toNull = (v: string) => v || null

  await db.$transaction([
    db.user.update({
      where: { id: session.user.id },
      data: { djName, tagline, bioShort, bioFull, genres: genresArray, yearsActive, totalShows, countries, totalReleases },
    }),
    db.djSettings.upsert({
      where:  { userId: session.user.id },
      update: {
        instagramUrl:      toNull(instagramUrl),
        instagramUsername: toNull(instagramUsername),
        spotifyProfileUrl: toNull(spotifyProfileUrl),
        soundcloudUrl:     toNull(soundcloudUrl),
        youtubeChannelUrl: toNull(youtubeChannelUrl),
        featuredVideoId:   toNull(featuredVideoId),
        bookingEmail:      toNull(bookingEmail),
        pressEmail:        toNull(pressEmail),
      },
      create: {
        userId:            session.user.id,
        instagramUrl:      toNull(instagramUrl),
        instagramUsername: toNull(instagramUsername),
        spotifyProfileUrl: toNull(spotifyProfileUrl),
        soundcloudUrl:     toNull(soundcloudUrl),
        youtubeChannelUrl: toNull(youtubeChannelUrl),
        featuredVideoId:   toNull(featuredVideoId),
        bookingEmail:      toNull(bookingEmail),
        pressEmail:        toNull(pressEmail),
      },
    }),
  ])

  return { success: true }
}
