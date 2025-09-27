"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, Plus, Filter, DollarSign, FileText, Check, X, Eye } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// Types
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

type Commission = {
  id: number;
  orderId: number;
  amount: number;
  status: string;
  requestedAt: string;
  approvedAt: string | null;
  paidAt: string | null;
  notes: string | null;
};

export default function AgentPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState<Commission | null>(null);
  const [newCommission, setNewCommission] = useState({
    orderId: null as number | null,
    amount: null as number | null,
    notes: ""
  });

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
    
    // Fetch commissions (mock data for now)
    const mockCommissions: Commission[] = [
      {
        id: 1,
        orderId: 101,
        amount: 150,
        status: "pending",
        requestedAt: "2025-09-16T14:20:00Z",
        approvedAt: null,
        paidAt: null,
        notes: "طلب العمولة بعد إكمال الطلب"
      },
      {
        id: 2,
        orderId: 102,
        amount: 200,
        status: "approved",
        requestedAt: "2025-09-11T16:45:00Z",
        approvedAt: "2025-09-12T10:30:00Z",
        paidAt: null,
        notes: "تمت المراجعة والموافقة"
      },
      {
        id: 3,
        orderId: 103,
        amount: 180,
        status: "paid",
        requestedAt: "2025-09-06T13:10:00Z",
        approvedAt: "2025-09-07T09:15:00Z",
        paidAt: "2025-09-15T15:30:00Z",
        notes: "تم الدفع بنجاح"
      }
    ];
    setCommissions(mockCommissions);
  }, []);

  // Calculate totals
  const totalEarnings = payments
    .filter(p => p.paymentStatus === "paid")
    .reduce((sum, p) => sum + (p.price || 0), 0);
    
  const pendingPayments = payments
    .filter(p => p.paymentStatus !== "paid")
    .reduce((sum, p) => sum + (p.price || 0), 0);
    
  const totalCommissions = commissions
    .filter(c => c.status === "paid")
    .reduce((sum, c) => sum + c.amount, 0);
    
  const pendingCommissions = commissions
    .filter(c => c.status !== "paid")
    .reduce((sum, c) => sum + c.amount, 0);

  // Separate payments by status
  const paidPayments = payments.filter(p => p.paymentStatus === "paid");
  const outstandingPayments = payments.filter(p => p.paymentStatus !== "paid");
  
  // Separate commissions by status
  const pendingCommissionsList = commissions.filter(c => c.status === "pending");
  const approvedCommissions = commissions.filter(c => c.status === "approved");
  const paidCommissions = commissions.filter(c => c.status === "paid");

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'paid':
        return "bg-green-100 text-green-800"
      case 'approved':
        return "bg-blue-100 text-blue-800"
      case 'pending':
        return "bg-yellow-100 text-yellow-800"
      case 'rejected':
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return "مدفوع"
      case 'approved':
        return "موافق عليه"
      case 'pending':
        return "قيد الانتظار"
      case 'rejected':
        return "مرفوض"
      default:
        return status
    }
  }

  const handleViewCommission = (commission: Commission) => {
    setSelectedCommission(commission);
    setIsViewDialogOpen(true);
  }

  const handleCreateCommission = async () => {
    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll add to the local state
      if (!newCommission.orderId || !newCommission.amount) {
        toast({
          title: "خطأ",
          description: "رقم الطلب والمبلغ مطلوبان",
          variant: "destructive",
        });
        return;
      }

      const newCommissionObj: Commission = {
        id: commissions.length + 1,
        orderId: newCommission.orderId,
        amount: newCommission.amount,
        status: "pending",
        requestedAt: new Date().toISOString(),
        approvedAt: null,
        paidAt: null,
        notes: newCommission.notes
      };

      setCommissions([newCommissionObj, ...commissions]);
      setIsCreateDialogOpen(false);
      setNewCommission({
        orderId: null,
        amount: null,
        notes: ""
      });
      toast({
        title: "نجاح",
        description: "تم تقديم طلب العمولة بنجاح",
      });
    } catch (error) {
      console.error('Error creating commission:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تقديم طلب العمولة",
        variant: "destructive",
      });
    }
  }

  const filteredCommissions = commissions.filter(commission => {
    const matchesSearch = commission.id.toString().includes(searchTerm) ||
      commission.orderId.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || commission.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#111827]">العمولات والمدفوعات</h1>
          <p className="text-[#4b5563] mt-1">تتبع العمولات والمستحقات المالية</p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#111827] hover:bg-[#374151]">
                <Plus className="w-4 h-4 ml-2" />
                طلب عمولة
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>طلب عمولة جديدة</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="orderId">رقم الطلب</Label>
                  <Select 
                    value={newCommission.orderId?.toString() || ''} 
                    onValueChange={(value) => setNewCommission({...newCommission, orderId: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر طلب" />
                    </SelectTrigger>
                    <SelectContent>
                      {paidPayments.map((payment) => (
                        <SelectItem key={payment.id} value={payment.id.toString()}>
                          #{payment.id} - {payment.formSubmission?.fullName || "—"} - ${payment.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount">مبلغ العمولة</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newCommission.amount || ''}
                    onChange={(e) => setNewCommission({...newCommission, amount: parseFloat(e.target.value) || null})}
                    placeholder="أدخل مبلغ العمولة"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">ملاحظات</Label>
                  <textarea
                    id="notes"
                    className="w-full p-3 border rounded-md"
                    rows={3}
                    value={newCommission.notes}
                    onChange={(e) => setNewCommission({...newCommission, notes: e.target.value})}
                    placeholder="أضف ملاحظات حول طلب العمولة"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={handleCreateCommission}>
                    تقديم الطلب
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                <p className="text-sm text-[#4b5563]">إجمالي العمولات</p>
                <p className="text-2xl font-bold text-[#3b82f6]">${totalCommissions.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-[#3b82f6]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#4b5563]">العمولات المعلقة</p>
                <p className="text-2xl font-bold text-[#ef4444]">${pendingCommissions.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-[#ef4444]" />
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

      {/* Commissions Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              طلبات العمولة
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="w-4 h-4 ml-2" />
              طلب جديد
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Commission Filters */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4b5563] w-4 h-4" />
                <Input 
                  placeholder="البحث في طلبات العمولة..." 
                  className="pr-10" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="pending">قيد الانتظار</SelectItem>
                  <SelectItem value="approved">موافق عليه</SelectItem>
                  <SelectItem value="paid">مدفوع</SelectItem>
                  <SelectItem value="rejected">مرفوض</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 ml-2" />
                فلترة
              </Button>
            </div>
          </div>

          {/* Commissions Table */}
          <div className="overflow-x-auto">
            {filteredCommissions.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                لا توجد طلبات عمولة
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e5e7eb]">
                    <th className="text-right p-3 text-sm font-medium text-[#4b5563]">الإجراءات</th>
                    <th className="text-right p-3 text-sm font-medium text-[#4b5563]">الحالة</th>
                    <th className="text-right p-3 text-sm font-medium text-[#4b5563]">المبلغ</th>
                    <th className="text-right p-3 text-sm font-medium text-[#4b5563]">رقم الطلب</th>
                    <th className="text-right p-3 text-sm font-medium text-[#4b5563]">تاريخ الطلب</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCommissions.map((commission) => (
                    <tr key={commission.id} className="border-b border-[#f3f4f6] hover:bg-[#f9fafb]">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewCommission(commission)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge className={getStatusBadgeClass(commission.status)}>
                          {getStatusLabel(commission.status)}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm font-medium text-[#111827]">${commission.amount.toFixed(2)}</td>
                      <td className="p-3 text-sm text-[#111827]">#{commission.orderId}</td>
                      <td className="p-3 text-sm text-[#4b5563]">
                        {new Date(commission.requestedAt).toLocaleDateString('ar-SA')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Commission Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تفاصيل طلب العمولة #{selectedCommission?.id}</DialogTitle>
          </DialogHeader>
          {selectedCommission && (
            <div className="space-y-6">
              {/* Commission Details */}
              <Card>
                <CardHeader>
                  <CardTitle>معلومات العمولة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">رقم العمولة:</span>
                    <span className="font-medium">#{selectedCommission.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">رقم الطلب:</span>
                    <span className="font-medium">#{selectedCommission.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">المبلغ:</span>
                    <span className="font-medium">${selectedCommission.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الحالة:</span>
                    <Badge className={getStatusBadgeClass(selectedCommission.status)}>
                      {getStatusLabel(selectedCommission.status)}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">تاريخ الطلب:</span>
                    <span>{new Date(selectedCommission.requestedAt).toLocaleDateString('ar-SA')}</span>
                  </div>
                  {selectedCommission.approvedAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">تاريخ الموافقة:</span>
                      <span>{new Date(selectedCommission.approvedAt).toLocaleDateString('ar-SA')}</span>
                    </div>
                  )}
                  {selectedCommission.paidAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">تاريخ الدفع:</span>
                      <span>{new Date(selectedCommission.paidAt).toLocaleDateString('ar-SA')}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Notes */}
              {selectedCommission.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>الملاحظات</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{selectedCommission.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
