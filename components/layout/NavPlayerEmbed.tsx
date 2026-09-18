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
// a shrink.
//
// SoundCloud and Mixcloud both have a real "mini" mode built for exactly
// this spot (a thin bar: play button + title, toEmbedUrl already requests
// it via visual=false / mini=1) and can go genuinely small. Spotify has no
// equivalent — 80px tall is its documented minimum for ANY iframe embed,
// and going narrower than ~300px wide doesn't shrink it either, it just
// makes Spotify's own layout overflow inside the iframe (hence
// scrolling="no" as a guard). Navbar's row uses min-h-16 instead of a fixed
// height so it grows to fit Spotify's taller box without clipping; my-2
// here keeps the widget from touching the header's top/bottom edges.
const WIDTH = 300

const HEIGHT: Record<'soundcloud' | 'spotify' | 'mixcloud', number> = {
  soundcloud: 30,
  mixcloud:   30,
  spotify:    80,
}

export default function NavPlayerEmbed() {
  const { mix } = useDjData()
  const url      = mix.pinnedUrl
  const platform = url ? detectEmbeddablePlatform(url) : null
  if (!platform || !url) return null

  const height = HEIGHT[platform]

  return (
    <div className="rounded-lg overflow-hidden shrink-0 my-2" style={{ width: WIDTH, height }}>
      <iframe
        src={toEmbedUrl(url, platform)}
        width={WIDTH}
        height={height}
        scrolling="no"
        allow="autoplay"
        title={mix.pinnedTitle ?? 'Reproductor fijo'}
      />
    </div>
  )
}
