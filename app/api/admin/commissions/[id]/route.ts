import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// PUT /api/admin/commissions/[id] - Update a commission (approve, reject, pay)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin (would need to implement auth)
    // const session = await getServerSession(authOptions)
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { id } = await params
    const commissionId = parseInt(id)
    if (isNaN(commissionId)) {
      return NextResponse.json({ error: 'معرف العمولة غير صالح' }, { status: 400 })
    }

    const body = await request.json()
    
    const { status, notes } = body

    // Check if commission exists
    const existingCommission = await prisma.commission.findUnique({
      where: { id: commissionId }
    })

    if (!existingCommission) {
      return NextResponse.json({ error: 'العمولة غير موجودة' }, { status: 404 })
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date()
    }
    
    if (status) {
      updateData.status = status
      
      // Set timestamps based on status
      if (status === 'approved' && !existingCommission.approvedAt) {
        updateData.approvedAt = new Date()
      } else if (status === 'paid' && !existingCommission.paidAt) {
        updateData.paidAt = new Date()
      }
    }
    
    if (notes !== undefined) {
      updateData.notes = notes
    }

    const commission = await prisma.commission.update({
      where: { id: commissionId },
      data: updateData,
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
            price: true,
            status: true,
            paymentStatus: true,
            dateCreated: true
          }
        }
      }
    })

    return NextResponse.json(commission)
  } catch (error) {
    console.error('Error updating commission:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث العمولة' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/commissions/[id] - Delete a commission
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin (would need to implement auth)
    // const session = await getServerSession(authOptions)
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { id } = await params
    const commissionId = parseInt(id)
    if (isNaN(commissionId)) {
      return NextResponse.json({ error: 'معرف العمولة غير صالح' }, { status: 400 })
    }

    // Check if commission exists
    const existingCommission = await prisma.commission.findUnique({
      where: { id: commissionId }
    })

    if (!existingCommission) {
      return NextResponse.json({ error: 'العمولة غير موجودة' }, { status: 404 })
    }

    await prisma.commission.delete({
      where: { id: commissionId }
    })

    return NextResponse.json({ message: 'تم حذف العمولة بنجاح' })
  } catch (error) {
    console.error('Error deleting commission:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حذف العمولة' },
      { status: 500 }
    )
  }
}
