import type { NextAuthConfig } from 'next-auth'
import type { Role } from '@prisma/client'

export const authConfig = {
  session: { strategy: 'jwt' as const },
  pages: { signIn: '/login' },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id   = user.id as string
        token.slug = (user as { slug?: string }).slug as string
        token.role = (user as { role?: Role }).role as Role
      }
      return token
    },
    session({ session, token }) {
      session.user.id   = token.id   as string
      session.user.slug = token.slug as string
      session.user.role = token.role as Role
      return session
    },
  },
} satisfies NextAuthConfig
