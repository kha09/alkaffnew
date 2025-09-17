import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET /api/admin/agents - Fetch all agents
export async function GET(request: NextRequest) {
  try {
    // Check if user is admin (would need to implement auth)
    // const session = await getServerSession(authOptions)
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    // Build where clause for filtering
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Fetch agents
    const agents = await prisma.agent.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Get total count for pagination
    const total = await prisma.agent.count({ where })

    return NextResponse.json({
      agents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الوكلاء' },
      { status: 500 }
    )
  }
}

// POST /api/admin/agents - Create a new agent
export async function POST(request: NextRequest) {
  try {
    // Check if user is admin (would need to implement auth)
    // const session = await getServerSession(authOptions)
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const data = await request.json()
    
    // Validate required fields
    if (!data.name || !data.email) {
      return NextResponse.json({ error: 'الاسم والبريد الإلكتروني مطلوبان' }, { status: 400 })
    }

    // Check if agent with this email already exists
    const existingAgent = await prisma.agent.findUnique({
      where: { email: data.email }
    })

    if (existingAgent) {
      return NextResponse.json({ error: 'وكيل مع هذا البريد الإلكتروني موجود بالفعل' }, { status: 400 })
    }

    // Create the agent
    const agent = await prisma.agent.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null
      }
    })

    return NextResponse.json(agent, { status: 201 })
  } catch (error) {
    console.error('Error creating agent:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء الوكيل' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/agents/:id - Update an agent
export async function PUT(request: NextRequest) {
  try {
    // Check if user is admin (would need to implement auth)
    // const session = await getServerSession(authOptions)
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const url = new URL(request.url)
    const pathParts = url.pathname.split('/')
    const id = parseInt(pathParts[pathParts.length - 1])
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const data = await request.json()
    
    // Check if agent exists
    const existingAgent = await prisma.agent.findUnique({
      where: { id }
    })

    if (!existingAgent) {
      return NextResponse.json({ error: 'الوكيل غير موجود' }, { status: 404 })
    }

    // Check if another agent with this email already exists
    if (data.email && data.email !== existingAgent.email) {
      const agentWithSameEmail = await prisma.agent.findUnique({
        where: { email: data.email }
      })

      if (agentWithSameEmail) {
        return NextResponse.json({ error: 'وكيل مع هذا البريد الإلكتروني موجود بالفعل' }, { status: 400 })
      }
    }

    // Update the agent
    const agent = await prisma.agent.update({
      where: { id },
      data: {
        name: data.name || existingAgent.name,
        email: data.email || existingAgent.email,
        phone: data.phone !== undefined ? data.phone : existingAgent.phone
      }
    })

    return NextResponse.json(agent)
  } catch (error) {
    console.error('Error updating agent:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث الوكيل' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/agents/:id - Delete an agent
export async function DELETE(request: NextRequest) {
  try {
    // Check if user is admin (would need to implement auth)
    // const session = await getServerSession(authOptions)
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const url = new URL(request.url)
    const pathParts = url.pathname.split('/')
    const id = parseInt(pathParts[pathParts.length - 1])
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    // Check if agent exists
    const existingAgent = await prisma.agent.findUnique({
      where: { id }
    })

    if (!existingAgent) {
      return NextResponse.json({ error: 'الوكيل غير موجود' }, { status: 404 })
    }

    // Delete the agent
    await prisma.agent.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'تم حذف الوكيل بنجاح' })
  } catch (error) {
    console.error('Error deleting agent:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حذف الوكيل' },
      { status: 500 }
    )
  }
}
