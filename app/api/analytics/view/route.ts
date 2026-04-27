import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function parseDevice(ua: string): string {
  if (/Mobile|Android|iPhone|iPod/.test(ua)) return 'mobile'
  if (/iPad|Tablet/.test(ua))               return 'tablet'
  return 'desktop'
}

function getIp(req: NextRequest): string | null {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    null
  )
}

async function resolveCountry(req: NextRequest): Promise<string | null> {
  const vercel = req.headers.get('x-vercel-ip-country')
  if (vercel) return vercel

  const cf = req.headers.get('cf-ipcountry')
  if (cf && cf !== 'XX') return cf

  const ip = getIp(req)
  if (!ip || ip === '127.0.0.1' || ip === '::1') return null

  try {
    const res = await fetch(`https://ipinfo.io/${ip}/country`, {
      signal: AbortSignal.timeout(2000),
    })
    if (res.ok) {
      const code = (await res.text()).trim()
      return code.length === 2 ? code : null
    }
  } catch { /* silently ignore — country is optional */ }

  return null
}

async function isDuplicate(userId: string, ip: string | null): Promise<boolean> {
  if (!ip || ip === '127.0.0.1' || ip === '::1') return false

  const since = new Date(Date.now() - 30 * 60 * 1000) // 30 min window
  const recent = await db.pageView.findFirst({
    where: { userId, ip, createdAt: { gte: since } },
    select: { id: true },
  })
  return !!recent
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()
    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    const ip = getIp(req)

    if (await isDuplicate(userId, ip)) {
      return NextResponse.json({ ok: true }) // silently skip
    }

    const ua      = req.headers.get('user-agent') ?? ''
    const device  = parseDevice(ua)
    const country = await resolveCountry(req)

    await db.pageView.create({ data: { userId, device, country, ip } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
