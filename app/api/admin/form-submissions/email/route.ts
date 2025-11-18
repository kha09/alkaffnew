import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import { sendEmail } from '@/lib/emailService'
import path from 'path'
import fs from 'fs'

// Helper function to replace template placeholders
function renderTemplate(template: string, data: any): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] || match
  })
}

// POST /api/admin/form-submissions/email - Send email to university using template
export async function POST(request: NextRequest) {
  try {
    const { 
      submissionId, 
      templateId, 
      universityEmail, 
      customSubject, 
      customMessage,
      includeAttachments = true 
    } = await request.json()
    
    if (!submissionId) {
      return NextResponse.json({ error: 'Submission ID is required' }, { status: 400 })
    }

    // Fetch the submission with related data
    const submission = await db.formSubmission.findUnique({
      where: { id: submissionId },
      include: {
        uploadedFiles: true
      }
    })

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    // Get university information
    let university = null
    let toEmail = universityEmail

    if (submission.universityId) {
      university = await db.university.findUnique({
        where: { id: submission.universityId }
      })
      
      // Use university email if available and no custom email provided
      if (!toEmail && university?.emailAddress) {
        toEmail = university.emailAddress
      }
    }

    if (!toEmail) {
      return NextResponse.json({ 
        error: 'University email address is required. Please provide an email or ensure the university has an email address.' 
      }, { status: 400 })
    }

    let subject = customSubject
    let message = customMessage

    // If template is specified, use it
    if (templateId) {
      const template = await db.emailTemplate.findUnique({
        where: { id: templateId }
      })

      if (!template) {
        return NextResponse.json({ error: 'Template not found' }, { status: 404 })
      }

      if (!template.isActive) {
        return NextResponse.json({ error: 'Template is not active' }, { status: 400 })
      }

      // Prepare template data
      const templateData = {
        fullName: submission.fullName,
        email: submission.email,
        nationality: submission.nationality,
        countryOfResidence: submission.countryOfResidence,
        contactNumber: submission.contactNumber,
        cityOfResidence: submission.cityOfResidence,
        preferredProgram: submission.preferredProgram,
        universityName: university?.name || 'University',
        submissionDate: submission.submittedAt.toLocaleDateString()
      }

      // Render template
      subject = renderTemplate(template.subject, templateData)
      message = renderTemplate(template.body, templateData)
    }

    if (!subject || !message) {
      return NextResponse.json({ 
        error: 'Subject and message are required. Please provide custom content or select a template.' 
      }, { status: 400 })
    }

    // Prepare attachments
    const attachments = []
    const attachmentPaths = []

    const uploadedFiles = (submission as any).uploadedFiles
    if (includeAttachments && uploadedFiles && Array.isArray(uploadedFiles) && uploadedFiles.length > 0) {
      for (const file of uploadedFiles) {
        const filePath = path.join(process.cwd(), file.path)
        
        // Check if file exists
        if (fs.existsSync(filePath)) {
          attachments.push({
            filename: file.originalName,
            path: filePath
          })
          attachmentPaths.push(file.path)
        }
      }
    }

    // Send the email using the new email service
    const { info, config } = await sendEmail({
      to: toEmail,
      subject: subject,
      text: message,
      html: message.replace(/\n/g, '<br>'), // Convert line breaks to HTML
      attachments: attachments
    })

    console.log('Email sent: %s', info.messageId)

    // Record the sent email in database
    const sentEmail = await db.sentEmail.create({
      data: {
        fromEmail: config.fromEmail,
        toEmail: toEmail,
        subject: subject,
        body: message,
        templateId: templateId || null,
        formSubmissionId: submissionId,
        universityId: submission.universityId || null,
        attachmentPaths: attachmentPaths.length > 0 ? JSON.stringify(attachmentPaths) : null,
        status: 'sent'
      }
    })

    return NextResponse.json({
      message: 'Email sent successfully to university',
      messageId: info.messageId,
      sentEmailId: sentEmail.id,
      recipientEmail: toEmail,
      attachmentsCount: attachments.length
    })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إرسال البريد الإلكتروني' },
      { status: 500 }
    )
  }
}
