"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Settings, Mail, Phone, User, Send } from "lucide-react"

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
      <Card>
        <CardHeader>
          <CardTitle>إشعارات الإدارة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">تحديث نظام الطلبات</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    تم تحديث نظام الطلبات وإضافة ميزات جديدة لتحسين تجربة الوكيل
                  </p>
                </div>
                <span className="text-xs text-gray-500">منذ 2 يوم</span>
              </div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">إشعار دفع العمولة</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    سيتم صرف العمولة الشهرية في تاريخ 5 من كل شهر
                  </p>
                </div>
                <span className="text-xs text-gray-500">منذ أسبوع</span>
              </div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">ورشة تدريبية جديدة</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    دعوة لورشة تدريبية حول استخدام النظام بكفاءة يوم الأحد المقبل
                  </p>
                </div>
                <span className="text-xs text-gray-500">منذ أسبوعين</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
