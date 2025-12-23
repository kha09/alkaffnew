import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import db from '@/lib/db'

// GET - Get admin notifications
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Only admins can access notifications
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can access notifications' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')

    // Find notifications for admin (where userId is null or matches admin)
    const notifications = await db.notification.findMany({
      where: {
        AND: [
          {
            OR: [
              { userId: null },
              { userId: parseInt(session.user.id) }
            ]
          },
          unreadOnly ? { isRead: false } : {}
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Error fetching admin notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

// PUT - Mark notification as read
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

    const body = await request.json()
    const { notificationId } = body

    if (!notificationId) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      )
    }

    // Find the notification
    const notification = await db.notification.findUnique({
      where: { id: notificationId }
    })

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      )
    }

    // Update read status
    const updatedNotification = await db.notification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        readAt: new Date()
      }
    })

    return NextResponse.json(updatedNotification)
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return NextResponse.json(
      { error: 'Failed to mark notification as read' },
      { status: 500 }
    )
  }
}

// PUT - Mark all notifications as read
export async function PUT_ALL_READ() {
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

    // Update all unread notifications for this admin
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
