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
