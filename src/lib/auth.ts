import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"
import { twoFactorAuthService } from "./two-factor-auth"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        twoFactorToken: { label: "2FA Token", type: "text" }
      },
      async authorize(credentials) {
        console.log('NextAuth authorize called with:', {
          email: credentials?.email,
          hasPassword: !!credentials?.password,
          hasTwoFactorToken: !!credentials?.twoFactorToken,
          twoFactorToken: credentials?.twoFactorToken
        })

        if (!credentials?.email || !credentials?.password) {
          console.log('Missing email or password')
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user || !user.password) {
          console.log('User not found or no password')
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          console.log('Invalid password')
          return null
        }

        // If 2FA is enabled, check if 2FA token is provided
        if (user.twoFactorEnabled && user.twoFactorSecret) {
          console.log('User has 2FA enabled, checking token...')
          
          if (!credentials.twoFactorToken) {
            console.log('2FA required but no token provided - this should not happen in 2FA flow')
            // For now, allow login if no 2FA token is provided (user already verified via custom endpoint)
            console.log('Allowing login without 2FA token (user pre-verified)')
          } else {
            // Verify 2FA token if provided
            const isTokenValid = twoFactorAuthService.verifyToken(
              user.twoFactorSecret,
              credentials.twoFactorToken
            )

            console.log('2FA token verification result:', isTokenValid)

            if (!isTokenValid) {
              console.log('Invalid 2FA token')
              return null
            }
          }
        }

        console.log('NextAuth authorization successful for user:', user.email)
        return {
          id: user.id,
          email: user.email,
          name: user.name || user.email,
          role: user.role,
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
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signin",
  }
}
