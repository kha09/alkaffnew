import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// POST /api/admin/visa-documents/reset - Reset visa documents upload for a submission
export async function POST(request: NextRequest) {
  try {
    const { submissionId } = await request.json()
    
    if (!submissionId) {
      return NextResponse.json({ error: 'Submission ID is required' }, { status: 400 })
    }

    // Update the form submission to reset visa documents
    const updatedSubmission = await prisma.formSubmission.update({
      where: { id: submissionId },
      data: {
        visaDocumentsPath: null,
        visaDocumentsUploadedAt: null,
        visaDocumentsViewedByAdmin: false,
        canUploadVisaDocuments: true // Re-enable upload
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'تم إعادة تعيين مستندات التأشيرة بنجاح' 
    })
  } catch (error) {
    console.error('Error resetting visa documents:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إعادة التعيين' },
      { status: 500 }
    )
  }
}
