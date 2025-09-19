import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()
    
    console.log("Received form configuration:", JSON.stringify(formData, null, 2))

    // Create or update form configuration
    const form = await prisma.formConfig.upsert({
      where: {
        id: formData.id
      },
      update: {
        name: formData.name,
        description: formData.description,
        fields: JSON.stringify(formData.fields),
        settings: JSON.stringify(formData.settings),
        updatedAt: new Date()
      },
      create: {
        id: formData.id,
        name: formData.name,
        description: formData.description,
        fields: JSON.stringify(formData.fields),
        settings: JSON.stringify(formData.settings),
        isActive: true
      }
    })

    return NextResponse.json(
      { 
        message: "Form configuration saved successfully", 
        formId: form.id 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Form configuration error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const forms = await prisma.formConfig.findMany({
      include: {
        _count: {
          select: {
            submissions: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // Parse JSON fields for each form
    const parsedForms = forms.map(form => ({
      ...form,
      fields: JSON.parse(form.fields),
      settings: JSON.parse(form.settings),
      submissionCount: form._count.submissions
    }))

    return NextResponse.json(parsedForms)
  } catch (error) {
    console.error("Error fetching forms:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
