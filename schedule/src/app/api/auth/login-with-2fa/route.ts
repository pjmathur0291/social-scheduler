import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { twoFactorAuthService } from "@/lib/two-factor-auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, twoFactorToken } = await request.json()

    console.log('Login with 2FA request:', {
      email,
      hasPassword: !!password,
      hasTwoFactorToken: !!twoFactorToken
    })

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        role: true,
        twoFactorEnabled: true,
        twoFactorSecret: true
      }
    })

    if (!user || !user.password) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled && user.twoFactorSecret) {
      console.log('User has 2FA enabled:', {
        email: user.email,
        hasTwoFactorToken: !!twoFactorToken
      })

      if (!twoFactorToken) {
        console.log('2FA token required for user:', user.email)
        return NextResponse.json(
          { 
            message: "2FA token required",
            requires2FA: true,
            user: {
              id: user.id,
              email: user.email,
              name: user.name
            }
          },
          { status: 200 } // Return 200 but with requires2FA flag
        )
      }

      // Verify 2FA token
      const isTokenValid = twoFactorAuthService.verifyToken(
        user.twoFactorSecret,
        twoFactorToken
      )

      console.log('2FA token verification result:', {
        email: user.email,
        token: twoFactorToken,
        isValid: isTokenValid
      })

      if (!isTokenValid) {
        return NextResponse.json(
          { message: "Invalid 2FA token" },
          { status: 401 }
        )
      }
    }

    // All checks passed, return success
    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })

  } catch (error) {
    console.error("Error in login with 2FA:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
