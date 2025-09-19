import { NextResponse } from "next/server"
import { createGoogleSheetsService } from "@/lib/google-sheets"

export async function GET() {
  try {
    // Check if environment variables are set
    const hasEmail = !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
    const hasKey = !!process.env.GOOGLE_PRIVATE_KEY
    
    if (!hasEmail || !hasKey) {
      return NextResponse.json({
        success: false,
        message: "Google Sheets environment variables not configured",
        details: {
          hasEmail,
          hasKey,
          email: hasEmail ? "✅ Set" : "❌ Missing",
          key: hasKey ? "✅ Set" : "❌ Missing"
        }
      })
    }

    // Test with a dummy sheet ID (this will fail but show if credentials work)
    const sheetsService = createGoogleSheetsService({
      sheetId: "test-sheet-id",
      serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      privateKey: process.env.GOOGLE_PRIVATE_KEY
    })

    return NextResponse.json({
      success: true,
      message: "Google Sheets environment variables are configured",
      details: {
        hasEmail: true,
        hasKey: true,
        email: "✅ Set",
        key: "✅ Set",
        note: "Environment variables are configured. Test with a real form submission."
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Error testing Google Sheets configuration",
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
}
