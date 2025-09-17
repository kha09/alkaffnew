import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// PUT /api/admin/orders/[id] - Update an order
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin (would need to implement auth)
    // const session = await getServerSession(authOptions)
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const orderId = parseInt(params.id)
    if (isNaN(orderId)) {
      return NextResponse.json({ error: 'معرف الطلب غير صالح' }, { status: 400 })
    }

    const body = await request.json()
    
    const { userId, formSubmissionId, agentId, price, status, paymentStatus, receipt } = body

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!existingOrder) {
      return NextResponse.json({ error: 'الطلب غير موجود' }, { status: 404 })
    }

    // Validate required fields if they are being updated
    if (userId !== undefined && (userId === null || userId === 0)) {
      return NextResponse.json({ error: 'معرف المستخدم مطلوب' }, { status: 400 })
    }
    
    if (price !== undefined && (price === null || price === 0)) {
      return NextResponse.json({ error: 'السعر مطلوب' }, { status: 400 })
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        userId: userId !== undefined ? userId : existingOrder.userId,
        formSubmissionId: formSubmissionId !== undefined ? formSubmissionId : existingOrder.formSubmissionId,
        agentId: agentId !== undefined ? agentId : existingOrder.agentId,
        price: price !== undefined ? price : existingOrder.price,
        status: status !== undefined ? status : existingOrder.status,
        paymentStatus: paymentStatus !== undefined ? paymentStatus : existingOrder.paymentStatus,
        receipt: receipt !== undefined ? receipt : existingOrder.receipt,
        updatedAt: new Date()
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

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث الطلب' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/orders/[id] - Delete an order
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin (would need to implement auth)
    // const session = await getServerSession(authOptions)
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const orderId = parseInt(params.id)
    if (isNaN(orderId)) {
      return NextResponse.json({ error: 'معرف الطلب غير صالح' }, { status: 400 })
    }

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!existingOrder) {
      return NextResponse.json({ error: 'الطلب غير موجود' }, { status: 404 })
    }

    await prisma.order.delete({
      where: { id: orderId }
    })

    return NextResponse.json({ message: 'تم حذف الطلب بنجاح' })
  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حذف الطلب' },
      { status: 500 }
    )
  }
}
