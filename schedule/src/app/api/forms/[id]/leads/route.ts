import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Get the form configuration first
    const formConfig = await prisma.formConfig.findUnique({
      where: { id }
    })

    if (!formConfig) {
      return NextResponse.json(
        { message: "Form not found" },
        { status: 404 }
      )
    }

    // Get all form submissions for this form
    const submissions = await prisma.formSubmission.findMany({
      where: {
        formConfigId: id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Parse the submission data and format it for display
    const formattedLeads = submissions.map(submission => {
      const data = JSON.parse(submission.data)
      return {
        id: submission.id,
        formConfigId: submission.formConfigId,
        data: data,
        utmSource: submission.utmSource,
        utmMedium: submission.utmMedium,
        utmCampaign: submission.utmCampaign,
        utmTerm: submission.utmTerm,
        utmContent: submission.utmContent,
        utmId: submission.utmId,
        referrer: submission.referrer,
        landingPage: submission.landingPage,
        ipAddress: submission.ipAddress,
        userAgent: submission.userAgent,
        createdAt: submission.createdAt
      }
    })

    return NextResponse.json({
      formConfig: {
        id: formConfig.id,
        name: formConfig.name,
        description: formConfig.description,
        fields: JSON.parse(formConfig.fields),
        settings: JSON.parse(formConfig.settings)
      },
      leads: formattedLeads,
      totalCount: formattedLeads.length
    })
  } catch (error) {
    console.error("Error fetching form leads:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
