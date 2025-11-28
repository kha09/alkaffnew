import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import bcrypt from 'bcrypt'

// POST /api/admin/agents/[id]/reset-password - Reset agent password
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const existingAgent = await prisma.agent.findUnique({ where: { id } })
    if (!existingAgent) {
      return NextResponse.json({ error: 'الوكيل غير موجود' }, { status: 404 })
    }

    // Generate a random 8-character password
    const newPassword = Math.random().toString(36).slice(-8)
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update agent password
    await prisma.agent.update({
      where: { id },
      data: {
        password: hashedPassword
      }
    })

    return NextResponse.json({
      message: 'تم إعادة تعيين كلمة المرور بنجاح',
      newPassword: newPassword
    })
  } catch (error) {
    console.error('Error resetting agent password:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إعادة تعيين كلمة المرور' },
      { status: 500 }
    )
  }
}
