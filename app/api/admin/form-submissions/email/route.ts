import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import nodemailer from 'nodemailer'

// POST /api/admin/form-submissions/email - Send email to a submission
export async function POST(request: NextRequest) {
  try {
    // Check if user is admin (would need to implement auth)
    // const session = await getServerSession(authOptions)
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { submissionId, subject, message } = await request.json()
    
    if (!submissionId || !subject || !message) {
      return NextResponse.json({ error: 'Submission ID, subject, and message are required' }, { status: 400 })
    }

    // Fetch the submission
    const submission = await prisma.formSubmission.findUnique({
      where: { id: submissionId }
    })

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    // Create a transporter object using the default SMTP transport
    // In a real app, you would use environment variables for these values
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.example.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER || 'user@example.com',
        pass: process.env.EMAIL_PASS || 'password',
      },
    })

    // Send the email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"SM Alkaff" <no-reply@smalkaff.com>',
      to: submission.email,
      subject: subject,
      text: message,
      // html: '<b>Hello world?</b>', // html body
    })

    console.log('Email sent: %s', info.messageId)

    return NextResponse.json({
      message: 'Email sent successfully',
      messageId: info.messageId,
    })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إرسال البريد الإلكتروني' },
      { status: 500 }
    )
  }
}
