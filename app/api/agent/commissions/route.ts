import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from "@/lib/db";

// GET /api/agent/commissions - Get all commissions for the agent
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    if (session.user.role !== 'agent') {
      return NextResponse.json({ error: 'غير مصرح للوصول' }, { status: 403 })
    }

    // Get the agent record using the user's email
    const agent = await prisma.agent.findUnique({
      where: { email: session.user.email! }
    })

    if (!agent) {
      return NextResponse.json({ error: 'الوكيل غير موجود' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where: any = { agentId: agent.id }
    
    if (status && status !== 'all') {
      where.status = status
    }

    const commissions = await prisma.commission.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        requestedAt: 'desc'
      },
      include: {
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
    });
  } catch (error) {
    console.error("Error fetching agent commissions:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب بيانات العمولات" },
      { status: 500 }
    );
  }
}

// POST /api/agent/commissions - Create a new commission request
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    if (session.user.role !== 'agent') {
      return NextResponse.json({ error: 'غير مصرح للوصول' }, { status: 403 })
    }

    // Get the agent record using the user's email
    const agent = await prisma.agent.findUnique({
      where: { email: session.user.email! }
    })

    if (!agent) {
      return NextResponse.json({ error: 'الوكيل غير موجود' }, { status: 404 })
    }

    const body = await request.json();
    
    const { orderId, amount, notes } = body;

    // Validate required fields
    if (!orderId || !amount) {
      return NextResponse.json({ error: 'الطلب والمبلغ مطلوبان' }, { status: 400 });
    }

    // Check if order exists and belongs to this agent
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return NextResponse.json({ error: 'الطلب غير موجود' }, { status: 404 });
    }

    if (order.agentId !== agent.id) {
      return NextResponse.json({ error: 'ليس لديك صلاحية لإنشاء عمولة لهذا الطلب' }, { status: 403 });
    }

    if (order.adminStatus !== 'Accepted by University') {
      return NextResponse.json({ error: 'يمكن طلب عمولة فقط للطلبات المكتملة' }, { status: 400 });
    }

    // Check if commission already exists for this order
    const existingCommission = await prisma.commission.findUnique({
      where: { orderId: orderId }
    });

    if (existingCommission) {
      return NextResponse.json({ error: 'توجد طلب عمولة لهذا الطلب بالفعل' }, { status: 400 });
    }

    const commission = await prisma.commission.create({
      data: {
        agentId: agent.id,
        orderId,
        amount,
        status: 'pending',
        notes: notes || null,
        requestedAt: new Date()
      },
      include: {
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
    });

    return NextResponse.json(commission, { status: 201 });
  } catch (error) {
    console.error("Error creating commission:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إنشاء طلب العمولة" },
      { status: 500 }
    );
  }
}
