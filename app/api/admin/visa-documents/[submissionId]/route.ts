import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET /api/admin/visa-documents/:submissionId - Get visa documents info for a submission
export async function GET(request: NextRequest) {
  try {
    const submissionId = parseInt(request.nextUrl.pathname.split('/').slice(-1)[0])
    
    if (isNaN(submissionId)) {
      return NextResponse.json({ error: 'Invalid submission ID' }, { status: 400 })
    }

    // Fetch the form submission with visa documents info
    const submission = await prisma.formSubmission.findUnique({
      where: { id: submissionId },
      select: {
        id: true,
        submissionStatus: true,
        canUploadVisaDocuments: true,
        visaDocumentsPath: true,
        visaDocumentsUploadedAt: true,
        visaDocumentsViewedByAdmin: true
      }
    })

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    // Parse visa documents paths (stored as JSON string)
    let visaDocumentsPaths: string[] | null = null
    if (submission.visaDocumentsPath) {
      try {
        visaDocumentsPaths = JSON.parse(submission.visaDocumentsPath)
      } catch (e) {
        // If it's not JSON, treat as single path for backward compatibility
        visaDocumentsPaths = [submission.visaDocumentsPath]
      }
    }

    const response = {
      submissionId: submission.id,
      submissionStatus: submission.submissionStatus,
      canUploadVisaDocuments: submission.canUploadVisaDocuments,
      hasUploadedVisaDocuments: !!submission.visaDocumentsPath,
      visaDocumentsPaths,
      uploadedAt: submission.visaDocumentsUploadedAt?.toISOString() || null,
      viewedByAdmin: submission.visaDocumentsViewedByAdmin
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching visa documents info:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب معلومات مستندات التأشيرة' },
      { status: 500 }
    )
  }
}
