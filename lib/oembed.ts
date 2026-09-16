import type { EmbeddableMusicPlatform } from './music-platforms'

const OEMBED_ENDPOINT: Record<EmbeddableMusicPlatform, string> = {
  soundcloud: 'https://soundcloud.com/oembed',
  spotify:    'https://open.spotify.com/oembed',
  mixcloud:   'https://www.mixcloud.com/oembed/',
}

// Public oEmbed lookup for a track/mix's real title, so the nav player can
// show "Techno Mix Vol. 3" instead of just "SoundCloud". Never throws — a
// failed or slow lookup just means the caller falls back to the platform name.
export async function fetchOembedTitle(url: string, platform: EmbeddableMusicPlatform): Promise<string | null> {
  try {
    const endpoint = `${OEMBED_ENDPOINT[platform]}?format=json&url=${encodeURIComponent(url)}`
    const res = await fetch(endpoint, { signal: AbortSignal.timeout(5000) })
    if (!res.ok) return null

    const data: unknown = await res.json()
    const title = typeof data === 'object' && data !== null && 'title' in data ? data.title : null
    return typeof title === 'string' && title.trim() ? title.trim() : null
  } catch {
    return null
  }
}
