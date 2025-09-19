import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const leadData = await request.json()
    
    console.log("Received lead data:", JSON.stringify(leadData, null, 2))

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'businessType', 'industry', 'teamSize', 'platforms', 'postFrequency', 'budget', 'goals', 'timeline']
    
    for (const field of requiredFields) {
      if (!leadData[field] || (Array.isArray(leadData[field]) && leadData[field].length === 0)) {
        return NextResponse.json(
          { message: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Create lead in database
    const lead = await prisma.lead.create({
      data: {
        // Personal Information
        firstName: leadData.firstName,
        lastName: leadData.lastName,
        email: leadData.email,
        phone: leadData.phone || null,
        company: leadData.company || null,
        website: leadData.website || null,
        
        // Business Information
        businessType: leadData.businessType,
        industry: leadData.industry,
        teamSize: leadData.teamSize,
        currentSocialMedia: leadData.currentSocialMedia || null,
        
        // Requirements
        platforms: JSON.stringify(leadData.platforms),
        postFrequency: leadData.postFrequency,
        budget: leadData.budget,
        goals: leadData.goals,
        challenges: leadData.challenges || null,
        timeline: leadData.timeline,
        
        // Additional Information
        currentTools: leadData.currentTools || null,
        expectations: leadData.expectations || null,
        additionalInfo: leadData.additionalInfo || null,
        
        // Marketing Preferences
        newsletter: leadData.newsletter || false,
        updates: leadData.updates || false,
        demo: leadData.demo || false,
        
        // UTM Tracking
        utmSource: leadData.utmSource || null,
        utmMedium: leadData.utmMedium || null,
        utmCampaign: leadData.utmCampaign || null,
        utmTerm: leadData.utmTerm || null,
        utmContent: leadData.utmContent || null,
        utmId: leadData.utmId || null,
        referrer: leadData.referrer || null,
        landingPage: leadData.landingPage || null,
        
        // Status
        status: 'NEW',
        source: 'LEAD_FORM'
      }
    })

    // Here you could also:
    // 1. Send email notification to your team
    // 2. Add to CRM system
    // 3. Send welcome email to the lead
    // 4. Add to email marketing list

    return NextResponse.json(
      { 
        message: "Lead submitted successfully", 
        leadId: lead.id 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Lead submission error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Limit to last 50 leads
    })

    return NextResponse.json(leads)
  } catch (error) {
    console.error("Error fetching leads:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
