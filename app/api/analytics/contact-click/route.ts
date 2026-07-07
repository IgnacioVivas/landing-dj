import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const VALID_TYPES = ['booking', 'press', 'other', 'send_message', 'booking_contact']

export async function POST(req: NextRequest) {
  try {
    const { userId, type } = await req.json()
    if (!userId || typeof userId !== 'string' || !VALID_TYPES.includes(type)) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    await db.contactClick.create({ data: { userId, type } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
