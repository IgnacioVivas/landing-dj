import type { MetadataRoute } from 'next'
import { apexOrigin } from '@/lib/site-url'

export default function robots(): MetadataRoute.Robots {
  const root = apexOrigin()

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/admin', '/login', '/api'],
    },
    ...(root && { sitemap: `${root}/sitemap.xml` }),
  }
}
