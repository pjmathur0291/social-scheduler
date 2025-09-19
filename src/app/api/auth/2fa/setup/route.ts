import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { twoFactorAuthService } from "@/lib/two-factor-auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    // Generate 2FA secret and QR code
    const twoFactorConfig = twoFactorAuthService.generateSecret(session.user.email)
    
    // Generate QR code data URL
    const qrCodeDataUrl = await twoFactorAuthService.generateQRCode(twoFactorConfig.qrCodeUrl)

    return NextResponse.json({
      secret: twoFactorConfig.secret,
      qrCodeUrl: twoFactorConfig.qrCodeUrl,
      qrCodeDataUrl,
      backupCodes: twoFactorConfig.backupCodes
    })

  } catch (error) {
    console.error("Error setting up 2FA:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
