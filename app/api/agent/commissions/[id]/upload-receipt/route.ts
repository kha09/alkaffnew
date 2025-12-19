import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'
import { saveFile, validateFile } from '@/lib/fileStorage'

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

    // Find the agent by email
    const agent = await prisma.agent.findUnique({
      where: { email: session.user.email! }
    })

    if (!agent) {
      return NextResponse.json({ error: 'الوكيل غير موجود' }, { status: 404 })
    }

    const { id: commissionIdParam } = await params
    const commissionId = parseInt(commissionIdParam)
    
    if (isNaN(commissionId)) {
      return NextResponse.json({ error: 'معرف العمولة غير صحيح' }, { status: 400 })
    }

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

    // Ensure the commission belongs to the logged-in agent
    if (commission.agentId !== agent.id) {
      return NextResponse.json({ error: 'غير مصرح للوصول لهذه العمولة' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'لم يتم اختيار ملف' }, { status: 400 })
    }

    // Validate file using utility function
    const validation = validateFile(file, 5)
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    // Save file using utility function
    const saveResult = await saveFile(file, 'commission-receipts', commissionId)

    // Update commission with receipt information
    const updatedCommission = await prisma.commission.update({
      where: { id: commissionId },
      data: {
        receiptPath: saveResult.relativePath,
        receiptUploadedAt: new Date(),
        receiptViewedByAgent: true // Agent uploaded it, so they've seen it
      },
      include: {
        agent: { select: { id: true, name: true, email: true } },
        order: {
          select: {
            id: true,
            formSubmission: { select: { fullName: true } },
            adminStatus: true,
            paymentStatus: true,
            dateCreated: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'تم رفع إيصال العمولة بنجاح',
      commission: updatedCommission,
      receiptPath: saveResult.relativePath
    })

  } catch (error) {
    console.error('Error uploading commission receipt:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء رفع إيصال العمولة' },
      { status: 500 }
    )
  }
}
