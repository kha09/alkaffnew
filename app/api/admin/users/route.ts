import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

// GET /api/admin/users - Get all users with their IDs and full names
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')

    // Special handling for agents - fetch from Agent table
    if (role === 'agent') {
      const agents = await prisma.agent.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          phone: true
        },
        orderBy: {
          name: 'asc'
        }
      })

      // Transform agents to match the expected user format
      const users = agents.map((agent: { id: number; name: string; email: string; phone: string | null }) => ({
        id: agent.id,
        fullName: agent.name,
        email: agent.email,
        role: 'agent'
      }))

      return NextResponse.json({ users })
    }

    // For other roles, fetch from User table
    let whereClause: any = {}

    if (role) {
      whereClause.role = role
    } else {
      // Default behavior - users with form submissions
      whereClause.formSubmissionId = {
        not: null
      }
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
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

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب المستخدمين' },
      { status: 500 }
    )
  }
}
