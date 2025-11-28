import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import db from '@/lib/db'

// GET - List all note templates
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const isActive = searchParams.get('isActive')

    const whereClause: any = {}
    
    if (category && category !== 'all') {
      whereClause.category = category
    }
    
    if (isActive !== null) {
      whereClause.isActive = isActive === 'true'
    }

    const templates = await db.noteTemplate.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { sentNotes: true }
        }
      }
    })

    return NextResponse.json(templates)
  } catch (error) {
    console.error('Error fetching note templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch note templates' },
      { status: 500 }
    )
  }
}

// POST - Create new note template
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
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

    // Check if template with same title already exists
    const existingTemplate = await db.noteTemplate.findFirst({
      where: { title }
    })

    if (existingTemplate) {
      return NextResponse.json(
        { error: 'Template with this title already exists' },
        { status: 400 }
      )
    }

    const template = await db.noteTemplate.create({
      data: {
        title,
        content,
        category: category || 'general',
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json(template, { status: 201 })
  } catch (error) {
    console.error('Error creating note template:', error)
    return NextResponse.json(
      { error: 'Failed to create note template' },
      { status: 500 }
    )
  }
}
