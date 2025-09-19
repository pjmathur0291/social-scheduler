import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const lead = await prisma.lead.findUnique({
      where: {
        id: id
      }
    })

    if (!lead) {
      return NextResponse.json(
        { message: "Lead not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(lead)
  } catch (error) {
    console.error("Error fetching lead:", error)
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

    const lead = await prisma.lead.update({
      where: {
        id: id
      },
      data: updateData
    })

    return NextResponse.json(lead)
  } catch (error) {
    console.error("Error updating lead:", error)
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
    await prisma.lead.delete({
      where: {
        id: id
      }
    })

    return NextResponse.json(
      { message: "Lead deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error deleting lead:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
