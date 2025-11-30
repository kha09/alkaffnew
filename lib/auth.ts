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
              // Find or create corresponding User entry for this agent
              let agentUser = await (prisma.user as any).findFirst({
                where: {
                  email: agent.email,
                  role: "agent"
                }
              })

              if (!agentUser) {
                // Create a User entry for this agent
                agentUser = await (prisma.user as any).create({
                  data: {
                    username: agent.email,
                    password: agent.password, // Use the same hashed password
                    email: agent.email,
                    fullName: agent.name,
                    role: "agent"
                  }
                })
              }

              // Return the User ID instead of Agent ID
              return {
                id: agentUser.id.toString(),
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
        token.sub = user.id // Explicitly set the user ID in the token
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
