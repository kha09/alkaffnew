"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Bell, 
  MessageSquare, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Calendar,
  ExternalLink
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

// Types
type AdminNotification = {
  id: number
  title: string
  message: string
  type: string
  priority: string
  isRead: boolean
  entityId: number | null
  entityType: string | null
  createdAt: string
  readAt: string | null
  actionUrl: string | null
  metadata: string | null
}

const priorities = [
  { value: 'low', label: 'منخفض', color: 'bg-gray-100 text-gray-800' },
  { value: 'normal', label: 'عادي', color: 'bg-blue-100 text-blue-800' },
  { value: 'high', label: 'عالي', color: 'bg-orange-100 text-orange-800' },
  { value: 'urgent', label: 'عاجل', color: 'bg-red-100 text-red-800' }
]

const types = [
  { value: 'info', label: 'معلومات', color: 'bg-blue-100 text-blue-800' },
  { value: 'warning', label: 'تحذير', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'success', label: 'نجاح', color: 'bg-green-100 text-green-800' },
  { value: 'error', label: 'خطأ', color: 'bg-red-100 text-red-800' }
]

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    fetchNotifications()
  }, [filter])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/admin/notifications?unreadOnly=${filter === 'unread'}`)
      
      if (!response.ok) {
        throw new Error('فشل في جلب الإشعارات')
      }
      
      const data = await response.json()
      setNotifications(data)
    } catch (error: any) {
      console.error('Error fetching notifications:', error)
      setError(error.message || 'حدث خطأ أثناء جلب الإشعارات')
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: number) => {
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notificationId })
      })

      if (!response.ok) {
        throw new Error('فشل في تحديث حالة القراءة')
      }

      // Update the local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true, readAt: new Date().toISOString() }
            : notification
        )
      )

      toast({
        title: "تم",
        description: "تم تحديث حالة القراءة",
      })
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء تحديث حالة القراءة",
        variant: "destructive",
      })
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/admin/notifications/mark-all-read', {
        method: 'PUT'
      })

      if (!response.ok) {
        throw new Error('فشل في تحديث حالة القراءة')
      }

      const result = await response.json()
      
      // Update the local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          ({ ...notification, isRead: true, readAt: new Date().toISOString() })
        )
      )

      toast({
        title: "تم",
        description: result.message,
      })
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء تحديث حالة القراءة",
        variant: "destructive",
      })
    }
  }

  const getTypeInfo = (type: string) => {
    return types.find(t => t.value === type) || types[0]
  }

  const getPriorityInfo = (priority: string) => {
    return priorities.find(p => p.value === priority) || priorities[1]
  }

  const unreadCount = notifications.filter(notification => !notification.isRead).length

  if (loading) {
    return (
      <div className="p-6 space-y-6" dir="rtl">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#111827]"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 space-y-6" dir="rtl">
        <div className="text-center py-8 text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#111827]">الإشعارات</h1>
          <p className="text-[#4b5563] mt-1">
            {unreadCount > 0 
              ? `لديك ${unreadCount} إشعار غير مقروء`
              : 'جميع الإشعارات مقروءة'
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Bell className="w-6 h-6 text-[#4b5563]" />
          {unreadCount > 0 && (
            <Badge className="bg-red-500 text-white">
              {unreadCount}
            </Badge>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            جميع الإشعارات
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            onClick={() => setFilter('unread')}
          >
            غير المقروءة
          </Button>
        </div>
        
        <Button
          variant="outline"
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
        >
          <CheckCircle className="w-4 h-4 ml-2" />
          تحديد الكل كمقروء
        </Button>
      </div>

      {/* Stats Card */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-[#111827]">{notifications.length}</div>
              <div className="text-sm text-[#4b5563]">إجمالي الإشعارات</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#ef4444]">{unreadCount}</div>
              <div className="text-sm text-[#4b5563]">غير مقروءة</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#10b981]">{notifications.length - unreadCount}</div>
              <div className="text-sm text-[#4b5563]">مقروءة</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            جميع الإشعارات
          </CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>لا توجد إشعارات بعد</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => {
                const typeInfo = getTypeInfo(notification.type)
                const priorityInfo = getPriorityInfo(notification.priority)
                
                return (
                  <div 
                    key={notification.id} 
                    className={`border rounded-lg p-4 transition-colors ${
                      !notification.isRead 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                          
                          <Badge className={typeInfo.color}>
                            {typeInfo.label}
                          </Badge>
                          
                          <Badge className={priorityInfo.color}>
                            {priorityInfo.label}
                          </Badge>
                          
                          {notification.entityType && (
                            <Badge className="bg-purple-100 text-purple-800">
                              {notification.entityType}
                            </Badge>
                          )}
                        </div>
                        
                        <h3 className="font-bold text-lg text-[#111827] mb-1">
                          {notification.title}
                        </h3>
                        
                        <p className="text-[#111827] mb-3 leading-relaxed">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-[#6b7280]">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(notification.createdAt).toLocaleDateString('ar-SA')}</span>
                          </div>
                          
                          {notification.readAt && (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span>
                                قُرئ في: {new Date(notification.readAt).toLocaleDateString('ar-SA')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!notification.isRead && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <CheckCircle className="w-4 h-4 ml-1" />
                            تحديد كمقروء
                          </Button>
                        )}
                        
                        {notification.actionUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(notification.actionUrl!, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4 ml-1" />
                            عرض التفاصيل
                          </Button>
                        )}
                        
                        {notification.priority === 'urgent' && (
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
