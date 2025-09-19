import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const form = await prisma.formConfig.findUnique({
      where: {
        id: id
      },
      include: {
        _count: {
          select: {
            submissions: true
          }
        }
      }
    })

    if (!form) {
      return NextResponse.json(
        { message: "Form not found" },
        { status: 404 }
      )
    }

    // Parse JSON fields and settings
    const parsedForm = {
      ...form,
      fields: JSON.parse(form.fields),
      settings: JSON.parse(form.settings)
    }

    return NextResponse.json(parsedForm)
  } catch (error) {
    console.error("Error fetching form:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const updateData = await request.json()

    const form = await prisma.formConfig.update({
      where: {
        id: id
      },
      data: {
        name: updateData.name,
        description: updateData.description,
        fields: JSON.stringify(updateData.fields),
        settings: JSON.stringify(updateData.settings),
        isActive: updateData.isActive,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(form)
  } catch (error) {
    console.error("Error updating form:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.formConfig.delete({
      where: {
        id: id
      }
    })

    return NextResponse.json(
      { message: "Form deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error deleting form:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
