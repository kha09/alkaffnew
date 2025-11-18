import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

// GET - Get specific email template
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const templateId = parseInt(params.id)

    if (isNaN(templateId)) {
      return NextResponse.json(
        { error: 'Invalid template ID' },
        { status: 400 }
      )
    }

    const template = await db.emailTemplate.findUnique({
      where: { id: templateId },
      include: {
        _count: {
          select: { sentEmails: true }
        }
      }
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(template)
  } catch (error) {
    console.error('Error fetching email template:', error)
    return NextResponse.json(
      { error: 'Failed to fetch email template' },
      { status: 500 }
    )
  }
}

// PUT - Update email template
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const templateId = parseInt(params.id)

    if (isNaN(templateId)) {
      return NextResponse.json(
        { error: 'Invalid template ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { name, subject, body: templateBody, templateType, description, isActive } = body

    // Validate required fields
    if (!name || !subject || !templateBody) {
      return NextResponse.json(
        { error: 'Name, subject, and body are required' },
        { status: 400 }
      )
    }

    // Check if template exists
    const existingTemplate = await db.emailTemplate.findUnique({
      where: { id: templateId }
    })

    if (!existingTemplate) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Check if new name conflicts with another template
    if (name !== existingTemplate.name) {
      const nameConflict = await db.emailTemplate.findUnique({
        where: { name }
      })

      if (nameConflict) {
        return NextResponse.json(
          { error: 'Template name already exists' },
          { status: 400 }
        )
      }
    }

    const updatedTemplate = await db.emailTemplate.update({
      where: { id: templateId },
      data: {
        name,
        subject,
        body: templateBody,
        templateType: templateType || 'standard',
        description,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json(updatedTemplate)
  } catch (error) {
    console.error('Error updating email template:', error)
    return NextResponse.json(
      { error: 'Failed to update email template' },
      { status: 500 }
    )
  }
}

// DELETE - Delete email template
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const templateId = parseInt(params.id)

    if (isNaN(templateId)) {
      return NextResponse.json(
        { error: 'Invalid template ID' },
        { status: 400 }
      )
    }

    // Check if template exists
    const existingTemplate = await db.emailTemplate.findUnique({
      where: { id: templateId }
    })

    if (!existingTemplate) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    await db.emailTemplate.delete({
      where: { id: templateId }
    })

    return NextResponse.json({ message: 'Template deleted successfully' })
  } catch (error) {
    console.error('Error deleting email template:', error)
    return NextResponse.json(
      { error: 'Failed to delete email template' },
      { status: 500 }
    )
  }
}
