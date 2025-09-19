import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { twoFactorAuthService } from "@/lib/two-factor-auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { secret, token, backupCodes } = await request.json()

    if (!secret || !token) {
      return NextResponse.json(
        { message: "Secret and token are required" },
        { status: 400 }
      )
    }

    // Verify the token
    const isValid = twoFactorAuthService.verifyToken(secret, token)

    if (isValid) {
      // Save the 2FA configuration to the database
      await prisma.user.update({
        where: { email: session.user.email },
        data: {
          twoFactorEnabled: true,
          twoFactorSecret: secret,
          backupCodes: backupCodes ? JSON.stringify(backupCodes) : null
        }
      })

      return NextResponse.json({
        success: true,
        message: "2FA setup successful"
      })
    } else {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error("Error verifying 2FA token:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
