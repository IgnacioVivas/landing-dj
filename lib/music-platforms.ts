import {
  SiSpotify, SiSpotifyHex,
  SiSoundcloud, SiSoundcloudHex,
  SiApplemusic, SiApplemusicHex,
  SiBeatport, SiBeatportHex,
  SiMixcloud, SiMixcloudHex,
  type IconType,
} from '@icons-pack/react-simple-icons'

export type MusicPlatform = 'spotify' | 'soundcloud' | 'appleMusic' | 'beatport' | 'mixcloud'

export const MUSIC_PLATFORM_ICON: Record<MusicPlatform, IconType> = {
  spotify:    SiSpotify,
  soundcloud: SiSoundcloud,
  appleMusic: SiApplemusic,
  beatport:   SiBeatport,
  mixcloud:   SiMixcloud,
}

// Official brand hex per Simple Icons, e.g. "#1ED760" — used for brand-colored
// badges/backgrounds. Icon components already default to currentColor otherwise.
export const MUSIC_PLATFORM_HEX: Record<MusicPlatform, string> = {
  spotify:    SiSpotifyHex,
  soundcloud: SiSoundcloudHex,
  appleMusic: SiApplemusicHex,
  beatport:   SiBeatportHex,
  mixcloud:   SiMixcloudHex,
}

export const MUSIC_PLATFORM_LABEL: Record<MusicPlatform, string> = {
  spotify:    'Spotify',
  soundcloud: 'SoundCloud',
  appleMusic: 'Apple Music',
  beatport:   'Beatport',
  mixcloud:   'Mixcloud',
}

// Platforms with a public, embeddable player widget (no auth required).
// Apple Music and Beatport are link-out only elsewhere in the app.
export type EmbeddableMusicPlatform = 'soundcloud' | 'spotify' | 'mixcloud'

export function detectEmbeddablePlatform(url: string): EmbeddableMusicPlatform | null {
  if (url.includes('soundcloud.com'))   return 'soundcloud'
  if (url.includes('open.spotify.com')) return 'spotify'
  if (url.includes('mixcloud.com'))     return 'mixcloud'
  return null
}

export function toEmbedUrl(url: string, platform: EmbeddableMusicPlatform): string {
  if (platform === 'soundcloud') {
    // visual=false uses SoundCloud's compact list layout (small artwork + track list),
    // matching the Spotify embed's look, instead of the big background-photo player.
    return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&visual=false&hide_related=true&show_comments=false&show_user=true`
  }
  if (platform === 'spotify') {
    const [base] = url.split('?')
    const clean  = base.replace(/open\.spotify\.com\/intl-[a-z]+\//, 'open.spotify.com/')
    return clean.replace('open.spotify.com/', 'open.spotify.com/embed/') + '?utm_source=generator&theme=0'
  }
  const path = url.replace(/^https?:\/\/(www\.)?mixcloud\.com/, '')
  return `https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&feed=${encodeURIComponent(path)}`
}

// Heights tuned for the full-size embed inside the "Mix / Podcast" section.
export function embedHeight(platform: EmbeddableMusicPlatform): number {
  // The classic/list SoundCloud layout needs more room than the old visual
  // player to show artwork + track rows; 300 comfortably fits a handful of
  // tracks and scrolls internally if there are more.
  if (platform === 'soundcloud') return 300
  if (platform === 'spotify')    return 152
  return 120
}

// Spotify's iFrame JS API (open.spotify.com/embed/iframe-api) takes a
// `spotify:<type>:<id>` URI, not the regular web link — used by the hidden
// nav play/pause button to control playback via its Embed Controller.
export function toSpotifyUri(url: string): string | null {
  try {
    const clean = url.replace(/open\.spotify\.com\/intl-[a-z]+\//, 'open.spotify.com/')
    const { pathname } = new URL(clean)
    const [, type, id] = pathname.split('/')
    if (!type || !id) return null
    return `spotify:${type}:${id}`
  } catch {
    return null
  }
}
