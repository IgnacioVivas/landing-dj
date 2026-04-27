import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// Call this daily via a cron job (e.g. cURL, Vercel Cron, or any scheduler):
// GET /api/cron/expire-subscriptions
// Authorization: Bearer <CRON_SECRET from .env>

export async function GET(req: Request) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { count } = await db.subscription.updateMany({
    where: { status: 'ACTIVE', expiresAt: { lt: new Date() } },
    data:  { status: 'EXPIRED' },
  })

  return NextResponse.json({ expired: count, at: new Date().toISOString() })
}
