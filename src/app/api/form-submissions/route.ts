import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createGoogleSheetsService, FormSubmissionData } from "@/lib/google-sheets"

export async function POST(request: NextRequest) {
  try {
    const submissionData = await request.json()
    
    console.log("Received form submission:", JSON.stringify(submissionData, null, 2))

    // Get client IP and user agent
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Get form configuration to check for Google Sheets settings
    const formConfig = await prisma.formConfig.findUnique({
      where: { id: submissionData.formConfigId }
    })

    // Create form submission
    const submission = await prisma.formSubmission.create({
      data: {
        formConfigId: submissionData.formConfigId,
        data: JSON.stringify(submissionData.data),
        utmSource: submissionData.data.utmSource || null,
        utmMedium: submissionData.data.utmMedium || null,
        utmCampaign: submissionData.data.utmCampaign || null,
        utmTerm: submissionData.data.utmTerm || null,
        utmContent: submissionData.data.utmContent || null,
        utmId: submissionData.data.utmId || null,
        referrer: submissionData.data.referrer || null,
        landingPage: submissionData.data.landingPage || null,
        ipAddress: ipAddress,
        userAgent: userAgent
      }
    })

    // Send to Google Sheets if configured
    if (formConfig) {
      try {
        const settings = JSON.parse(formConfig.settings)
        if (settings.googleSheets && settings.googleSheets.enabled && settings.googleSheets.spreadsheetId) {
          console.log('Google Sheets integration enabled for form:', formConfig.id)
          console.log('Sheet ID:', settings.googleSheets.spreadsheetId)
          console.log('Worksheet Title:', settings.googleSheets.sheetName || 'Form Submissions')
          
          const sheetsService = createGoogleSheetsService({
            sheetId: settings.googleSheets.spreadsheetId,
            worksheetTitle: settings.googleSheets.sheetName || 'Form Submissions',
            serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            privateKey: process.env.GOOGLE_PRIVATE_KEY
          })

          const sheetsData: FormSubmissionData = {
            ...submissionData.data,
            timestamp: new Date().toISOString(),
            formId: formConfig.id,
            formName: formConfig.name
          }

          // Parse form fields from the form configuration
          const formFields = formConfig.fields ? JSON.parse(formConfig.fields) : null

          const sheetsSuccess = await sheetsService.addFormSubmission(sheetsData, formFields)
          if (sheetsSuccess) {
            console.log('Form submission successfully sent to Google Sheets')
          } else {
            console.warn('Failed to send form submission to Google Sheets')
          }
        }
      } catch (sheetsError) {
        console.error('Error sending to Google Sheets:', sheetsError)
        // Don't fail the entire request if Google Sheets fails
      }
    }

    return NextResponse.json(
      { 
        message: "Form submission received successfully", 
        submissionId: submission.id 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Form submission error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const formConfigId = searchParams.get('formConfigId')

    let whereClause = {}
    if (formConfigId) {
      whereClause = { formConfigId }
    }

    const submissions = await prisma.formSubmission.findMany({
      where: whereClause,
      include: {
        formConfig: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Parse JSON data for each submission
    const parsedSubmissions = submissions.map(submission => ({
      ...submission,
      data: JSON.parse(submission.data)
    }))

    return NextResponse.json(parsedSubmissions)
  } catch (error) {
    console.error("Error fetching form submissions:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
