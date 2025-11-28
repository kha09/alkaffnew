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
          // First, try to find user in User table
          const user = await (prisma.user as any).findFirst({
            where: {
              OR: [
                { username: credentials.username },
                { email: credentials.username }
              ]
            }
          })

          if (user) {
            // Verify password
            const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

            if (isPasswordValid) {
              // Return user object
              return {
                id: user.id.toString(),
                name: user.fullName,
                email: user.email,
                role: user.role,
                username: user.username
              }
            }
          }

          // If not found in User table, try Agent table
          const agent = await (prisma.agent as any).findFirst({
            where: {
              email: credentials.username
            }
          })

          if (agent && agent.password) {
            // Verify password
            const isPasswordValid = await bcrypt.compare(credentials.password, agent.password)

            if (isPasswordValid) {
              // Return agent as user object
              return {
                id: agent.id.toString(),
                name: agent.name,
                email: agent.email,
                role: "agent",
                username: agent.email // Use email as username for agents
              }
            }
          }

          return null
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
