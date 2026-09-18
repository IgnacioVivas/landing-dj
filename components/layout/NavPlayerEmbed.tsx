'use client'

import { useDjData } from '@/lib/dj-context'
import { detectEmbeddablePlatform, toEmbedUrl } from '@/lib/music-platforms'

// Compact visible mini-player pinned to the nav, next to the social icons /
// Book Now button — the widget itself (title, play button) is the platform's
// own embed, not a custom control. Sized to fit inside the existing header
// row instead of adding a second bar below it.
//
// SoundCloud and Mixcloud render fine at any height directly. Spotify's
// compact embed has a fixed 300x80 layout that doesn't shrink below that —
// asking for a smaller height just gets it cut off — so it's rendered at
// natural size and visually shrunk (both dimensions, proportionally) with a
// scaled, clipped wrapper instead.
const BOX_WIDTH  = 220
const BOX_HEIGHT = 46

const SPOTIFY_NATURAL_WIDTH  = 300
const SPOTIFY_NATURAL_HEIGHT = 80
const SPOTIFY_SCALE  = BOX_WIDTH / SPOTIFY_NATURAL_WIDTH
const SPOTIFY_HEIGHT = Math.round(SPOTIFY_NATURAL_HEIGHT * SPOTIFY_SCALE)

export default function NavPlayerEmbed() {
  const { mix } = useDjData()
  const url      = mix.pinnedUrl
  const platform = url ? detectEmbeddablePlatform(url) : null
  if (!platform || !url) return null

  const embedTitle = mix.pinnedTitle ?? 'Reproductor fijo'

  if (platform !== 'spotify') {
    return (
      <div className="rounded-lg overflow-hidden shrink-0" style={{ width: BOX_WIDTH, height: BOX_HEIGHT }}>
        <iframe
          src={toEmbedUrl(url, platform)}
          width={BOX_WIDTH}
          height={BOX_HEIGHT}
          allow="autoplay"
          title={embedTitle}
        />
      </div>
    )
  }

  return (
    <div className="rounded-lg overflow-hidden shrink-0" style={{ width: BOX_WIDTH, height: SPOTIFY_HEIGHT }}>
      <iframe
        src={toEmbedUrl(url, platform)}
        width={SPOTIFY_NATURAL_WIDTH}
        height={SPOTIFY_NATURAL_HEIGHT}
        allow="autoplay"
        title={embedTitle}
        style={{ transform: `scale(${SPOTIFY_SCALE})`, transformOrigin: 'top left' }}
      />
    </div>
  )
}
