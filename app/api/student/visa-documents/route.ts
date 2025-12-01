import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

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

    // Check if student can upload visa documents
    if (!formSubmission.canUploadVisaDocuments) {
      return NextResponse.json({ 
        error: 'غير مسموح برفع مستندات التأشيرة في الوقت الحالي' 
      }, { status: 403 })
    }

    // Check if student has already uploaded visa documents
    if (formSubmission.visaDocumentsPath && !formSubmission.canUploadVisaDocuments) {
      return NextResponse.json({ 
        error: 'تم رفع مستندات التأشيرة مسبقاً' 
      }, { status: 400 })
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
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'visa-documents')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = path.extname(file.name)
    const fileName = `visa_${formSubmission.id}_${timestamp}${fileExtension}`
    const filePath = path.join(uploadsDir, fileName)
    const relativePath = `/uploads/visa-documents/${fileName}`

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Update form submission with visa documents information
    const updatedSubmission = await prisma.formSubmission.update({
      where: { id: formSubmission.id },
      data: {
        visaDocumentsPath: relativePath,
        visaDocumentsUploadedAt: new Date(),
        canUploadVisaDocuments: false, // Prevent multiple uploads
        visaDocumentsViewedByAdmin: false
      }
    })

    return NextResponse.json({
      message: 'تم رفع مستندات التأشيرة بنجاح',
      visaDocumentsPath: relativePath,
      uploadedAt: updatedSubmission.visaDocumentsUploadedAt
    })

  } catch (error) {
    console.error('Error uploading visa documents:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء رفع مستندات التأشيرة' },
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

    // Get the student's form submission with visa documents information
    const userId = typeof session.user.id === 'string' ? parseInt(session.user.id) : session.user.id
    console.log('Looking for form submission for userId:', userId, 'type:', typeof userId)
    
    const formSubmission = await prisma.formSubmission.findFirst({
      where: {
        userId: userId
      },
      select: {
        id: true,
        submissionStatus: true,
        canUploadVisaDocuments: true,
        visaDocumentsPath: true,
        visaDocumentsUploadedAt: true,
        visaDocumentsViewedByAdmin: true,
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
          canUploadVisaDocuments: true,
          visaDocumentsPath: true,
          visaDocumentsUploadedAt: true,
          visaDocumentsViewedByAdmin: true,
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
            canUploadVisaDocuments: true,
            visaDocumentsPath: true,
            visaDocumentsUploadedAt: true,
            visaDocumentsViewedByAdmin: true,
            fullName: true
          }
        })

        console.log('Linked submission to user:', linkedSubmission)

        return NextResponse.json({
          submissionId: linkedSubmission.id,
          submissionStatus: linkedSubmission.submissionStatus,
          canUploadVisaDocuments: linkedSubmission.submissionStatus === 'accepted_by_university',
          hasUploadedVisaDocuments: !!linkedSubmission.visaDocumentsPath,
          visaDocumentsPath: linkedSubmission.visaDocumentsPath,
          uploadedAt: linkedSubmission.visaDocumentsUploadedAt,
          viewedByAdmin: linkedSubmission.visaDocumentsViewedByAdmin
        })
      }

      return NextResponse.json({ 
        error: 'لم يتم العثور على طلب تقديم مرتبط بحسابك. يرجى التأكد من تقديم طلب أولاً.',
        noSubmission: true 
      }, { status: 404 })
    }

    // Ensure canUploadVisaDocuments is set correctly based on status
    const canUpload = formSubmission.submissionStatus === 'accepted_by_university'
    
    // Update canUploadVisaDocuments if it doesn't match the expected value
    if (formSubmission.canUploadVisaDocuments !== canUpload) {
      await prisma.formSubmission.update({
        where: { id: formSubmission.id },
        data: { canUploadVisaDocuments: canUpload }
      })
    }

    return NextResponse.json({
      submissionId: formSubmission.id,
      submissionStatus: formSubmission.submissionStatus,
      canUploadVisaDocuments: canUpload,
      hasUploadedVisaDocuments: !!formSubmission.visaDocumentsPath,
      visaDocumentsPath: formSubmission.visaDocumentsPath,
      uploadedAt: formSubmission.visaDocumentsUploadedAt,
      viewedByAdmin: formSubmission.visaDocumentsViewedByAdmin
    })

  } catch (error) {
    console.error('Error fetching visa documents status:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب معلومات مستندات التأشيرة' },
      { status: 500 }
    )
  }
}
