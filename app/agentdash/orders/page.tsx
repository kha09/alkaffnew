"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Search, Filter } from "lucide-react"

type Order = {
  id: number;
  formSubmission: {
    fullName: string;
  } | null;
  user: {
    fullName: string;
  };
  price: number;
  status: string;
  paymentStatus: string;
  dateCreated: string;
};

export default function AgentOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return "bg-green-100 text-green-800"
      case 'pending':
        return "bg-yellow-100 text-yellow-800"
      case 'cancelled':
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return "مكتمل"
      case 'pending':
        return "قيد المعالجة"
      case 'cancelled':
        return "ملغي"
      default:
        return status
    }
  }

  const getPaymentStatusLabel = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'paid':
        return "مدفوع"
      case 'unpaid':
        return "غير مدفوع"
      case 'refunded':
        return "مرتجع"
      default:
        return paymentStatus
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm 
      ? (order.formSubmission?.fullName && order.formSubmission.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        order.user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#111827]">متابعة الطلبات</h1>
        <p className="text-[#4b5563] mt-1">عرض وتنظيم الطلبات المرسلة عبرك</p>
      </div>

      {/* Orders Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            الطلبات المرسلة
          </CardTitle>
          <Button variant="outline">تحديث الحالة</Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4b5563] w-4 h-4" />
              <Input 
                placeholder="بحث برقم الطلب أو اسم الطالب..." 
                className="pr-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="pending">قيد المعالجة</SelectItem>
                  <SelectItem value="completed">مكتمل</SelectItem>
                  <SelectItem value="cancelled">ملغي</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                فلترة
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 text-center text-gray-500">جاري التحميل...</div>
            ) : error ? (
              <div className="p-6 text-center text-red-600">{error}</div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                {searchTerm || statusFilter !== "all" 
                  ? "لا توجد نتائج مطابقة للبحث" 
                  : "لا يوجد طلبات بعد."}
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e5e7eb]">
                    <th className="text-right p-3 text-sm font-medium text-[#4b5563]">إجراءات</th>
                    <th className="text-right p-3 text-sm font-medium text-[#4b5563]">حالة الدفع</th>
                    <th className="text-right p-3 text-sm font-medium text-[#4b5563]">الحالة</th>
                    <th className="text-right p-3 text-sm font-medium text-[#4b5563]">المبلغ</th>
                    <th className="text-right p-3 text-sm font-medium text-[#4b5563]">اسم الطالب</th>
                    <th className="text-right p-3 text-sm font-medium text-[#4b5563]">رقم الطلب</th>
                    <th className="text-right p-3 text-sm font-medium text-[#4b5563]">تاريخ التقديم</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-[#f3f4f6] hover:bg-[#f9fafb]">
                      <td className="p-3">
                        <Button size="sm" variant="outline">
                          عرض
                        </Button>
                      </td>
                      <td className="p-3">
                        <Badge className={getStatusBadgeClass(order.paymentStatus)}>
                          {getPaymentStatusLabel(order.paymentStatus)}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge className={getStatusBadgeClass(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm font-medium text-[#111827]">${order.price}</td>
                      <td className="p-3 text-sm text-[#111827]">
                        {order.formSubmission?.fullName || order.user.fullName}
                      </td>
                      <td className="p-3 text-sm font-medium text-[#111827]">#{order.id}</td>
                      <td className="p-3 text-sm text-[#4b5563]">
                        {new Date(order.dateCreated).toLocaleDateString('ar-SA')}
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
