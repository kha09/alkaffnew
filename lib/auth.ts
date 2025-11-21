import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import prisma from "@/lib/db"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        try {
          // Check if we're using mock data
          const useMockData = process.env.USE_MOCK_DATA === 'true' || process.env.NODE_ENV === 'production'
          
          if (useMockData) {
            // Mock authentication using the mock database
            const mockDb = await import('@/lib/mockDb')
            const user = mockDb.default.users.find(u => u.username === credentials.username || u.email === credentials.username)
            
            if (!user) {
              return null
            }

            // Verify password using bcrypt
            const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

            if (!isPasswordValid) {
              return null
            }

            return {
              id: user.id.toString(),
              name: user.fullName,
              email: user.email,
              role: user.role,
              username: user.username
            }
          }

          // Real database authentication
          const user = await (prisma.user as any).findFirst({
            where: {
              OR: [
                { username: credentials.username },
                { email: credentials.username }
              ]
            }
          })

          if (!user) {
            return null
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            return null
          }

          // Return user object
          return {
            id: user.id.toString(),
            name: user.fullName,
            email: user.email,
            role: user.role,
            username: user.username
          }
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.username = user.username
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!
        session.user.role = token.role
        session.user.username = token.username
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key"
}
