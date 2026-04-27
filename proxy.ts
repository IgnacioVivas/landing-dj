import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

export const proxy = auth((req) => {
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
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login'],
}
