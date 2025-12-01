import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'غير مصرح للوصول' }, { status: 403 })
    }

    const { submissionId } = await request.json()

    if (!submissionId) {
      return NextResponse.json({ error: 'معرف الطلب مطلوب' }, { status: 400 })
    }

    // Find the form submission
    const formSubmission = await prisma.formSubmission.findUnique({
      where: { id: parseInt(submissionId) }
    })

    if (!formSubmission) {
      return NextResponse.json({ error: 'لم يتم العثور على طلب التقديم' }, { status: 404 })
    }

    // Reset upload permission
    const updatedSubmission = await prisma.formSubmission.update({
      where: { id: parseInt(submissionId) },
      data: {
        canUploadReceipt: true,
        receiptViewedByAdmin: false
      }
    })

    return NextResponse.json({
      message: 'تم إعادة تعيين صلاحية رفع إيصال الدفع بنجاح',
      submissionId: updatedSubmission.id,
      canUploadReceipt: updatedSubmission.canUploadReceipt
    })

  } catch (error) {
    console.error('Error resetting payment receipt permission:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إعادة تعيين صلاحية رفع إيصال الدفع' },
      { status: 500 }
    )
  }
}
