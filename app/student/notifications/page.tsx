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
  User,
  Calendar
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

// Types
type StudentNote = {
  id: number
  content: string
  priority: string
  sentAt: string
  expiresAt?: string
  isRead: boolean
  readAt?: string
  template?: {
    id: number
    title: string
    category: string
  }
  sender: {
    id: number
    fullName: string
    email: string
  }
}

const priorities = [
  { value: 'low', label: 'منخفض', color: 'bg-gray-100 text-gray-800' },
  { value: 'normal', label: 'عادي', color: 'bg-blue-100 text-blue-800' },
  { value: 'high', label: 'عالي', color: 'bg-orange-100 text-orange-800' },
  { value: 'urgent', label: 'عاجل', color: 'bg-red-100 text-red-800' }
]

export default function StudentNotificationsPage() {
  const [notes, setNotes] = useState<StudentNote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/student/notes')
      
      if (!response.ok) {
        throw new Error('فشل في جلب الإشعارات')
      }
      
      const data = await response.json()
      setNotes(data.notes || [])
    } catch (error: any) {
      console.error('Error fetching notes:', error)
      setError(error.message || 'حدث خطأ أثناء جلب الإشعارات')
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (noteId: number) => {
    try {
      const response = await fetch(`/api/student/notes/${noteId}/read`, {
        method: 'PUT'
      })

      if (!response.ok) {
        throw new Error('فشل في تحديث حالة القراءة')
      }

      // Update the local state
      setNotes(prevNotes => 
        prevNotes.map(note => 
          note.id === noteId 
            ? { ...note, isRead: true, readAt: new Date().toISOString() }
            : note
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

  const getPriorityInfo = (priority: string) => {
    return priorities.find(p => p.value === priority) || priorities[1]
  }

  const unreadCount = notes.filter(note => !note.isRead).length

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

      {/* Stats Card */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-[#111827]">{notes.length}</div>
              <div className="text-sm text-[#4b5563]">إجمالي الإشعارات</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#ef4444]">{unreadCount}</div>
              <div className="text-sm text-[#4b5563]">غير مقروءة</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#10b981]">{notes.length - unreadCount}</div>
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
          {notes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>لا توجد إشعارات بعد</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notes.map((note) => {
                const priorityInfo = getPriorityInfo(note.priority)
                const isExpired = note.expiresAt && new Date(note.expiresAt) < new Date()
                
                return (
                  <div 
                    key={note.id} 
                    className={`border rounded-lg p-4 transition-colors ${
                      !note.isRead 
                        ? 'bg-blue-50 border-blue-200' 
                        : isExpired 
                        ? 'bg-gray-50 border-gray-200 opacity-75'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {!note.isRead && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                          
                          {note.template && (
                            <Badge className="bg-green-100 text-green-800">
                              {note.template.title}
                            </Badge>
                          )}
                          
                          <Badge className={priorityInfo.color}>
                            {priorityInfo.label}
                          </Badge>
                          
                          {isExpired && (
                            <Badge className="bg-gray-100 text-gray-600">
                              منتهي الصلاحية
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-[#111827] mb-3 leading-relaxed">
                          {note.content}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-[#6b7280]">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>من: {note.sender.fullName}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(note.sentAt).toLocaleDateString('ar-SA')}</span>
                          </div>
                          
                          {note.expiresAt && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>
                                ينتهي في: {new Date(note.expiresAt).toLocaleDateString('ar-SA')}
                              </span>
                            </div>
                          )}
                          
                          {note.isRead && note.readAt && (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span>
                                قُرئ في: {new Date(note.readAt).toLocaleDateString('ar-SA')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!note.isRead && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsRead(note.id)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <CheckCircle className="w-4 h-4 ml-1" />
                            تحديد كمقروء
                          </Button>
                        )}
                        
                        {note.priority === 'urgent' && (
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
