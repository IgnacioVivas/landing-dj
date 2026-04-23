import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  session: { strategy: 'jwt' as const },
  pages: { signIn: '/login' },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.slug = (user as { slug?: string }).slug as string
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      session.user.slug = token.slug as string
      return session
    },
  },
} satisfies NextAuthConfig
