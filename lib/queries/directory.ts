import { db } from '@/lib/db'

// Public directory (and sitemap) only lists paying, filled-out DJ profiles —
// not accounts with an expired/suspended subscription or an empty profile
// nobody ever finished setting up.
export async function getActiveDjs() {
  return db.user.findMany({
    where: {
      role: 'DJ',
      djName: { not: '' },
      subscription: { status: 'ACTIVE', expiresAt: { gt: new Date() } },
    },
    select: {
      slug:      true,
      djName:    true,
      tagline:   true,
      genres:    true,
      bioPhoto:  true,
      updatedAt: true,
      settings:  { select: { heroImageUrl: true, accentColor: true } },
    },
    orderBy: { djName: 'asc' },
  })
}

export type ActiveDj = Awaited<ReturnType<typeof getActiveDjs>>[number]
