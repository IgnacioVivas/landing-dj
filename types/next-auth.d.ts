import type { DefaultSession } from 'next-auth'
import type { Role } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      slug: string
      role: Role
    } & DefaultSession['user']
  }

  interface User {
    slug: string
    role: Role
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    slug: string
    role: Role
  }
}
