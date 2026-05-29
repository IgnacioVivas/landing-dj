/**
 * Extracts a YouTube video ID from any common URL format or a bare ID.
 * Supports: watch?v=, youtu.be/, /shorts/, /embed/, and bare 11-char IDs.
 */
export function extractYouTubeId(input: string): string | null {
  const s = input.trim()
  if (!s) return null

  // Bare 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s

  try {
    const url = new URL(s)
    // youtube.com/watch?v=ID
    const v = url.searchParams.get('v')
    if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v
    // youtu.be/ID
    if (url.hostname === 'youtu.be') {
      const id = url.pathname.slice(1).split('?')[0]
      if (/^[a-zA-Z0-9_-]{11}$/.test(id)) return id
    }
    // youtube.com/shorts/ID or /embed/ID or /live/ID
    const match = url.pathname.match(/\/(shorts|embed|live)\/([a-zA-Z0-9_-]{11})/)
    if (match) return match[2]
  } catch {
    // Not a valid URL — not a bare ID either
  }

  return null
}
