"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, FileText, DollarSign, User, CheckCircle } from "lucide-react"

type Notification = {
  id: number;
  title: string;
  description: string;
  type: "order" | "payment" | "system" | "student";
  read: boolean;
  createdAt: string;
};

export default function AgentNotificationsPage() {
  // Mock notifications data
  const notifications: Notification[] = [
    {
      id: 1,
      title: "تحديث حالة طلب",
      description: "تم قبول طلب الطالب أحمد محمد للجامعة الأمريكية في بيروت",
      type: "order",
      read: false,
      createdAt: "2025-09-25T10:30:00Z"
    },
    {
      id: 2,
      title: "دفعة عمولة جديدة",
      description: "تم إيداع عمولة مبلغ 150$ لطلب الطالب فاطمة علي",
      type: "payment",
      read: true,
      createdAt: "2025-09-24T14:15:00Z"
    },
    {
      id: 3,
      title: "تحديث نظام الطلبات",
      description: "تم تحديث نظام الطلبات وإضافة ميزات جديدة",
      type: "system",
      read: true,
      createdAt: "2025-09-23T09:00:00Z"
    },
    {
      id: 4,
      title: "طالب جديد مسجل",
      description: "تم تسجيل الطالب خالد عبدالله عبر رابطك الخاص",
      type: "student",
      read: false,
      createdAt: "2025-09-22T16:45:00Z"
    },
    {
      id: 5,
      title: " nearing deadline",
      description: "طلب الطالب سارة أحمد يحتاج إلى استكمال المستندات قبل 48 ساعة",
      type: "order",
      read: false,
      createdAt: "2025-09-21T11:20:00Z"
    },
    {
      id: 6,
      title: "إشعار دفع عمولة",
      description: "سيتم صرف العمولة الشهرية في تاريخ 5 من كل شهر",
      type: "payment",
      read: true,
      createdAt: "2025-09-20T08:00:00Z"
    }
  ];

  const getIconByType = (type: string) => {
    switch (type) {
      case "order": return <FileText className="w-5 h-5 text-blue-600" />;
      case "payment": return <DollarSign className="w-5 h-5 text-green-600" />;
      case "student": return <User className="w-5 h-5 text-purple-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "order": return "طلب";
      case "payment": return "دفعة";
      case "student": return "طالب";
      default: return "نظام";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "order": return "bg-blue-100 text-blue-800";
      case "payment": return "bg-green-100 text-green-800";
      case "student": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#111827]">الإشعارات</h1>
        <p className="text-[#4b5563] mt-1">آخر التحديثات والإشعارات الخاصة بك</p>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            جميع الإشعارات
          </CardTitle>
          <Badge className="bg-blue-100 text-blue-800">
            {notifications.filter(n => !n.read).length} غير مقروءة
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 border rounded-lg flex items-start gap-4 ${
                  notification.read 
                    ? "bg-white border-gray-200" 
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="mt-1">
                  {getIconByType(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-[#111827]">{notification.title}</h3>
                    <Badge className={getTypeColor(notification.type)}>
                      {getTypeLabel(notification.type)}
                    </Badge>
                  </div>
                  <p className="text-sm text-[#4b5563] mt-1">{notification.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500">
                      {new Date(notification.createdAt).toLocaleDateString('ar-SA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {!notification.read && (
                      <Badge className="bg-blue-500 text-white text-xs">
                        جديد
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
