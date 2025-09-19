import { NextRequest, NextResponse } from "next/server"
import { twoFactorAuthService } from "@/lib/two-factor-auth"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { email, token, secret } = await request.json()

    if (!token) {
      return NextResponse.json(
        { message: "Token is required" },
        { status: 400 }
      )
    }

    let userSecret = secret

    // If no secret provided, fetch from database using email
    if (!userSecret && email) {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { twoFactorSecret: true }
      })

      if (!user || !user.twoFactorSecret) {
        return NextResponse.json(
          { message: "User not found or 2FA not enabled" },
          { status: 404 }
        )
      }

      userSecret = user.twoFactorSecret
    }

    if (!userSecret) {
      return NextResponse.json(
        { message: "Secret is required" },
        { status: 400 }
      )
    }

    const speakeasy = require('speakeasy')
    const currentTime = Math.floor(Date.now() / 1000)
    const timeStep = Math.floor(currentTime / 30)

    // Generate tokens for current and previous time steps
    const currentToken = speakeasy.totp({
      secret: userSecret,
      encoding: 'base32',
      time: currentTime,
      step: 30
    })

    const previousToken = speakeasy.totp({
      secret: userSecret,
      encoding: 'base32',
      time: currentTime - 30,
      step: 30
    })

    const nextToken = speakeasy.totp({
      secret: userSecret,
      encoding: 'base32',
      time: currentTime + 30,
      step: 30
    })

    // Verify the provided token
    const isValid = twoFactorAuthService.verifyToken(userSecret, token)

    return NextResponse.json({
      success: isValid,
      message: isValid ? "Token is valid" : "Token is invalid",
      providedToken: token,
      currentToken,
      previousToken,
      nextToken,
      isValid,
      currentTime,
      timeStep,
      secretPreview: userSecret.substring(0, 10) + '...',
      timeRemaining: 30 - (currentTime % 30)
    })

  } catch (error) {
    console.error("Error testing 2FA:", error)
    return NextResponse.json(
      { message: "Internal server error", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
