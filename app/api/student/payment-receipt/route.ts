import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'
import { saveFile, validateFile } from '@/lib/fileStorage'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    if (session.user.role !== 'student') {
      return NextResponse.json({ error: 'غير مصرح للوصول' }, { status: 403 })
    }

    // Get the student's form submission
    const userId = typeof session.user.id === 'string' ? parseInt(session.user.id) : session.user.id
    const formSubmission = await prisma.formSubmission.findFirst({
      where: {
        userId: userId
      }
    })

    if (!formSubmission) {
      return NextResponse.json({ error: 'لم يتم العثور على طلب التقديم' }, { status: 404 })
    }

    // Check if student can upload receipt
    if (!formSubmission.canUploadReceipt) {
      return NextResponse.json({ 
        error: 'غير مسموح برفع إيصال الدفع في الوقت الحالي' 
      }, { status: 403 })
    }

    // Check if student has already uploaded a receipt
    if (formSubmission.paymentReceiptPath && !formSubmission.canUploadReceipt) {
      return NextResponse.json({ 
        error: 'تم رفع إيصال الدفع مسبقاً' 
      }, { status: 400 })
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
    const saveResult = await saveFile(file, 'payment-receipts', formSubmission.id)

    // Update form submission with receipt information
    const updatedSubmission = await prisma.formSubmission.update({
      where: { id: formSubmission.id },
      data: {
        paymentReceiptPath: saveResult.relativePath,
        receiptUploadedAt: new Date(),
        canUploadReceipt: false, // Prevent multiple uploads
        receiptViewedByAdmin: false
      }
    })

    return NextResponse.json({
      message: 'تم رفع إيصال الدفع بنجاح',
      receiptPath: saveResult.relativePath,
      uploadedAt: updatedSubmission.receiptUploadedAt
    })

  } catch (error) {
    console.error('Error uploading payment receipt:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء رفع إيصال الدفع' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    if (session.user.role !== 'student') {
      return NextResponse.json({ error: 'غير مصرح للوصول' }, { status: 403 })
    }

    // Get the student's form submission with receipt information
    const userId = typeof session.user.id === 'string' ? parseInt(session.user.id) : session.user.id
    console.log('Looking for form submission for userId:', userId, 'type:', typeof userId)
    
    const formSubmission = await prisma.formSubmission.findFirst({
      where: {
        userId: userId
      },
      select: {
        id: true,
        submissionStatus: true,
        canUploadReceipt: true,
        paymentReceiptPath: true,
        receiptUploadedAt: true,
        receiptViewedByAdmin: true,
        fullName: true
      }
    })

    console.log('Form submission found:', formSubmission)

    if (!formSubmission) {
      // Check if there are any form submissions without userId that could be linked
      const unlinkedSubmission = await prisma.formSubmission.findFirst({
        where: { 
          userId: null,
          email: session.user.email // Try to match by email
        },
        select: {
          id: true,
          submissionStatus: true,
          canUploadReceipt: true,
          paymentReceiptPath: true,
          receiptUploadedAt: true,
          receiptViewedByAdmin: true,
          fullName: true
        }
      })

      if (unlinkedSubmission) {
        // Link the submission to this user
        const linkedSubmission = await prisma.formSubmission.update({
          where: { id: unlinkedSubmission.id },
          data: { userId: userId },
          select: {
            id: true,
            submissionStatus: true,
            canUploadReceipt: true,
            paymentReceiptPath: true,
            receiptUploadedAt: true,
            receiptViewedByAdmin: true,
            fullName: true
          }
        })

        console.log('Linked submission to user:', linkedSubmission)

        return NextResponse.json({
          submissionId: linkedSubmission.id,
          submissionStatus: linkedSubmission.submissionStatus,
          canUploadReceipt: linkedSubmission.submissionStatus === 'accepted_by_university',
          hasUploadedReceipt: !!linkedSubmission.paymentReceiptPath,
          receiptPath: linkedSubmission.paymentReceiptPath,
          uploadedAt: linkedSubmission.receiptUploadedAt,
          viewedByAdmin: linkedSubmission.receiptViewedByAdmin
        })
      }

      return NextResponse.json({ 
        error: 'لم يتم العثور على طلب تقديم مرتبط بحسابك. يرجى التأكد من تقديم طلب أولاً.',
        noSubmission: true 
      }, { status: 404 })
    }

    // Ensure canUploadReceipt is set correctly based on status
    const canUpload = formSubmission.submissionStatus === 'accepted_by_university'
    
    // Update canUploadReceipt if it doesn't match the expected value
    if (formSubmission.canUploadReceipt !== canUpload) {
      await prisma.formSubmission.update({
        where: { id: formSubmission.id },
        data: { canUploadReceipt: canUpload }
      })
    }

    return NextResponse.json({
      submissionId: formSubmission.id,
      submissionStatus: formSubmission.submissionStatus,
      canUploadReceipt: canUpload,
      hasUploadedReceipt: !!formSubmission.paymentReceiptPath,
      receiptPath: formSubmission.paymentReceiptPath,
      uploadedAt: formSubmission.receiptUploadedAt,
      viewedByAdmin: formSubmission.receiptViewedByAdmin
    })

  } catch (error) {
    console.error('Error fetching payment receipt status:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب معلومات إيصال الدفع' },
      { status: 500 }
    )
  }
}
