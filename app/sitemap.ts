import type { MetadataRoute } from 'next'
import { getActiveDjs } from '@/lib/queries/directory'
import { apexOrigin, djOrigin } from '@/lib/site-url'

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
