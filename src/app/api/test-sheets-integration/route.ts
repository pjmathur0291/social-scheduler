import { NextRequest, NextResponse } from "next/server"
import { createGoogleSheetsService, FormSubmissionData } from "@/lib/google-sheets"

export async function POST(request: NextRequest) {
  try {
    const { spreadsheetId, sheetName } = await request.json()
    
    if (!spreadsheetId) {
      return NextResponse.json({
        success: false,
        message: "Spreadsheet ID is required"
      }, { status: 400 })
    }

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

    console.log('Testing Google Sheets integration with:')
    console.log('- Spreadsheet ID:', spreadsheetId)
    console.log('- Sheet Name:', sheetName || 'Form Submissions')
    console.log('- Service Account:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL)

    // Create Google Sheets service
    const sheetsService = createGoogleSheetsService({
      sheetId: spreadsheetId,
      worksheetTitle: sheetName || 'Form Submissions',
      serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      privateKey: process.env.GOOGLE_PRIVATE_KEY
    })

    // Test connection
    const connectionTest = await sheetsService.testConnection()
    if (!connectionTest) {
      return NextResponse.json({
        success: false,
        message: "Failed to connect to Google Sheets. Please check if the sheet is shared with the service account.",
        serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
      })
    }

    // Test adding a sample submission with sample form fields
    const testFormFields = [
      { id: 'field-1', type: 'text', label: 'Full Name', required: true },
      { id: 'field-2', type: 'email', label: 'Email Address', required: true },
      { id: 'field-3', type: 'phone', label: 'Phone Number', required: false },
      { id: 'field-4', type: 'textarea', label: 'Message', required: false }
    ]

    const testData: FormSubmissionData = {
      'field-1': 'Test User',
      'field-2': 'test@example.com',
      'field-3': '+1234567890',
      'field-4': 'This is a test submission to verify Google Sheets integration.',
      timestamp: new Date().toISOString(),
      formId: 'test-form',
      formName: 'Test Form',
      utmSource: 'test',
      utmMedium: 'integration-test',
      utmCampaign: 'automation-test',
      landingPage: 'https://example.com/test'
    }

    const addTestResult = await sheetsService.addFormSubmission(testData, testFormFields)
    
    if (addTestResult) {
      return NextResponse.json({
        success: true,
        message: "Google Sheets integration test successful!",
        details: {
          spreadsheetId,
          sheetName: sheetName || 'Form Submissions',
          serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          testDataAdded: true,
          note: "A test row has been added to your Google Sheet to verify the integration works."
        }
      })
    } else {
      return NextResponse.json({
        success: false,
        message: "Failed to add test data to Google Sheets",
        details: {
          spreadsheetId,
          sheetName: sheetName || 'Form Submissions',
          serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
        }
      })
    }

  } catch (error) {
    console.error('Google Sheets integration test error:', error)
    return NextResponse.json({
      success: false,
      message: "Error testing Google Sheets integration",
      error: error instanceof Error ? error.message : "Unknown error",
      details: {
        serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
      }
    })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST method to test Google Sheets integration",
    requiredFields: ["spreadsheetId"],
    optionalFields: ["sheetName"],
    example: {
      spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
      sheetName: "Form Submissions"
    }
  })
}
