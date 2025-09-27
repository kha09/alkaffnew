import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import bcrypt from 'bcrypt'

// POST /api/admin/form-submissions/[id]/reset-password
export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params;
    const submissionId = parseInt(id)
    if (isNaN(submissionId)) {
      return NextResponse.json({ error: 'Invalid submission ID' }, { status: 400 })
    }

    // Find the submission and user
    const submission = await prisma.formSubmission.findUnique({
      where: { id: submissionId },
      include: { user: true }
    })

    if (!submission || !submission.user) {
      return NextResponse.json({ error: 'User not found for this submission' }, { status: 404 })
    }

    // Generate a new random password
    const newPassword = Math.random().toString(36).slice(-8)
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update the user's password
    await prisma.user.update({
      where: { id: submission.user.id },
      data: { password: hashedPassword }
    })

    return NextResponse.json({
      message: 'Password reset successfully',
      newPassword
    })
  } catch (error) {
    console.error('Error resetting password:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إعادة تعيين كلمة المرور' },
      { status: 500 }
    )
  }
}
