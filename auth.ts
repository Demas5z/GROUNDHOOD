import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

// Cookies are marked Secure only in production so local HTTP dev still works.
const useSecureCookies = process.env.NODE_ENV === 'production'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials)
        if (!parsed.success) return null

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        })
        if (!user) return null

        // Block login for soft-deleted accounts.
        if (user.deletedAt) return null

        const valid = await bcrypt.compare(parsed.data.password, user.password)
        if (!valid) return null

        // Block login until the email has been verified.
        if (!user.emailVerified) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // refresh the token at most once per day
  },
  cookies: {
    sessionToken: {
      name: `${useSecureCookies ? '__Secure-' : ''}authjs.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies,
      },
    },
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign-in
      if (user) {
        token.id = user.id as string
        token.role = (user as { role?: string }).role ?? 'user'
        return token
      }

      // Subsequent requests: verify the user still exists in DB.
      // Returning null invalidates the session — the user is logged out.
      // This handles cases like DB resets or account deletion mid-session.
      if (token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { role: true, deletedAt: true },
          })
          // Force logout if the account was removed or soft-deleted mid-session.
          if (!dbUser || dbUser.deletedAt) return null
          token.role = dbUser.role
        } catch {
          // DB unavailable: keep existing token, don't force logout
        }
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      session.user.role = token.role as string
      return session
    },
  },
})
