import { db } from '@/lib/db'

export async function getUserSettings(userId: string) {
  return db.user.findUnique({
    where: { id: userId },
    select: {
      djName:        true,
      tagline:       true,
      bioShort:      true,
      bioFull:       true,
      genres:        true,
      yearsActive:   true,
      totalShows:    true,
      countries:     true,
      totalReleases: true,
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
        },
      },
    },
  })
}

export type UserSettings = NonNullable<Awaited<ReturnType<typeof getUserSettings>>>
