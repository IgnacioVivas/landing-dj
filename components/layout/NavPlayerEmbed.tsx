'use client'

import { useDjData } from '@/lib/dj-context'
import { detectEmbeddablePlatform, toEmbedUrl } from '@/lib/music-platforms'

// Compact visible mini-player pinned to the nav, next to the social icons /
// Book Now button — the widget itself (title, play button) is the platform's
// own embed, not a custom control.
//
// Each iframe renders at its real, unscaled size. An earlier version used
// CSS transform: scale() to force Spotify's embed into a shorter box, but
// scaling an <iframe> isn't reliably respected by every browser — some just
// paint the untransformed content clipped to the wrapper, i.e. a crop, not
// a shrink. Spotify's compact layout has a fixed 80px minimum height, so
// its box is taller than SoundCloud/Mixcloud's; Navbar's row uses min-h-16
// instead of a fixed height so it grows to fit without clipping.
const WIDTH = 260

const HEIGHT: Record<'soundcloud' | 'spotify' | 'mixcloud', number> = {
  soundcloud: 46,
  mixcloud:   46,
  spotify:    80,
}

export default function NavPlayerEmbed() {
  const { mix } = useDjData()
  const url      = mix.pinnedUrl
  const platform = url ? detectEmbeddablePlatform(url) : null
  if (!platform || !url) return null

  const height = HEIGHT[platform]

  return (
    <div className="rounded-lg overflow-hidden shrink-0" style={{ width: WIDTH, height }}>
      <iframe
        src={toEmbedUrl(url, platform)}
        width={WIDTH}
        height={height}
        allow="autoplay"
        title={mix.pinnedTitle ?? 'Reproductor fijo'}
      />
    </div>
  )
}
