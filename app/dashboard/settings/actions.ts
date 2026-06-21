'use server'

import { auth } from '@/auth'
import { db } from '@/lib/db'
import { settingsSchema } from '@/lib/validations/settings'
import { changePasswordSchema } from '@/lib/validations/auth'
import { hashPassword, verifyPassword } from '@/lib/auth-utils'
import { deleteFile } from '@/lib/storage'
import { extractYouTubeId } from '@/lib/youtube'

type ActionResult = { error: string } | { success: true }

export async function updateSettingsAction(data: unknown): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  const parsed = settingsSchema.safeParse(data)
  if (!parsed.success) return { error: 'Datos inválidos.' }

  const {
    djName, tagline, taglineEn, bioShort, bioShortEn, bioFull, bioFullEn, genres,
    yearsActive, totalShows, countries, totalReleases,
    instagramUrl, instagramUsername, spotifyProfileUrl,
    soundcloudUrl, youtubeChannelUrl, youtubeVideoIds, metaPixelId,
    bookingEmail, pressEmail,
    mixUrls, riderUrl, epkUrl,
    accentColor, accentColor2, heroTitle, heroTitleEn, heroOverlay, heroLayout, showStats, galleryMode, showsMode,
  } = parsed.data

  const cleanMixUrls  = mixUrls.map(u => u.trim()).filter(Boolean)
  const genresArray   = genres.split(',').map(g => g.trim()).filter(Boolean)
  const toNull        = (v: string) => v || null
  const cleanVideoIds = youtubeVideoIds
    .map(v => extractYouTubeId(v) ?? v)
    .filter(id => /^[a-zA-Z0-9_-]{11}$/.test(id))

  await db.$transaction([
    db.user.update({
      where: { id: session.user.id },
      data: {
        djName, tagline, taglineEn, bioShort, bioShortEn, bioFull, bioFullEn,
        genres: genresArray, yearsActive, totalShows, countries, totalReleases,
      },
    }),
    db.djSettings.upsert({
      where:  { userId: session.user.id },
      update: {
        instagramUrl: toNull(instagramUrl), instagramUsername: toNull(instagramUsername),
        spotifyProfileUrl: toNull(spotifyProfileUrl), soundcloudUrl: toNull(soundcloudUrl),
        youtubeChannelUrl: toNull(youtubeChannelUrl), youtubeVideoIds: cleanVideoIds, metaPixelId: toNull(metaPixelId),
        bookingEmail: toNull(bookingEmail), pressEmail: toNull(pressEmail),
        mixUrls: cleanMixUrls, riderUrl: toNull(riderUrl), epkUrl: toNull(epkUrl),
        accentColor, accentColor2, heroTitle: toNull(heroTitle), heroTitleEn: toNull(heroTitleEn), heroOverlay, heroLayout, showStats, galleryMode, showsMode,
      },
      create: {
        userId: session.user.id,
        instagramUrl: toNull(instagramUrl), instagramUsername: toNull(instagramUsername),
        spotifyProfileUrl: toNull(spotifyProfileUrl), soundcloudUrl: toNull(soundcloudUrl),
        youtubeChannelUrl: toNull(youtubeChannelUrl), youtubeVideoIds: cleanVideoIds, metaPixelId: toNull(metaPixelId),
        bookingEmail: toNull(bookingEmail), pressEmail: toNull(pressEmail),
        mixUrls: cleanMixUrls, riderUrl: toNull(riderUrl), epkUrl: toNull(epkUrl),
        accentColor, accentColor2, heroTitle: toNull(heroTitle), heroTitleEn: toNull(heroTitleEn), heroOverlay, heroLayout, showStats, galleryMode, showsMode,
      },
    }),
  ])

  return { success: true }
}

export async function updateHeroPhotoAction(url: string | null): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  const current = await db.djSettings.findUnique({
    where: { userId: session.user.id },
    select: { heroImageUrl: true },
  })
  await deleteFile(current?.heroImageUrl)

  await db.djSettings.upsert({
    where:  { userId: session.user.id },
    update: { heroImageUrl: url },
    create: { userId: session.user.id, heroImageUrl: url },
  })

  return { success: true }
}

export async function updateHeroMobilePhotoAction(url: string | null): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  const current = await db.djSettings.findUnique({
    where: { userId: session.user.id },
    select: { heroImageMobileUrl: true },
  })
  await deleteFile(current?.heroImageMobileUrl)

  await db.djSettings.upsert({
    where:  { userId: session.user.id },
    update: { heroImageMobileUrl: url },
    create: { userId: session.user.id, heroImageMobileUrl: url },
  })

  return { success: true }
}

export async function updateBioPhotoAction(url: string | null): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  const current = await db.user.findUnique({
    where: { id: session.user.id },
    select: { bioPhoto: true },
  })
  await deleteFile(current?.bioPhoto)

  await db.user.update({
    where: { id: session.user.id },
    data:  { bioPhoto: url },
  })

  return { success: true }
}

export async function changePasswordAction(data: unknown): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  const parsed = changePasswordSchema.safeParse(data)
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Datos inválidos.' }

  const user = await db.user.findUnique({
    where:  { id: session.user.id },
    select: { password: true },
  })
  if (!user?.password) return { error: 'No autorizado.' }

  const valid = await verifyPassword(parsed.data.currentPassword, user.password)
  if (!valid) return { error: 'La contraseña actual es incorrecta.' }

  const hashed = await hashPassword(parsed.data.newPassword)
  await db.user.update({ where: { id: session.user.id }, data: { password: hashed } })

  return { success: true }
}
