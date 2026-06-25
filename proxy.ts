import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const { auth } = NextAuth(authConfig)

const PLATFORM_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? ''

function getSubdomain(hostname: string): string | null {
  if (!PLATFORM_DOMAIN) return null
  if (hostname === 'localhost' || hostname === '127.0.0.1') return null
  if (!hostname.endsWith(`.${PLATFORM_DOMAIN}`)) return null
  const sub = hostname.slice(0, -(PLATFORM_DOMAIN.length + 1))
  return sub && sub !== 'www' ? sub : null
}

function resolveRewrite(subdomain: string, pathname: string): string | null {
  if (pathname.startsWith('/api/')) return null

  if (subdomain === 'login') {
    return pathname === '/' ? '/login' : null
  }
  if (subdomain === 'dashboard') {
    if (pathname.startsWith('/dashboard')) return null
    return pathname === '/' ? '/dashboard' : `/dashboard${pathname}`
  }
  if (subdomain === 'admin') {
    if (pathname.startsWith('/admin')) return null
    return pathname === '/' ? '/admin' : `/admin${pathname}`
  }
  // DJ subdomain — only rewrite root
  if (pathname === '/') return `/dj/${subdomain}`
  return null
}

export const proxy = auth((req) => {
  const hostname  = (req.headers.get('host') ?? '').split(':')[0]
  const subdomain = getSubdomain(hostname)
  const pathname  = req.nextUrl.pathname
  const isLoggedIn = !!req.auth
  const role       = req.auth?.user?.role

  const rewritePath   = subdomain ? resolveRewrite(subdomain, pathname) : null
  const effectivePath = rewritePath ?? pathname

  // Unauthenticated — redirect to login subdomain
  if ((effectivePath.startsWith('/dashboard') || effectivePath.startsWith('/admin')) && !isLoggedIn) {
    const target = PLATFORM_DOMAIN
      ? `https://login.${PLATFORM_DOMAIN}`
      : new URL('/login', req.nextUrl.origin).href
    return NextResponse.redirect(target)
  }

  // Non-admin trying to access admin
  if (effectivePath.startsWith('/admin') && role !== 'ADMIN') {
    const target = PLATFORM_DOMAIN
      ? `https://dashboard.${PLATFORM_DOMAIN}`
      : new URL('/dashboard', req.nextUrl.origin).href
    return NextResponse.redirect(target)
  }

  // Already logged in visiting login
  if (effectivePath.startsWith('/login') && isLoggedIn) {
    const target = PLATFORM_DOMAIN
      ? `https://dashboard.${PLATFORM_DOMAIN}`
      : new URL('/dashboard', req.nextUrl.origin).href
    return NextResponse.redirect(target)
  }

  if (rewritePath) {
    const url      = req.nextUrl.clone()
    url.pathname   = rewritePath
    return NextResponse.rewrite(url)
  }
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
