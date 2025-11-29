"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Settings, Mail, Phone, User, Send, Bell, AlertCircle, Calendar, CheckCircle } from "lucide-react"
import Link from "next/link"

type AgentNote = {
  id: number
  content: string
  priority: string
  sentAt: string
  isRead: boolean
  template?: {
    title: string
  }
  sender: {
    fullName: string
  }
}

// Admin Notifications Section Component
function AdminNotificationsSection() {
  const [notes, setNotes] = useState<AgentNote[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/agent/notes')
      if (response.ok) {
        const data = await response.json()
        // Get the latest 5 notes for admin page display
        setNotes((data.notes || []).slice(0, 5))
      }
    } catch (error) {
      console.error('Error fetching notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'normal': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'عاجل'
      case 'high': return 'عالي'
      case 'normal': return 'عادي'
      default: return 'منخفض'
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          إشعارات الإدارة
        </CardTitle>
        <Link href="/agentdash/notifications">
          <Button variant="outline" size="sm">
            عرض جميع الإشعارات
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="p-4 text-center text-gray-500">جاري التحميل...</div>
        ) : notes.length === 0 ? (
          <div className="p-4 text-center text-gray-500">لا توجد إشعارات</div>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">
                        {note.template ? note.template.title : 'ملاحظة من الإدارة'}
                      </h4>
                      <Badge className={getPriorityColor(note.priority)}>
                        {getPriorityLabel(note.priority)}
                      </Badge>
                      {!note.isRead && (
                        <Badge className="bg-blue-500 text-white">
                          جديد
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {note.content}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>من: {note.sender.fullName}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(note.sentAt).toLocaleDateString('ar-SA')}
                      </span>
                      {note.isRead && (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-3 h-3" />
                          مقروء
                        </span>
                      )}
                    </div>
                  </div>
                  {note.priority === 'urgent' && (
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function AgentAdminPage() {
  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#111827]">الأدمن</h1>
        <p className="text-[#4b5563] mt-1">تواصل مع إدارة النظام</p>
      </div>

      {/* Contact Admin Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            تواصل مع الإدارة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <Mail className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">البريد الإلكتروني</p>
                <p className="font-medium">admin@alkaffpro.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <Phone className="w-6 h-6 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">رقم الهاتف</p>
                <p className="font-medium">+966 12 345 6789</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
              <User className="w-6 h-6 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">الدعم الفني</p>
                <p className="font-medium">متاح 24/7</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">إرسال رسالة</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الموضوع</label>
                <Input placeholder="موضوع الرسالة" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الرسالة</label>
                <Textarea placeholder="اكتب رسالتك هنا..." rows={5} />
              </div>
              <div className="flex justify-end">
                <Button className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  إرسال الرسالة
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Notifications */}
      <AdminNotificationsSection />
    </div>
  )
}
