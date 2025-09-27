"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  UserPlus,
  FileText,
  Settings,
  Bell,
  ChevronDown,
  Download,
  Plus,
  AlertCircle,
  Clock,
  DollarSign,
} from "lucide-react"

import { useEffect, useState } from "react";

type Submission = {
  id: number;
  fullName: string;
  submittedAt: string;
  orderStage: string;
  uploadedFiles: any[];
  orders: any[];
};

export default function AgentDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubmissions() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/agent/submissions");
        if (!res.ok) throw new Error("فشل في جلب بيانات الطلاب");
        const data = await res.json();
        setSubmissions(data.submissions || []);
      } catch (err: any) {
        setError(err.message || "حدث خطأ");
      } finally {
        setLoading(false);
      }
    }
    fetchSubmissions();
  }, []);

  return (
    <div className="p-6 space-y-6" dir="rtl">
        {/* Dashboard Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#111827]">لوحة وكيل المبيعات</h1>
          <p className="text-[#4b5563] mt-1">مرحباً بك في لوحة التحكم الخاصة بك</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#4b5563]">الطلاب المسجلون</p>
                  <p className="text-2xl font-bold text-[#111827]">{submissions.length}</p>
                </div>
                <Users className="w-8 h-8 text-[#4b5563]" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#4b5563]">الطلبات النشطة</p>
                  <p className="text-2xl font-bold text-[#f59e0b]">
                    {submissions.filter(s => s.orderStage !== "Completed").length}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-[#f59e0b]" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#4b5563]">الإيرادات</p>
                  <p className="text-2xl font-bold text-[#10b981]">$0.00</p>
                </div>
                <DollarSign className="w-8 h-8 text-[#10b981]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Students Registration Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              الطلاب المسجلين عبرك
            </CardTitle>
            <Button className="bg-[#1f2937] hover:bg-[#374151]">إضافة طالب جديد</Button>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input placeholder="البحث عن الطلاب أو رقم الطلب..." className="max-w-md" />
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-6 text-center text-gray-500">جاري التحميل...</div>
              ) : error ? (
                <div className="p-6 text-center text-red-600">{error}</div>
              ) : submissions.length === 0 ? (
                <div className="p-6 text-center text-gray-500">لا يوجد طلاب مسجلين بعد.</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right p-3 font-medium">الصورة</th>
                      <th className="text-right p-3 font-medium">اسم الطالب</th>
                      <th className="text-right p-3 font-medium">الحالة</th>
                      <th className="text-right p-3 font-medium">تاريخ التسجيل</th>
                      <th className="text-right p-3 font-medium">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((submission) => (
                      <tr className="border-b" key={submission.id}>
                        <td className="p-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        </td>
                        <td className="p-3">{submission.fullName}</td>
                        <td className="p-3">
                          <Badge className="bg-green-100 text-green-800">{submission.orderStage || "قيد المتابعة"}</Badge>
                        </td>
                        <td className="p-3">{submission.submittedAt?.slice(0, 10)}</td>
                        <td className="p-3">
                          <Button size="sm" variant="outline">
                            تفاصيل
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </CardContent>
        </Card>

        {/* University Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              طلبات خاصة من الأدميس
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <span className="text-sm">يجب الانتباه إلى وضع الشهادات الأصلية في الملف الخاص بالطالب</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
              <span className="text-sm">تم تحديث نظام الشهادات الخاصة - في مراجعة سجلة المدفوعات</span>
            </div>
          </CardContent>
        </Card>

        {/* New Student Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              تقديم طالب جديد / رفع طلبات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Input placeholder="اسم الطالب" />
              <Input placeholder="رقم الهوية" />
              <Input placeholder="البريد الإلكتروني" />
              <Input placeholder="رقم الجوال" />
            </div>
            <div className="mb-4">
              <span className="text-sm text-gray-600">رفع طلبات الشهادات (اختياري)</span>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 bg-transparent">
                منطقة رفع طلبات
              </Button>
              <Button className="bg-[#1f2937] hover:bg-[#374151]">رفع طلب</Button>
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full bg-transparent">
                إرسال طلب
              </Button>
            </div>
          </CardContent>
        </Card>
    </div>
  )
}
