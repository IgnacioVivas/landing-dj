import { db } from '@/lib/db'

export async function getReleasesByUser(userId: string) {
  return db.release.findMany({
    where: { userId },
    orderBy: { order: 'asc' },
  })
}

export type ReleaseItem = Awaited<ReturnType<typeof getReleasesByUser>>[number]
