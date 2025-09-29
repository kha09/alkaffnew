import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET /api/admin/orders - Get all orders with optional filters
export async function GET(request: NextRequest) {
  try {
    // Check if user is admin (would need to implement auth)
    // const session = await getServerSession(authOptions)
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { searchParams } = new URL(request.url)
    const adminStatus = searchParams.get('adminStatus')
    const paymentStatus = searchParams.get('paymentStatus')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where: any = {}
    
    if (adminStatus && adminStatus !== 'all') {
      where.adminStatus = adminStatus
    }
    
    if (paymentStatus && paymentStatus !== 'all') {
      where.paymentStatus = paymentStatus
    }

    const orders = await prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        dateCreated: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        formSubmission: {
          select: {
            id: true,
            fullName: true,
            preferredProgram: true
          }
        },
        agent: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    const total = await prisma.order.count({ where })

    return NextResponse.json({
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الطلبات' },
      { status: 500 }
    )
  }
}

// POST /api/admin/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    // Check if user is admin (would need to implement auth)
    // const session = await getServerSession(authOptions)
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const body = await request.json()
    
    const { userId, formSubmissionId, agentId } = body

    // Validate required fields
    if (userId === undefined || userId === null || userId === 0) {
      return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 })
    }

    const order = await prisma.order.create({
      data: {
        userId,
        formSubmissionId: formSubmissionId || null,
        agentId: agentId || null,
        agentStatus: 'Created by Agent',
        adminStatus: 'Pending',
        paymentStatus: 'unpaid',
        dateCreated: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        formSubmission: {
          select: {
            id: true,
            fullName: true,
            preferredProgram: true
          }
        },
        agent: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء الطلب' },
      { status: 500 }
    )
  }
}
