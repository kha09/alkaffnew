import db from '@/lib/db'

export interface CreateNotificationParams {
  title: string
  message: string
  type?: 'info' | 'warning' | 'success' | 'error'
  priority?: 'low' | 'normal' | 'high' | 'urgent'
  entityId?: number
  entityType?: string
  userId?: number
  actionUrl?: string
  metadata?: Record<string, any>
}

/**
 * Create a new notification
 */
export async function createNotification(params: CreateNotificationParams) {
  try {
    const notification = await db.notification.create({
      data: {
        title: params.title,
        message: params.message,
        type: params.type || 'info',
        priority: params.priority || 'normal',
        entityId: params.entityId,
        entityType: params.entityType,
        userId: params.userId,
        actionUrl: params.actionUrl,
        metadata: params.metadata ? JSON.stringify(params.metadata) : null
      }
    })
    
    return notification
  } catch (error) {
    console.error('Error creating notification:', error)
    throw new Error('Failed to create notification')
  }
}

/**
 * Get unread notification count for admin
 */
export async function getAdminUnreadNotificationCount() {
  try {
    const count = await db.notification.count({
      where: {
        AND: [
          {
            OR: [
              { userId: null },
              // For now we're not associating notifications with specific admins
              // In a more complex system, you might filter by specific admin IDs
            ]
          },
          { isRead: false }
        ]
      }
    })
    
    return count
  } catch (error) {
    console.error('Error getting admin unread notification count:', error)
    return 0
  }
}

/**
 * Get recent notifications for admin dashboard
 */
export async function getRecentAdminNotifications(limit: number = 10) {
  try {
    const notifications = await db.notification.findMany({
      where: {
        OR: [
          { userId: null },
          // For now we're not associating notifications with specific admins
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })
    
    return notifications
  } catch (error) {
    console.error('Error getting recent admin notifications:', error)
    return []
  }
}
