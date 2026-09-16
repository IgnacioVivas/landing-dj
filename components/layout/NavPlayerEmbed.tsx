'use client'

import { useDjData } from '@/lib/dj-context'
import { detectEmbeddablePlatform, toEmbedUrl } from '@/lib/music-platforms'

// Compact visible mini-player pinned to the nav, next to the social icons /
// Book Now button — the widget itself (title, play button) is the platform's
// own embed, not a custom control. Sized to fit inside the existing header
// row instead of adding a second bar below it.
//
// SoundCloud and Mixcloud render fine at a small height directly. Spotify's
// compact embed has a fixed 80px minimum — smaller than that just gets cut
// off — so it's rendered at natural size and visually shrunk with a scaled,
// clipped wrapper instead.
const BOX_WIDTH  = 160
const BOX_HEIGHT = 40

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

  const naturalWidth  = 300
  const naturalHeight = 80
  const scale = BOX_WIDTH / naturalWidth

  return (
    <div className="hidden sm:block rounded-lg overflow-hidden shrink-0" style={{ width: BOX_WIDTH, height: BOX_HEIGHT }}>
      <iframe
        src={toEmbedUrl(url, platform)}
        width={naturalWidth}
        height={naturalHeight}
        allow="autoplay"
        title={embedTitle}
        style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
      />
    </div>
  )
}
