"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, FileText } from "lucide-react"

type Payment = {
  id: number;
  formSubmission: {
    fullName: string;
  } | null;
  price: number;
  status: string;
  paymentStatus: string;
  dateCreated: string;
};

export default function AgentPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
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

  // Calculate totals
  const totalEarnings = payments
    .filter(p => p.paymentStatus === "paid")
    .reduce((sum, p) => sum + (p.price || 0), 0);
    
  const pendingPayments = payments
    .filter(p => p.paymentStatus !== "paid")
    .reduce((sum, p) => sum + (p.price || 0), 0);

  // Separate payments by status
  const paidPayments = payments.filter(p => p.paymentStatus === "paid");
  const outstandingPayments = payments.filter(p => p.paymentStatus !== "paid");

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#111827]">العمولات والمدفوعات</h1>
        <p className="text-[#4b5563] mt-1">تتبع العمولات والمستحقات المالية</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#4b5563]">إجمالي الأرباح</p>
                <p className="text-2xl font-bold text-[#10b981]">${totalEarnings.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-[#10b981]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#4b5563]">المستحقات المعلقة</p>
                <p className="text-2xl font-bold text-[#f59e0b]">${pendingPayments.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-[#f59e0b]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#4b5563]">إجمالي العمليات</p>
                <p className="text-2xl font-bold text-[#111827]">{payments.length}</p>
              </div>
              <FileText className="w-8 h-8 text-[#4b5563]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Outstanding Payments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            المدفوعات المستحقة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 text-center text-gray-500">جاري التحميل...</div>
            ) : error ? (
              <div className="p-6 text-center text-red-600">{error}</div>
            ) : outstandingPayments.length === 0 ? (
              <div className="p-6 text-center text-gray-500">لا يوجد مدفوعات مستحقة حالياً.</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e5e7eb]">
                    <th className="text-right p-3 text-sm font-medium text-[#4b5563]">حالة الدفع</th>
                    <th className="text-right p-3 text-sm font-medium text-[#4b5563]">المبلغ</th>
                    <th className="text-right p-3 text-sm font-medium text-[#4b5563]">اسم الطالب</th>
                    <th className="text-right p-3 text-sm font-medium text-[#4b5563]">رقم العملية</th>
                    <th className="text-right p-3 text-sm font-medium text-[#4b5563]">تاريخ الاستحقاق</th>
                  </tr>
                </thead>
                <tbody>
                  {outstandingPayments.map((payment) => (
                    <tr key={payment.id} className="border-b border-[#f3f4f6] hover:bg-[#f9fafb]">
                      <td className="p-3">
                        <Badge className={payment.paymentStatus === "unpaid" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}>
                          {payment.paymentStatus === "unpaid" ? "مطلوب" : "قيد المتابعة"}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm font-medium text-[#111827]">${payment.price}</td>
                      <td className="p-3 text-sm text-[#111827]">
                        {payment.formSubmission?.fullName || "—"}
                      </td>
                      <td className="p-3 text-sm text-[#111827]">#{payment.id}</td>
                      <td className="p-3 text-sm text-[#4b5563]">
                        {new Date(payment.dateCreated).toLocaleDateString('ar-SA')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            سجل المدفوعات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 text-center text-gray-500">جاري التحميل...</div>
            ) : error ? (
              <div className="p-6 text-center text-red-600">{error}</div>
            ) : paidPayments.length === 0 ? (
              <div className="p-6 text-center text-gray-500">لا يوجد مدفوعات مستلمة بعد.</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e5e7eb]">
                    <th className="text-right p-3 text-sm font-medium text-[#4b5563]">حالة الدفع</th>
                    <th className="text-right p-3 text-sm font-medium text-[#4b5563]">المبلغ</th>
                    <th className="text-right p-3 text-sm font-medium text-[#4b5563]">اسم الطالب</th>
                    <th className="text-right p-3 text-sm font-medium text-[#4b5563]">رقم العملية</th>
                    <th className="text-right p-3 text-sm font-medium text-[#4b5563]">تاريخ الدفع</th>
                  </tr>
                </thead>
                <tbody>
                  {paidPayments.map((payment) => (
                    <tr key={payment.id} className="border-b border-[#f3f4f6] hover:bg-[#f9fafb]">
                      <td className="p-3">
                        <Badge className="bg-green-100 text-green-800">مدفوع</Badge>
                      </td>
                      <td className="p-3 text-sm font-medium text-[#111827]">${payment.price}</td>
                      <td className="p-3 text-sm text-[#111827]">
                        {payment.formSubmission?.fullName || "—"}
                      </td>
                      <td className="p-3 text-sm text-[#111827]">#{payment.id}</td>
                      <td className="p-3 text-sm text-[#4b5563]">
                        {new Date(payment.dateCreated).toLocaleDateString('ar-SA')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
