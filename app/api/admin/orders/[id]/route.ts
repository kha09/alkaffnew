import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// Function to map adminStatus to submissionStatus
function mapAdminStatusToSubmissionStatus(adminStatus: string): string {
  const statusMapping: { [key: string]: string } = {
    'Pending': 'submitted',
    'Approved': 'approved_by_admin',
    'Rejected': 'rejected_by_university',
    'Sent to University': 'sent_to_university',
    'Accepted by University': 'accepted_by_university',
    'Under Review': 'submitted'
  }
  
  return statusMapping[adminStatus] || 'submitted'
}

// PUT /api/admin/orders/[id] - Update an order
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin (would need to implement auth)
    // const session = await getServerSession(authOptions)
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { id } = await params
    const orderId = parseInt(id)
    if (isNaN(orderId)) {
      return NextResponse.json({ error: 'معرف الطلب غير صالح' }, { status: 400 })
    }

    const body = await request.json()
    
    const { userId, formSubmissionId, agentId, agentStatus, adminStatus, paymentStatus, submissionStatus, invoice, agentNotes, adminNotes } = body

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

    // Determine the final submissionStatus
    let finalSubmissionStatus = submissionStatus !== undefined ? submissionStatus : existingOrder.submissionStatus
    
    // If adminStatus is being updated, automatically sync submissionStatus
    if (adminStatus !== undefined && adminStatus !== existingOrder.adminStatus) {
      finalSubmissionStatus = mapAdminStatusToSubmissionStatus(adminStatus)
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        userId: userId !== undefined ? userId : existingOrder.userId,
        formSubmissionId: formSubmissionId !== undefined ? formSubmissionId : existingOrder.formSubmissionId,
        agentId: agentId !== undefined ? agentId : existingOrder.agentId,
        agentStatus: agentStatus !== undefined ? agentStatus : existingOrder.agentStatus,
        adminStatus: adminStatus !== undefined ? adminStatus : existingOrder.adminStatus,
        paymentStatus: paymentStatus !== undefined ? paymentStatus : existingOrder.paymentStatus,
        submissionStatus: finalSubmissionStatus,
        invoice: invoice !== undefined ? invoice : existingOrder.invoice,
        agentNotes: agentNotes !== undefined ? agentNotes : existingOrder.agentNotes,
        adminNotes: adminNotes !== undefined ? adminNotes : existingOrder.adminNotes,
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

    const { id } = await params
    const orderId = parseInt(id)
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
