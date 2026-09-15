'use client'

import { useDjData } from '@/lib/dj-context'
import {
  MUSIC_PLATFORM_ICON, MUSIC_PLATFORM_HEX,
  detectEmbeddablePlatform, toEmbedUrl, compactEmbedHeight,
} from '@/lib/music-platforms'

// Pinned to the top nav so a visitor can start listening without scrolling
// down to the Mix section. Note: neither SoundCloud nor Spotify allow true
// autoplay-with-sound on page load (browsers block it, and Spotify's embed
// requires a manual click either way) — this renders each platform's own
// compact widget so play is always one click away, not automatic.
export default function NavPlayerBar() {
  const { mix } = useDjData()
  const url = mix.pinnedUrl
  if (!url) return null

  const platform = detectEmbeddablePlatform(url)
  if (!platform) return null

  const Icon = MUSIC_PLATFORM_ICON[platform]
  const hex  = MUSIC_PLATFORM_HEX[platform]

  return (
    <div className="border-t border-white/5 bg-[#07070f]/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-3">
        <Icon size={16} color={hex} className="flex-shrink-0" />
        <div className="flex-1 min-w-0 overflow-hidden rounded-lg">
          <iframe
            src={toEmbedUrl(url, platform)}
            width="100%"
            height={compactEmbedHeight(platform)}
            allow="autoplay"
            style={{ display: 'block' }}
            title="Reproductor fijo"
          />
        </div>
      </div>
    </div>
  )
}
