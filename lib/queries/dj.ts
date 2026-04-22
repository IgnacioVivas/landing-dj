import { db } from '@/lib/db'

export async function getDjBySlug(slug: string) {
  return db.user.findUnique({
    where: { slug },
    include: {
      shows:    { orderBy: { date: 'asc' } },
      releases: { orderBy: { order: 'asc' } },
      gallery:  { orderBy: { order: 'asc' } },
      settings: true,
    },
  })
}

export type DjWithData = NonNullable<Awaited<ReturnType<typeof getDjBySlug>>>
