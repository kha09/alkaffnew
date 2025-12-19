import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET /api/admin/commissions - Get all commissions with optional filters
export async function GET(request: NextRequest) {
  try {
    // Check if user is admin (would need to implement auth)
    // const session = await getServerSession(authOptions)
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const agentId = searchParams.get('agentId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where: any = {}
    
    if (status && status !== 'all') {
      where.status = status
    }
    
    if (agentId && agentId !== 'all') {
      where.agentId = parseInt(agentId)
    }

    const commissions = await prisma.commission.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        requestedAt: 'desc'
      },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        order: {
          select: {
            id: true,
            formSubmission: {
              select: {
                fullName: true
              }
            },
            adminStatus: true,
            paymentStatus: true,
            dateCreated: true
          }
        }
      }
    })

    const total = await prisma.commission.count({ where })

    return NextResponse.json({
      commissions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    })
  } catch (error) {
    console.error('Error fetching commissions:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب بيانات العمولات' },
      { status: 500 }
    )
  }
}

// POST /api/admin/commissions - Create a new commission manually
export async function POST(request: NextRequest) {
  try {
    // Check if user is admin (would need to implement auth)
    // const session = await getServerSession(authOptions)
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const body = await request.json()
    
    const { agentId, orderId, amount, notes } = body

    // Validate required fields
    if (!agentId || !orderId || !amount) {
      return NextResponse.json({ error: 'الوكيل، الطلب، والمبلغ مطلوبان' }, { status: 400 })
    }

    // Check if agent exists
    const agent = await prisma.agent.findUnique({
      where: { id: agentId }
    })

    if (!agent) {
      return NextResponse.json({ error: 'الوكيل غير موجود' }, { status: 404 })
    }

    // First, try to find an existing order
    let order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        formSubmission: {
          select: {
            fullName: true
          }
        }
      }
    })

    // If order doesn't exist, try to find a form submission and create an order
    if (!order) {
      const formSubmission = await prisma.formSubmission.findUnique({
        where: { id: orderId }
      })

      if (!formSubmission) {
        return NextResponse.json({ error: 'الطلب أو التقديم غير موجود' }, { status: 404 })
      }

      // Create an order from the form submission
      order = await prisma.order.create({
        data: {
          userId: formSubmission.userId || 1, // Default user ID if not linked
          formSubmissionId: formSubmission.id,
          agentId: agentId,
          adminStatus: 'Accepted by University', // Set as completed for commission
          paymentStatus: 'paid',
          submissionStatus: 'completed'
        },
        include: {
          formSubmission: {
            select: {
              fullName: true
            }
          }
        }
      })
    }

    // Check if commission already exists for this order
    const existingCommission = await prisma.commission.findFirst({
      where: { orderId: order.id }
    })

    if (existingCommission) {
      return NextResponse.json({ error: 'توجد عمولة لهذا الطلب بالفعل' }, { status: 400 })
    }

    const commission = await prisma.commission.create({
      data: {
        agentId,
        orderId: order.id,
        amount,
        status: 'pending',
        notes: notes || null,
        requestedAt: new Date()
      },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        order: {
          select: {
            id: true,
            formSubmission: {
              select: {
                fullName: true
              }
            },
            adminStatus: true,
            paymentStatus: true,
            dateCreated: true
          }
        }
      }
    })

    return NextResponse.json(commission, { status: 201 })
  } catch (error) {
    console.error('Error creating commission:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء العمولة' },
      { status: 500 }
    )
  }
}
