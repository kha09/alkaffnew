import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import db from '@/lib/db'

// PUT - Mark all notifications as read
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Only admins can mark notifications as read
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can mark notifications as read' },
        { status: 403 }
      )
    }

    // Update all unread notifications for admin
    const result = await db.notification.updateMany({
      where: {
        AND: [
          {
            OR: [
              { userId: null },
              { userId: parseInt(session.user.id) }
            ]
          },
          { isRead: false }
        ]
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    })

    return NextResponse.json({ 
      message: `Marked ${result.count} notifications as read`,
      count: result.count
    })
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    return NextResponse.json(
      { error: 'Failed to mark all notifications as read' },
      { status: 500 }
    )
  }
}
