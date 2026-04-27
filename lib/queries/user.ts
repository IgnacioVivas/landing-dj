import { db } from '@/lib/db'

export async function getUserSettings(userId: string) {
  return db.user.findUnique({
    where: { id: userId },
    select: {
      djName:        true,
      tagline:       true,
      taglineEn:     true,
      bioShort:      true,
      bioShortEn:    true,
      bioFull:       true,
      bioFullEn:     true,
      genres:        true,
      yearsActive:   true,
      totalShows:    true,
      countries:     true,
      totalReleases: true,
      bioPhoto:      true,
      settings: {
        select: {
          youtubeChannelUrl:  true,
          featuredVideoId:    true,
          soundcloudUrl:      true,
          spotifyProfileUrl:  true,
          instagramUrl:       true,
          instagramUsername:  true,
          bookingEmail:       true,
          pressEmail:         true,
          mixUrl:             true,
          riderUrl:           true,
          epkUrl:             true,
          accentColor:            true,
          accentColor2:           true,
          heroImageUrl:           true,
          heroImageMobileUrl:     true,
          heroTitle:              true,
          heroTitleEn:            true,
          showsMode:              true,
        },
      },
    },
  })
}

export type UserSettings = NonNullable<Awaited<ReturnType<typeof getUserSettings>>>
