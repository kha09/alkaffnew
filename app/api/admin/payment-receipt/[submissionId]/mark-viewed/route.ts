import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ submissionId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'غير مصرح للوصول' }, { status: 403 })
    }

    const { submissionId: submissionIdParam } = await params
    const submissionId = parseInt(submissionIdParam)
    
    if (isNaN(submissionId)) {
      return NextResponse.json({ error: 'معرف الطلب غير صحيح' }, { status: 400 })
    }

    // Update the form submission to mark receipt as viewed
    const updatedSubmission = await prisma.formSubmission.update({
      where: { id: submissionId },
      data: { receiptViewedByAdmin: true }
    })

    return NextResponse.json({
      message: 'تم تسجيل مراجعة الإيصال بنجاح',
      viewedByAdmin: true
    })

  } catch (error) {
    console.error('Error marking receipt as viewed:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تسجيل المراجعة' },
      { status: 500 }
    )
  }
}
