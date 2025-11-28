import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import db from '@/lib/db'

// GET - Get specific note template
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const params = await context.params
    const templateId = parseInt(params.id)

    if (isNaN(templateId)) {
      return NextResponse.json(
        { error: 'Invalid template ID' },
        { status: 400 }
      )
    }

    const template = await db.noteTemplate.findUnique({
      where: { id: templateId },
      include: {
        _count: {
          select: { sentNotes: true }
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
    console.error('Error fetching note template:', error)
    return NextResponse.json(
      { error: 'Failed to fetch note template' },
      { status: 500 }
    )
  }
}

// PUT - Update note template
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const params = await context.params
    const templateId = parseInt(params.id)

    if (isNaN(templateId)) {
      return NextResponse.json(
        { error: 'Invalid template ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { title, content, category, isActive } = body

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Check if template exists
    const existingTemplate = await db.noteTemplate.findUnique({
      where: { id: templateId }
    })

    if (!existingTemplate) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Check if new title conflicts with another template
    if (title !== existingTemplate.title) {
      const titleConflict = await db.noteTemplate.findFirst({
        where: { 
          title,
          id: { not: templateId }
        }
      })

      if (titleConflict) {
        return NextResponse.json(
          { error: 'Template with this title already exists' },
          { status: 400 }
        )
      }
    }

    const updatedTemplate = await db.noteTemplate.update({
      where: { id: templateId },
      data: {
        title,
        content,
        category: category || 'general',
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json(updatedTemplate)
  } catch (error) {
    console.error('Error updating note template:', error)
    return NextResponse.json(
      { error: 'Failed to update note template' },
      { status: 500 }
    )
  }
}

// DELETE - Delete note template
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const params = await context.params
    const templateId = parseInt(params.id)

    if (isNaN(templateId)) {
      return NextResponse.json(
        { error: 'Invalid template ID' },
        { status: 400 }
      )
    }

    // Check if template exists
    const existingTemplate = await db.noteTemplate.findUnique({
      where: { id: templateId }
    })

    if (!existingTemplate) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Check if template is being used in sent notes
    const sentNotesCount = await db.sentNote.count({
      where: { templateId }
    })

    if (sentNotesCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete template that has been used in sent notes' },
        { status: 400 }
      )
    }

    await db.noteTemplate.delete({
      where: { id: templateId }
    })

    return NextResponse.json({ message: 'Template deleted successfully' })
  } catch (error) {
    console.error('Error deleting note template:', error)
    return NextResponse.json(
      { error: 'Failed to delete note template' },
      { status: 500 }
    )
  }
}
