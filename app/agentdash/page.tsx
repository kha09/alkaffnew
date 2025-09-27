"use client"

import { AgentSidebar } from "@/components/agent-sidebar"
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

function PaymentsSection() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPayments() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/agent/payments");
        if (!res.ok) throw new Error("فشل في جلب بيانات المدفوعات");
        const data = await res.json();
        setPayments(data.payments || []);
      } catch (err: any) {
        setError(err.message || "حدث خطأ");
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
  }, []);

  // Show only unpaid or pending payments
  const outstanding = payments.filter(
    (p) => p.paymentStatus !== "paid"
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          المدفوعات والمستحقات
        </CardTitle>
        <Button variant="outline">تحديث</Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500">جاري التحميل...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-600">{error}</div>
          ) : outstanding.length === 0 ? (
            <div className="p-6 text-center text-gray-500">لا يوجد مدفوعات مستحقة حالياً.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-3 font-medium">اسم الطالب</th>
                  <th className="text-right p-3 font-medium">المبلغ المستحق</th>
                  <th className="text-right p-3 font-medium">الحالة</th>
                  <th className="text-right p-3 font-medium">تاريخ الاستحقاق</th>
                </tr>
              </thead>
              <tbody>
                {outstanding.map((p) => (
                  <tr className="border-b" key={p.id}>
                    <td className="p-3">{p.formSubmission?.fullName || "—"}</td>
                    <td className="p-3">{p.price ? `${p.price}$` : "—"}</td>
                    <td className="p-3">
                      <Badge className={p.paymentStatus === "unpaid" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                        {p.paymentStatus === "unpaid" ? "مطلوب" : "قيد المتابعة"}
                      </Badge>
                    </td>
                    <td className="p-3">{p.dateCreated?.slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function PaymentHistorySection() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPayments() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/agent/payments");
        if (!res.ok) throw new Error("فشل في جلب بيانات المدفوعات");
        const data = await res.json();
        setPayments(data.payments || []);
      } catch (err: any) {
        setError(err.message || "حدث خطأ");
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
  }, []);

  // Show only paid payments
  const paid = payments.filter((p) => p.paymentStatus === "paid");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          تتبع المدفوعات المستلمة
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500">جاري التحميل...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-600">{error}</div>
          ) : paid.length === 0 ? (
            <div className="p-6 text-center text-gray-500">لا يوجد مدفوعات مستلمة بعد.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-3 font-medium">تاريخ الدفع</th>
                  <th className="text-right p-3 font-medium">المبلغ</th>
                  <th className="text-right p-3 font-medium">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {paid.map((p) => (
                  <tr className="border-b" key={p.id}>
                    <td className="p-3">{p.dateCreated?.slice(0, 10)}</td>
                    <td className="p-3">{p.price ? `${p.price}$` : "—"}</td>
                    <td className="p-3">
                      <Badge className="bg-green-100 text-green-800">مدفوع</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function FollowUpRequestsSection() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/agent/orders");
        if (!res.ok) throw new Error("فشل في جلب بيانات الطلبات");
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err: any) {
        setError(err.message || "حدث خطأ");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          متابعة الطلبات
        </CardTitle>
        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
          <Download className="w-4 h-4" />
          تحديث الحالة
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-4">
          <Input placeholder="بحث برقم الطلب..." className="max-w-xs" />
          <select className="px-3 py-2 border rounded-md">
            <option>كل الحالات</option>
            <option>قيد المراجعة</option>
            <option>مقبول</option>
            <option>مرفوض</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500">جاري التحميل...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-600">{error}</div>
          ) : orders.length === 0 ? (
            <div className="p-6 text-center text-gray-500">لا يوجد طلبات متابعة بعد.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-3 font-medium">رقم الطلب</th>
                  <th className="text-right p-3 font-medium">اسم الطالب</th>
                  <th className="text-right p-3 font-medium">الحالة</th>
                  <th className="text-right p-3 font-medium">تاريخ التقديم</th>
                  <th className="text-right p-3 font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr className="border-b" key={order.id}>
                    <td className="p-3">#{order.id}</td>
                    <td className="p-3">
                      {order.formSubmission?.fullName || "—"}
                    </td>
                    <td className="p-3">
                      <Badge className="bg-green-100 text-green-800">{order.status || "قيد المتابعة"}</Badge>
                    </td>
                    <td className="p-3">
                      {order.dateCreated?.slice(0, 10)}
                    </td>
                    <td className="p-3">
                      <Button size="sm" variant="outline">
                        عرض
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
  );
}

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
    <div className="min-h-screen bg-[#f9fafb] flex">
      <AgentSidebar />
      <main className="flex-1 p-6 space-y-6" dir="rtl">
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

        {/* Follow-up Requests */}
        <FollowUpRequestsSection />

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

        {/* Payments Section */}
        <PaymentsSection />

        {/* Payment History */}
        <PaymentHistorySection />

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              الإشعارات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="w-5 h-5 text-gray-600" />
                <span className="text-sm">حالة الطلبات</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
