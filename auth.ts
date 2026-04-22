import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from '@/lib/db'
import { verifyPassword } from '@/lib/auth-utils'
import { loginSchema } from '@/lib/validations/auth'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const user = await db.user.findUnique({
          where: { email: parsed.data.email },
          select: { id: true, email: true, djName: true, slug: true, password: true },
        })
        if (!user?.password) return null

        const valid = await verifyPassword(parsed.data.password, user.password)
        if (!valid) return null

        return { id: user.id, email: user.email, name: user.djName, slug: user.slug }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.slug = user.slug
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      session.user.slug = token.slug as string
      return session
    },
  },
})
