import type { DjWithData } from './queries/dj'
import type { DjPageData } from './dj-context'
import type { ReleaseType, AspectRatio } from './types'

export function dbToDjPageData(dj: DjWithData): DjPageData {
  return {
    name:      dj.djName,
    tagline:   dj.tagline,
    taglineEn: dj.taglineEn,
    genres:    dj.genres,
    bio: {
      short:    dj.bioShort,
      shortEn:  dj.bioShortEn,
      full:     dj.bioFull,
      fullEn:   dj.bioFullEn,
      photoUrl: dj.bioPhoto ?? null,
      stats: [
        { label: 'Años activo', value: dj.yearsActive   },
        { label: 'Shows',       value: dj.totalShows    },
        { label: 'Países',      value: dj.countries     },
        { label: 'Releases',    value: dj.totalReleases },
      ],
    },
    shows: dj.shows.map(s => ({
      id:        s.id,
      date:      s.date.toISOString().split('T')[0],
      city:      s.city,
      country:   s.country,
      venue:     s.venue,
      festival:  s.festival  ?? undefined,
      ticketUrl: s.ticketUrl ?? undefined,
      flyerUrl:  s.flyerUrl  ?? undefined,
      isSoldOut: s.isSoldOut,
      isPast:    s.date < new Date(),
    })),
    releases: dj.releases.map(r => ({
      id:            r.id,
      title:         r.title,
      year:          r.year,
      coverGradient: r.coverGradient,
      coverImageUrl: r.coverImageUrl ?? undefined,
      type:          r.type as ReleaseType,
      label:         r.label ?? undefined,
      links: {
        spotify:    r.spotifyUrl    ?? undefined,
        soundcloud: r.soundcloudUrl ?? undefined,
        appleMusic: r.appleMusicUrl ?? undefined,
        beatport:   r.beatportUrl   ?? undefined,
      },
    })),
    gallery: dj.gallery.map(g => ({
      id:        g.id,
      imageUrl:  g.imageUrl ?? null,
      gradient:  g.gradient,
      caption:   g.caption,
      captionEn: g.captionEn,
      aspect:    g.aspect as AspectRatio,
    })),
    youtube: {
      featuredVideoId: dj.settings?.featuredVideoId  ?? null,
      channelUrl:      dj.settings?.youtubeChannelUrl ?? null,
    },
    instagram: {
      username:   dj.settings?.instagramUsername ?? null,
      profileUrl: dj.settings?.instagramUrl      ?? null,
    },
    social: {
      instagram:  dj.settings?.instagramUrl      ?? null,
      spotify:    dj.settings?.spotifyProfileUrl  ?? null,
      soundcloud: dj.settings?.soundcloudUrl      ?? null,
      youtube:    dj.settings?.youtubeChannelUrl  ?? null,
    },
    contact: {
      bookingEmail: dj.settings?.bookingEmail ?? null,
      pressEmail:   dj.settings?.pressEmail   ?? null,
    },
    theme: {
      accentColor:        dj.settings?.accentColor        ?? '#8b5cf6',
      accentColor2:       dj.settings?.accentColor2       ?? '#22d3ee',
      heroImageUrl:       dj.settings?.heroImageUrl       ?? null,
      heroImageMobileUrl: dj.settings?.heroImageMobileUrl ?? null,
      heroTitle:          dj.settings?.heroTitle          ?? null,
      heroTitleEn:        dj.settings?.heroTitleEn        ?? null,
    },
    showsMode: (dj.settings?.showsMode ?? 'list') as 'list' | 'flyer',
  }
}
