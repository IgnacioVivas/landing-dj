import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const { auth } = NextAuth(authConfig)

const PLATFORM_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? ''
const APP_SUBDOMAIN   = 'app'

function getDjSubdomain(hostname: string): string | null {
  if (!PLATFORM_DOMAIN) return null
  if (hostname === 'localhost' || hostname === '127.0.0.1') return null
  if (!hostname.endsWith(`.${PLATFORM_DOMAIN}`)) return null
  const sub = hostname.slice(0, -(PLATFORM_DOMAIN.length + 1))
  if (!sub || sub === 'www' || sub === APP_SUBDOMAIN) return null
  return sub
}

export const proxy = auth((req) => {
  const hostname  = (req.headers.get('host') ?? '').split(':')[0]
  const pathname  = req.nextUrl.pathname
  const isLoggedIn = !!req.auth
  const role       = req.auth?.user?.role

  // DJ subdomain → rewrite root to /dj/[slug]
  const dj = getDjSubdomain(hostname)
  if (dj && pathname === '/') {
    const url      = req.nextUrl.clone()
    url.pathname   = `/dj/${dj}`
    return NextResponse.rewrite(url)
  }

  // API routes: always pass through
  if (pathname.startsWith('/api/')) return

  // Auth guards (app subdomain and localhost)
  if ((pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.nextUrl.origin))
  }
  if (pathname.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl.origin))
  }
  if (pathname === '/login' && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl.origin))
  }
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
