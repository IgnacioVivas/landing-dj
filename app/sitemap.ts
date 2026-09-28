import type { MetadataRoute } from 'next'
import { getActiveDjs } from '@/lib/queries/directory'
import { apexOrigin, djOrigin } from '@/lib/site-url'

// Queries the DB, so this can't be statically prerendered at Docker build
// time (the db container isn't up yet during `docker build`, only later
// during `docker compose up`) — force it to render per-request instead.
// As a bonus, the sitemap now always reflects the current DJ roster instead
// of whatever it was the moment the image happened to be built.
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const root = apexOrigin()
  if (!root) return []

  const djs = await getActiveDjs()

  const djEntries: MetadataRoute.Sitemap = djs.flatMap((dj) => {
    const origin = djOrigin(dj.slug)
    if (!origin) return []
    return [{
      url:            `${origin}/`,
      lastModified:   dj.updatedAt,
      changeFrequency: 'weekly',
      priority:        0.8,
    }]
  })

  return [
    { url: `${root}/`, changeFrequency: 'weekly', priority: 1 },
    ...djEntries,
  ]
}
