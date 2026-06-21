import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const { auth } = NextAuth(authConfig)

const PLATFORM_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? ''

function handleSubdomain(req: NextRequest) {
  const host     = req.headers.get('host') ?? ''
  const hostname = host.split(':')[0]

  if (hostname === 'localhost' || hostname === '127.0.0.1') return null
  if (!PLATFORM_DOMAIN) return null
  if (!hostname.endsWith(`.${PLATFORM_DOMAIN}`)) return null

  const subdomain = hostname.slice(0, -(PLATFORM_DOMAIN.length + 1))
  if (!subdomain || subdomain === 'www') return null

  if (req.nextUrl.pathname === '/') {
    const url    = req.nextUrl.clone()
    url.pathname = `/dj/${subdomain}`
    return NextResponse.rewrite(url)
  }

  return null
}

export const proxy = auth((req) => {
  const subdomainResponse = handleSubdomain(req)
  if (subdomainResponse) return subdomainResponse

  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const role = req.auth?.user?.role

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
