import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  debug: process.env.NODE_ENV === 'development',
  trustHost: true, // Critical for Vercel deployment
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await db.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          role: user.role,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      // On sign in, set initial role
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.email = user.email
      }
      
      // Always fetch fresh user data from database to get latest role
      // This ensures role changes are reflected immediately
      if (token.sub) {
        try {
          const dbUser = await db.user.findUnique({
            where: { id: token.sub },
            select: { role: true, isActive: true, email: true }
          })
          
          if (dbUser) {
            token.role = dbUser.role
            token.isActive = dbUser.isActive
            token.email = dbUser.email
          }
        } catch (error) {
          console.error('Error fetching user in JWT callback:', error)
        }
      }
      
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string
        session.user.role = token.role as string
        session.user.isActive = token.isActive as boolean
        session.user.email = token.email as string
      }
      return session
    },
  },
}