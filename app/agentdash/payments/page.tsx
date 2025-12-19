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
import { CommissionReceiptSection } from "@/components/commission-receipt-section"

// Types
type Payment = {
  id: number;
  formSubmission: {
    fullName: string;
  } | null;
  agentStatus: string;
  adminStatus: string;
  paymentStatus: string;
  dateCreated: string;
};

type Commission = {
  id: number;
  agentId: number;
  agent: {
    id: number;
    name: string;
    email: string;
  };
  orderId: number;
  amount: number;
  status: string;
  requestedAt: string;
  approvedAt: string | null;
  paidAt: string | null;
  notes: string | null;
  receiptPath: string | null;
  receiptUploadedAt: string | null;
  receiptViewedByAgent: boolean;
  deliveredToAgent: boolean;
  deliveredAt: string | null;
  [key: string]: any; // Allow additional properties
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
    studentId: null as number | null,
    amount: null as number | null,
    notes: ""
  });
  const [agentStudents, setAgentStudents] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Fetch payments
        const paymentsRes = await fetch("/api/agent/payments");
        if (!paymentsRes.ok) throw new Error("فشل في جلب بيانات المدفوعات");
        const paymentsData = await paymentsRes.json();
        setPayments(paymentsData.payments || []);

        // Fetch commissions
        const commissionsRes = await fetch("/api/agent/commissions");
        if (!commissionsRes.ok) throw new Error("فشل في جلب بيانات العمولات");
        const commissionsData = await commissionsRes.json();
        setCommissions(commissionsData.commissions || []);

        // Fetch agent students
        const studentsRes = await fetch("/api/agent/submissions");
        if (!studentsRes.ok) throw new Error("فشل في جلب بيانات الطلاب");
        const studentsData = await studentsRes.json();
        setAgentStudents(studentsData.submissions || []);
      } catch (err: any) {
        setError(err.message || "حدث خطأ");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Calculate totals - Note: Payment type doesn't have price field, using commission amounts instead
  const totalEarnings = commissions
    .filter(c => c.status === "paid")
    .reduce((sum, c) => sum + c.amount, 0);
    
  const pendingPayments = commissions
    .filter(c => c.status !== "paid")
    .reduce((sum, c) => sum + c.amount, 0);
    
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
      if (!newCommission.studentId || !newCommission.amount) {
        toast({
          title: "خطأ",
          description: "اسم الطالب والمبلغ مطلوبان",
          variant: "destructive",
        });
        return;
      }

      // Call the API to create the commission
      const response = await fetch('/api/agent/commissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: newCommission.studentId, // Using studentId as orderId for now
          amount: newCommission.amount,
          notes: newCommission.notes
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في تقديم طلب العمولة');
      }

      const createdCommission = await response.json();

      // Refresh the commissions list
      const commissionsRes = await fetch("/api/agent/commissions");
      if (commissionsRes.ok) {
        const commissionsData = await commissionsRes.json();
        setCommissions(commissionsData.commissions || []);
      }

      setIsCreateDialogOpen(false);
      setNewCommission({
        studentId: null,
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
        description: error instanceof Error ? error.message : "حدث خطأ أثناء تقديم طلب العمولة",
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
                  <Label htmlFor="studentId">اسم الطالب</Label>
                  <Select 
                    value={newCommission.studentId?.toString() || ''} 
                    onValueChange={(value) => setNewCommission({...newCommission, studentId: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر طالب" />
                    </SelectTrigger>
                    <SelectContent>
                      {agentStudents.map((student) => (
                        <SelectItem key={student.id} value={student.id.toString()}>
                          {student.fullName}
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
                      <td className="p-3 text-sm font-medium text-[#111827]">—</td>
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

              {/* Receipt Section */}
              <CommissionReceiptSection 
                commission={selectedCommission}
                onCommissionUpdate={(updatedCommission) => {
                  setSelectedCommission(updatedCommission);
                  // Update the commission in the list as well
                  setCommissions(prev => prev.map(c => 
                    c.id === updatedCommission.id ? updatedCommission : c
                  ));
                }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
