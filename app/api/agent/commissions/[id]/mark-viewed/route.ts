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

    if (session.user.role !== 'agent') {
      return NextResponse.json({ error: 'غير مصرح للوصول' }, { status: 403 })
    }

    const { id: commissionIdParam } = await params
    const commissionId = parseInt(commissionIdParam)
    
    if (isNaN(commissionId)) {
      return NextResponse.json({ error: 'معرف العمولة غير صحيح' }, { status: 400 })
    }

    // Get agent ID from session (in a real implementation, this would be extracted from the session)
    // For now, we'll use a mock agent ID - this should be replaced with actual session-based agent ID
    const agentId = 1; // TODO: Extract from session

    // Check if commission exists and belongs to this agent
    const commission = await prisma.commission.findUnique({
      where: { id: commissionId },
      include: {
        agent: { select: { id: true, name: true, email: true } }
      }
    })

    if (!commission) {
      return NextResponse.json({ error: 'العمولة غير موجودة' }, { status: 404 })
    }

    if (commission.agentId !== agentId) {
      return NextResponse.json({ error: 'ليس لديك صلاحية لعرض هذه العمولة' }, { status: 403 })
    }

    // Update commission to mark receipt as viewed by agent
    const updatedCommission = await prisma.commission.update({
      where: { id: commissionId },
      data: {
        receiptViewedByAgent: true
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
      message: 'تم تسجيل مشاهدة الإيصال',
      commission: updatedCommission
    })

  } catch (error) {
    console.error('Error marking commission receipt as viewed:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تسجيل مشاهدة الإيصال' },
      { status: 500 }
    )
  }
}
