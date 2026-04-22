import { db } from '@/lib/db'

export async function getShowsByUser(userId: string) {
  return db.show.findMany({
    where: { userId },
    orderBy: { date: 'asc' },
  })
}

export type ShowItem = Awaited<ReturnType<typeof getShowsByUser>>[number]
