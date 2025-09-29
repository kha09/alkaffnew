"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Search, Filter, Plus, Eye, Edit } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

type Order = {
  id: number;
  formSubmission: {
    fullName: string;
  } | null;
  user: {
    fullName: string;
    email: string;
  };
  agentStatus: string;
  adminStatus: string;
  paymentStatus: string;
  invoice: string | null;
  dateCreated: string;
  agentNotes: string | null;
  adminNotes: string | null;
};

type UserOption = {
  id: number;
  fullName: string;
  email: string;
  formSubmission: {
    id: number;
    fullName: string;
  } | null;
};

export default function AgentOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newOrder, setNewOrder] = useState({
    userId: null as number | null,
    price: null as number | null,
  });
  const [agentNotes, setAgentNotes] = useState("");

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
    
    async function fetchUsers() {
      try {
        const res = await fetch("/api/admin/users");
        if (!res.ok) throw new Error("فشل في جلب بيانات المستخدمين");
        const data = await res.json();
        setUsers(data);
      } catch (err: any) {
        console.error("Error fetching users:", err);
      }
    }
    
    fetchOrders();
    fetchUsers();
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

  const handleCreateOrder = async () => {
    try {
      const response = await fetch('/api/agent/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
      
      if (response.ok) {
        const createdOrder = await response.json();
        setOrders([createdOrder, ...orders]);
        setIsCreateDialogOpen(false);
        setNewOrder({
          userId: null,
          price: null,
        });
        toast({
          title: "نجاح",
          description: "تم إنشاء الطلب بنجاح",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }
    } catch (error: any) {
      console.error('Error creating order:', error);
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء إنشاء الطلب",
        variant: "destructive",
      });
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm 
      ? (order.formSubmission?.fullName && order.formSubmission.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        order.user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    // Remove status filter for now since we're using agentStatus and adminStatus
    return matchesSearch;
  });

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#111827]">متابعة الطلبات</h1>
          <p className="text-[#4b5563] mt-1">عرض وتنظيم الطلبات المرسلة عبرك</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 ml-2" />
              طلب جديد
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إنشاء طلب جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="userId">المستخدم</Label>
                <Select 
                  value={newOrder.userId?.toString() || ''} 
                  onValueChange={(value) => setNewOrder({...newOrder, userId: parseInt(value) || null})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر مستخدم" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.formSubmission?.fullName || user.fullName} - {user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleCreateOrder}>
                  إنشاء
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Orders Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            الطلبات المرسلة
          </CardTitle>
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
                    <th className="text-right p-3 text-sm font-medium text-[#4b5563]">حالة الوكيل</th>
                    <th className="text-right p-3 text-sm font-medium text-[#4b5563]">حالة المشرف</th>
                    <th className="text-right p-3 text-sm font-medium text-[#4b5563]">اسم الطالب</th>
                    <th className="text-right p-3 text-sm font-medium text-[#4b5563]">رقم الطلب</th>
                    <th className="text-right p-3 text-sm font-medium text-[#4b5563]">تاريخ التقديم</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-[#f3f4f6] hover:bg-[#f9fafb]">
                      <td className="p-3">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedOrder(order);
                            setAgentNotes(order.agentNotes || "");
                            setIsViewDialogOpen(true);
                          }}
                        >
                          عرض
                        </Button>
                      </td>
                      <td className="p-3">
                        <Badge className={getStatusBadgeClass(order.paymentStatus)}>
                          {getPaymentStatusLabel(order.paymentStatus)}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge className="bg-blue-100 text-blue-800">
                          {order.agentStatus}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge className="bg-purple-100 text-purple-800">
                          {order.adminStatus}
                        </Badge>
                      </td>
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
      
      {/* View Order Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تفاصيل الطلب #{selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>معلومات الطلب</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">رقم الطلب:</span>
                      <span className="font-medium">#{selectedOrder.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">تاريخ الطلب:</span>
                      <span>{new Date(selectedOrder.dateCreated).toLocaleDateString('ar-SA')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">حالة الدفع:</span>
                      <Badge className={getStatusBadgeClass(selectedOrder.paymentStatus)}>
                        {getPaymentStatusLabel(selectedOrder.paymentStatus)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">حالة الوكيل:</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        {selectedOrder.agentStatus}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">حالة المشرف:</span>
                      <Badge className="bg-purple-100 text-purple-800">
                        {selectedOrder.adminStatus}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>معلومات الطالب</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">الاسم:</span>
                      <span>{selectedOrder.formSubmission?.fullName || selectedOrder.user.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">البريد الإلكتروني:</span>
                      <span>{selectedOrder.user.email}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Notes Section */}
              <Card>
                <CardHeader>
                  <CardTitle>الملاحظات</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Agent Notes */}
                  <div>
                    <Label htmlFor="agentNotes">ملاحظاتك (مرئية للمشرف فقط)</Label>
                    <Textarea
                      id="agentNotes"
                      className="w-full p-3 border rounded-md mt-1"
                      rows={4}
                      value={agentNotes}
                      onChange={(e) => setAgentNotes(e.target.value)}
                      placeholder="أضف ملاحظات حول هذا الطلب..."
                    />
                    <div className="mt-2 flex justify-end">
                      <Button>حفظ الملاحظات</Button>
                    </div>
                  </div>
                  
                  {/* Admin Notes */}
                  {selectedOrder.adminNotes && (
                    <div>
                      <Label>ملاحظات المشرف (مرئية لك فقط)</Label>
                      <div className="mt-2 p-3 bg-gray-50 rounded-md">
                        <p className="text-gray-700">{selectedOrder.adminNotes}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
