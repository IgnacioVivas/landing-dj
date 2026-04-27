'use server'

import { auth } from '@/auth'
import { db } from '@/lib/db'
import { settingsSchema } from '@/lib/validations/settings'
import { changePasswordSchema } from '@/lib/validations/auth'
import { hashPassword, verifyPassword } from '@/lib/auth-utils'
import { UTApi } from 'uploadthing/server'

type ActionResult = { error: string } | { success: true }

const utapi = new UTApi()

function extractKey(url: string) {
  return url.split('/f/').pop()
}

export async function updateSettingsAction(data: unknown): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  const parsed = settingsSchema.safeParse(data)
  if (!parsed.success) return { error: 'Datos inválidos.' }

  const {
    djName, tagline, taglineEn, bioShort, bioShortEn, bioFull, bioFullEn, genres,
    yearsActive, totalShows, countries, totalReleases,
    instagramUrl, instagramUsername, spotifyProfileUrl,
    soundcloudUrl, youtubeChannelUrl, featuredVideoId,
    bookingEmail, pressEmail,
    mixUrl, riderUrl, epkUrl,
    accentColor, accentColor2, heroTitle, heroTitleEn, showsMode,
  } = parsed.data

  const genresArray = genres.split(',').map(g => g.trim()).filter(Boolean)
  const toNull = (v: string) => v || null

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
        youtubeChannelUrl: toNull(youtubeChannelUrl), featuredVideoId: toNull(featuredVideoId),
        bookingEmail: toNull(bookingEmail), pressEmail: toNull(pressEmail),
        mixUrl: toNull(mixUrl), riderUrl: toNull(riderUrl), epkUrl: toNull(epkUrl),
        accentColor, accentColor2, heroTitle: toNull(heroTitle), heroTitleEn: toNull(heroTitleEn), showsMode,
      },
      create: {
        userId: session.user.id,
        instagramUrl: toNull(instagramUrl), instagramUsername: toNull(instagramUsername),
        spotifyProfileUrl: toNull(spotifyProfileUrl), soundcloudUrl: toNull(soundcloudUrl),
        youtubeChannelUrl: toNull(youtubeChannelUrl), featuredVideoId: toNull(featuredVideoId),
        bookingEmail: toNull(bookingEmail), pressEmail: toNull(pressEmail),
        mixUrl: toNull(mixUrl), riderUrl: toNull(riderUrl), epkUrl: toNull(epkUrl),
        accentColor, accentColor2, heroTitle: toNull(heroTitle), heroTitleEn: toNull(heroTitleEn), showsMode,
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
  if (current?.heroImageUrl) {
    const key = extractKey(current.heroImageUrl)
    if (key) await utapi.deleteFiles(key).catch(() => null)
  }

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
  if (current?.heroImageMobileUrl) {
    const key = extractKey(current.heroImageMobileUrl)
    if (key) await utapi.deleteFiles(key).catch(() => null)
  }

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
  if (current?.bioPhoto) {
    const key = extractKey(current.bioPhoto)
    if (key) await utapi.deleteFiles(key).catch(() => null)
  }

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
