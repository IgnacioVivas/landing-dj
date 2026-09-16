'use server'

import { auth } from '@/auth'
import { db } from '@/lib/db'
import { settingsSchema } from '@/lib/validations/settings'
import { deleteFile } from '@/lib/storage'
import { extractYouTubeId } from '@/lib/youtube'
import { detectEmbeddablePlatform } from '@/lib/music-platforms'
import { fetchOembedTitle } from '@/lib/oembed'

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
    soundcloudUrl, youtubeChannelUrl, youtubeVideoIds,
    bookingEmail, pressEmail,
    mixUrls, pinnedTrackUrl,
    accentColor, accentColor2, heroTitle, heroTitleEn, heroTitleSize, heroContentAlign, heroTextColor, heroOverlay, heroLayout, scrollMode, showStats, pageBackgroundOverlayOpacity, pageBackgroundBlur,
  } = parsed.data

  const cleanMixUrls    = mixUrls.map(u => u.trim()).filter(Boolean)
  const genresArray     = genres.split(',').map(g => g.trim()).filter(Boolean)
  const toNull          = (v: string) => v || null
  const cleanVideoIds   = youtubeVideoIds
    .map(v => extractYouTubeId(v) ?? v)
    .filter(id => /^[a-zA-Z0-9_-]{11}$/.test(id))
  const cleanPinnedTrackUrl = pinnedTrackUrl.trim()

  // Only hit the platform's oEmbed endpoint when the pinned link actually
  // changed — no point re-fetching the title on every unrelated save.
  const current = await db.djSettings.findUnique({
    where:  { userId: session.user.id },
    select: { pinnedTrackUrl: true, pinnedTrackTitle: true },
  })
  let pinnedTrackTitle = current?.pinnedTrackTitle ?? null
  if (cleanPinnedTrackUrl !== (current?.pinnedTrackUrl ?? '')) {
    const platform = cleanPinnedTrackUrl ? detectEmbeddablePlatform(cleanPinnedTrackUrl) : null
    pinnedTrackTitle = platform ? await fetchOembedTitle(cleanPinnedTrackUrl, platform) : null
  }

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
        youtubeChannelUrl: toNull(youtubeChannelUrl), youtubeVideoIds: cleanVideoIds,
        bookingEmail: toNull(bookingEmail), pressEmail: toNull(pressEmail),
        mixUrls: cleanMixUrls, pinnedTrackUrl: toNull(cleanPinnedTrackUrl), pinnedTrackTitle,
        accentColor, accentColor2, heroTitle: toNull(heroTitle), heroTitleEn: toNull(heroTitleEn), heroTitleSize, heroContentAlign, heroTextColor, heroOverlay, heroLayout, scrollMode, showStats, pageBackgroundOverlayOpacity, pageBackgroundBlur,
      },
      create: {
        userId: session.user.id,
        instagramUrl: toNull(instagramUrl), instagramUsername: toNull(instagramUsername),
        spotifyProfileUrl: toNull(spotifyProfileUrl), soundcloudUrl: toNull(soundcloudUrl),
        youtubeChannelUrl: toNull(youtubeChannelUrl), youtubeVideoIds: cleanVideoIds,
        bookingEmail: toNull(bookingEmail), pressEmail: toNull(pressEmail),
        mixUrls: cleanMixUrls, pinnedTrackUrl: toNull(cleanPinnedTrackUrl), pinnedTrackTitle,
        accentColor, accentColor2, heroTitle: toNull(heroTitle), heroTitleEn: toNull(heroTitleEn), heroTitleSize, heroContentAlign, heroTextColor, heroOverlay, heroLayout, scrollMode, showStats, pageBackgroundOverlayOpacity, pageBackgroundBlur,
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

export async function updateHeroLogoAction(url: string | null): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  const current = await db.djSettings.findUnique({
    where: { userId: session.user.id },
    select: { heroLogoUrl: true },
  })
  await deleteFile(current?.heroLogoUrl)

  await db.djSettings.upsert({
    where:  { userId: session.user.id },
    update: { heroLogoUrl: url },
    create: { userId: session.user.id, heroLogoUrl: url },
  })

  return { success: true }
}

export async function updateFaviconAction(url: string | null): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  const current = await db.djSettings.findUnique({
    where: { userId: session.user.id },
    select: { faviconUrl: true },
  })
  await deleteFile(current?.faviconUrl)

  await db.djSettings.upsert({
    where:  { userId: session.user.id },
    update: { faviconUrl: url },
    create: { userId: session.user.id, faviconUrl: url },
  })

  return { success: true }
}

export async function updatePageBackgroundAction(url: string | null): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  const current = await db.djSettings.findUnique({
    where: { userId: session.user.id },
    select: { pageBackgroundUrl: true },
  })
  await deleteFile(current?.pageBackgroundUrl)

  await db.djSettings.upsert({
    where:  { userId: session.user.id },
    update: { pageBackgroundUrl: url },
    create: { userId: session.user.id, pageBackgroundUrl: url },
  })

  return { success: true }
}

export async function updateHeroVideoAction(url: string | null): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  const current = await db.djSettings.findUnique({
    where: { userId: session.user.id },
    select: { heroVideoUrl: true },
  })
  await deleteFile(current?.heroVideoUrl)

  await db.djSettings.upsert({
    where:  { userId: session.user.id },
    update: { heroVideoUrl: url },
    create: { userId: session.user.id, heroVideoUrl: url },
  })

  return { success: true }
}

export async function updateHeroVideoMobileAction(url: string | null): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user.id) return { error: 'No autorizado.' }

  const current = await db.djSettings.findUnique({
    where: { userId: session.user.id },
    select: { heroVideoMobileUrl: true },
  })
  await deleteFile(current?.heroVideoMobileUrl)

  await db.djSettings.upsert({
    where:  { userId: session.user.id },
    update: { heroVideoMobileUrl: url },
    create: { userId: session.user.id, heroVideoMobileUrl: url },
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
