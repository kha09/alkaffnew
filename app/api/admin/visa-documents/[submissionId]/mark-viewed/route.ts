import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// POST /api/admin/visa-documents/:submissionId/mark-viewed - Mark visa documents as viewed by admin
export async function POST(request: NextRequest) {
  try {
    const submissionId = parseInt(request.nextUrl.pathname.split('/').slice(-2)[0])
    
    if (isNaN(submissionId)) {
      return NextResponse.json({ error: 'Invalid submission ID' }, { status: 400 })
    }

    // Update the form submission to mark visa documents as viewed
    const updatedSubmission = await prisma.formSubmission.update({
      where: { id: submissionId },
      data: {
        visaDocumentsViewedByAdmin: true
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'تم تسجيل مراجعة مستندات التأشيرة بنجاح' 
    })
  } catch (error) {
    console.error('Error marking visa documents as viewed:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تسجيل المراجعة' },
      { status: 500 }
    )
  }
}
