import { NextResponse } from 'next/server'
import type { InstagramPost } from '@/lib/types'

/**
 * Instagram Graph API integration.
 *
 * Setup:
 * 1. Create a Meta App at developers.facebook.com
 * 2. Add "Instagram Graph API" product
 * 3. Connect a Professional (Business or Creator) Instagram account
 * 4. Generate a long-lived access token
 * 5. Add to .env.local:
 *      INSTAGRAM_ACCESS_TOKEN=your_long_lived_token
 *
 * The token expires every 60 days — refresh it before then.
 */
export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN

  if (!token) {
    return NextResponse.json({ posts: [] })
  }

  try {
    const fields = 'id,media_type,media_url,thumbnail_url,permalink,timestamp'
    const res = await fetch(
      `https://graph.instagram.com/me/media?fields=${fields}&limit=9&access_token=${token}`,
      { next: { revalidate: 3600 } },
    )

    if (!res.ok) {
      return NextResponse.json({ posts: [] })
    }

    const data = await res.json()
    const posts: InstagramPost[] = (data.data ?? []).filter(
      (p: InstagramPost) => p.media_type === 'IMAGE' || p.media_type === 'CAROUSEL_ALBUM',
    )

    return NextResponse.json({ posts })
  } catch {
    return NextResponse.json({ posts: [] })
  }
}
