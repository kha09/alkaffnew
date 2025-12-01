import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

export async function GET(
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

    // Get the form submission with payment receipt information
    const formSubmission = await prisma.formSubmission.findUnique({
      where: { id: submissionId },
      select: {
        id: true,
        submissionStatus: true,
        canUploadReceipt: true,
        paymentReceiptPath: true,
        receiptUploadedAt: true,
        receiptViewedByAdmin: true
      }
    })

    if (!formSubmission) {
      return NextResponse.json({ error: 'لم يتم العثور على الطلب' }, { status: 404 })
    }

    return NextResponse.json({
      submissionId: formSubmission.id,
      submissionStatus: formSubmission.submissionStatus,
      canUploadReceipt: formSubmission.canUploadReceipt,
      hasUploadedReceipt: !!formSubmission.paymentReceiptPath,
      receiptPath: formSubmission.paymentReceiptPath,
      uploadedAt: formSubmission.receiptUploadedAt,
      viewedByAdmin: formSubmission.receiptViewedByAdmin
    })

  } catch (error) {
    console.error('Error fetching payment receipt data:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب معلومات إيصال الدفع' },
      { status: 500 }
    )
  }
}
