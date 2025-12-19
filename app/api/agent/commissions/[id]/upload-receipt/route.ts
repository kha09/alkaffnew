import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

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

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'نوع الملف غير مدعوم. يرجى رفع ملف PDF أو صورة (JPG, PNG)' 
      }, { status: 400 })
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت' 
      }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'commission-receipts')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = path.extname(file.name)
    const fileName = `commission_receipt_${commissionId}_${timestamp}${fileExtension}`
    const filePath = path.join(uploadsDir, fileName)
    const relativePath = `/uploads/commission-receipts/${fileName}`

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Update commission with receipt information
    const updatedCommission = await prisma.commission.update({
      where: { id: commissionId },
      data: {
        receiptPath: relativePath,
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
      receiptPath: relativePath
    })

  } catch (error) {
    console.error('Error uploading commission receipt:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء رفع إيصال العمولة' },
      { status: 500 }
    )
  }
}
