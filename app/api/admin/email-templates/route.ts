import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

// GET - List all email templates
export async function GET() {
  try {
    const templates = await db.emailTemplate.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { sentEmails: true }
        }
      }
    })

    return NextResponse.json(templates)
  } catch (error) {
    console.error('Error fetching email templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch email templates' },
      { status: 500 }
    )
  }
}

// POST - Create new email template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, subject, body: templateBody, templateType, description, isActive } = body

    // Validate required fields
    if (!name || !subject || !templateBody) {
      return NextResponse.json(
        { error: 'Name, subject, and body are required' },
        { status: 400 }
      )
    }

    // Check if template name already exists
    const existingTemplate = await db.emailTemplate.findUnique({
      where: { name }
    })

    if (existingTemplate) {
      return NextResponse.json(
        { error: 'Template name already exists' },
        { status: 400 }
      )
    }

    const template = await db.emailTemplate.create({
      data: {
        name,
        subject,
        body: templateBody,
        templateType: templateType || 'standard',
        description,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json(template, { status: 201 })
  } catch (error) {
    console.error('Error creating email template:', error)
    return NextResponse.json(
      { error: 'Failed to create email template' },
      { status: 500 }
    )
  }
}
