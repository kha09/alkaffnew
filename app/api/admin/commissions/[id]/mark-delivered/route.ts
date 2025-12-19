import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'غير مصرح للوصول' }, { status: 403 })
    }

    const { id: commissionIdParam } = await params
    const commissionId = parseInt(commissionIdParam)
    
    if (isNaN(commissionId)) {
      return NextResponse.json({ error: 'معرف العمولة غير صحيح' }, { status: 400 })
    }

    const body = await request.json()
    const { delivered } = body

    if (typeof delivered !== 'boolean') {
      return NextResponse.json({ error: 'حالة التسليم يجب أن تكون true أو false' }, { status: 400 })
    }

    // Check if commission exists
    const existingCommission = await prisma.commission.findUnique({
      where: { id: commissionId }
    })

    if (!existingCommission) {
      return NextResponse.json({ error: 'العمولة غير موجودة' }, { status: 404 })
    }

    // Update commission delivery status
    const updatedCommission = await prisma.commission.update({
      where: { id: commissionId },
      data: {
        deliveredToAgent: delivered,
        deliveredAt: delivered ? new Date() : null
      },
      include: {
        agent: { select: { id: true, name: true, email: true } },
        order: {
          select: {
            id: true,
            formSubmission: { select: { fullName: true } },
            price: true,
            adminStatus: true,
            paymentStatus: true,
            dateCreated: true
          }
        }
      }
    })

    return NextResponse.json({
      message: delivered ? 'تم تسجيل تسليم العمولة للوكيل' : 'تم إلغاء تسجيل تسليم العمولة',
      commission: updatedCommission
    })

  } catch (error) {
    console.error('Error updating commission delivery status:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث حالة التسليم' },
      { status: 500 }
    )
  }
}
