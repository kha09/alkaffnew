import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET /api/admin/users - Get all users with their IDs and full names
export async function GET(request: NextRequest) {
  try {
    // Check if user is admin (would need to implement auth)
    // const session = await getServerSession(authOptions)
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const users = await prisma.user.findMany({
      where: {
        formSubmissionId: {
          not: null
        }
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        formSubmission: {
          select: {
            id: true,
            fullName: true,
            preferredProgram: true
          }
        }
      },
      orderBy: {
        fullName: 'asc'
      }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب المستخدمين' },
      { status: 500 }
    )
  }
}
