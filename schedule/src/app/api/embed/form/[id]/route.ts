import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formId = params.id

    // Fetch form configuration
    const form = await prisma.formConfig.findUnique({
      where: { id: formId }
    })

    if (!form) {
      return NextResponse.json(
        { error: 'Form not found' },
        { status: 404 }
      )
    }

    // Parse form configuration
    const formConfig = {
      fields: JSON.parse(form.fields),
      settings: JSON.parse(form.settings)
    }

    // Return form data for embedding
    return NextResponse.json({
      success: true,
      form: {
        id: form.id,
        name: form.name,
        config: formConfig,
        fields: formConfig.fields || [],
        settings: formConfig.settings || {}
      }
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      }
    })

  } catch (error) {
    console.error('Error fetching form for embedding:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
