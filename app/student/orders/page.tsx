"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  MessageCircle,
  Eye,
  AlertCircle,
} from "lucide-react"

import { useEffect, useState } from "react";

type StudentOrder = {
  id: number;
  agentStatus: string;
  adminStatus: string;
  paymentStatus: string;
  submissionStatus: string;
  dateCreated: string;
  agentNotes?: string;
  adminNotes?: string;
  formSubmission?: {
    fullName: string;
    preferredProgram: string;
    email: string;
    contactNumber: string;
    nationality: string;
    countryOfResidence: string;
    cityOfResidence: string;
    universityId?: number;
    programId?: number;
  };
  agent?: {
    name: string;
    email: string;
  };
};

export default function StudentOrders() {
  const [orders, setOrders] = useState<StudentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<StudentOrder | null>(null);
  const [editingOrder, setEditingOrder] = useState<StudentOrder | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/student/orders");
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Accepted by University":
        return "bg-green-100 text-green-800";
      case "Approved":
        return "bg-blue-100 text-blue-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Sent to University":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "Pending":
        return "قيد المراجعة";
      case "Approved":
        return "مقبول";
      case "Rejected":
        return "مرفوض";
      case "Sent to University":
        return "مرسل للجامعة";
      case "Accepted by University":
        return "مقبول من الجامعة";
      case "Under Review":
        return "تحت المراجعة";
      default:
        return status;
    }
  };

  const getSubmissionStatusText = (status: string) => {
    switch (status) {
      case "submitted":
        return "تم التقديم";
      case "approved_by_admin":
        return "موافقة الإدارة";
      case "sent_to_university":
        return "مرسل للجامعة";
      case "accepted_by_university":
        return "قبول الجامعة";
      case "rejected_by_university":
        return "رفض الجامعة";
      case "university_response":
        return "رد الجامعة";
      case "submitted_visa_info":
        return "تقديم معلومات التأشيرة";
      case "submitted_payment":
        return "تقديم الدفع";
      case "completed":
        return "مكتمل";
      default:
        return status;
    }
  };

  const canEdit = (order: StudentOrder) => {
    return order.adminStatus === "Pending" || order.adminStatus === "Under Review";
  };

  const handleUpdateOrder = async (orderId: number, updatedInfo: any) => {
    try {
      const res = await fetch("/api/student/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, updatedInfo }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "فشل في تحديث الطلب");
      }

      // Refresh orders
      const ordersRes = await fetch("/api/student/orders");
      const ordersData = await ordersRes.json();
      setOrders(ordersData.orders || []);
      setEditingOrder(null);
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء التحديث");
    }
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#111827]">إدارة الطلبات</h1>
        <p className="text-[#4b5563] mt-1">متابعة حالة طلباتك وتحديث معلوماتك</p>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            طلباتك
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="p-6 text-center text-gray-500">جاري التحميل...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-600">{error}</div>
          ) : orders.length === 0 ? (
            <div className="p-6 text-center text-gray-500">لا توجد طلبات بعد.</div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#374151] rounded-full flex items-center justify-center text-white font-bold">
                        {order.id}
                      </div>
                      <div>
                        <h3 className="font-semibold">{order.formSubmission?.preferredProgram || "غير محدد"}</h3>
                        <p className="text-sm text-gray-600">تاريخ التقديم: {order.dateCreated?.slice(0, 10)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(order.adminStatus)}>
                        {getStatusText(order.adminStatus)}
                      </Badge>
                      <Badge className={order.paymentStatus === "paid" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {order.paymentStatus === "paid" ? "مدفوع" : "غير مدفوع"}
                      </Badge>
                    </div>
                  </div>

                  {/* Submission Status Progress */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">حالة التقديم:</h4>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-800">
                        {getSubmissionStatusText(order.submissionStatus)}
                      </Badge>
                    </div>
                  </div>

                  {/* Real Submission Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">الاسم الكامل:</span> {order.formSubmission?.fullName}
                    </div>
                    <div>
                      <span className="font-medium">البريد الإلكتروني:</span> {order.formSubmission?.email}
                    </div>
                    <div>
                      <span className="font-medium">رقم الهاتف:</span> {order.formSubmission?.contactNumber}
                    </div>
                    <div>
                      <span className="font-medium">الجنسية:</span> {order.formSubmission?.nationality}
                    </div>
                    <div>
                      <span className="font-medium">بلد الإقامة:</span> {order.formSubmission?.countryOfResidence}
                    </div>
                    <div>
                      <span className="font-medium">مدينة الإقامة:</span> {order.formSubmission?.cityOfResidence}
                    </div>
                    {order.agent && (
                      <div>
                        <span className="font-medium">الوكيل:</span> {order.agent.name}
                      </div>
                    )}
                  </div>

                  {(order.agentNotes || order.adminNotes) && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">ملاحظات:</h4>
                      {order.agentNotes && (
                        <p className="text-sm text-blue-700 mb-1">
                          <span className="font-medium">الوكيل:</span> {order.agentNotes}
                        </p>
                      )}
                      {order.adminNotes && (
                        <p className="text-sm text-blue-700">
                          <span className="font-medium">الإدارة:</span> {order.adminNotes}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                          <Eye className="w-4 h-4 ml-1" />
                          عرض التفاصيل
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl" dir="rtl">
                        <DialogHeader>
                          <DialogTitle>تفاصيل الطلب #{selectedOrder?.id}</DialogTitle>
                        </DialogHeader>
                        {selectedOrder && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="font-medium">التخصص المفضل:</label>
                                <p>{selectedOrder.formSubmission?.preferredProgram}</p>
                              </div>
                              <div>
                                <label className="font-medium">حالة الطلب:</label>
                                <Badge className={getStatusColor(selectedOrder.adminStatus)}>
                                  {getStatusText(selectedOrder.adminStatus)}
                                </Badge>
                              </div>
                              <div>
                                <label className="font-medium">حالة الدفع:</label>
                                <Badge className={selectedOrder.paymentStatus === "paid" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                  {selectedOrder.paymentStatus === "paid" ? "مدفوع" : "غير مدفوع"}
                                </Badge>
                              </div>
                              <div>
                                <label className="font-medium">تاريخ التقديم:</label>
                                <p>{selectedOrder.dateCreated?.slice(0, 10)}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    {canEdit(order) && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setEditingOrder(order)}>
                            <Edit className="w-4 h-4 ml-1" />
                            تعديل المعلومات
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl" dir="rtl">
                          <DialogHeader>
                            <DialogTitle>تعديل معلومات الطلب #{editingOrder?.id}</DialogTitle>
                          </DialogHeader>
                          {editingOrder && (
                            <div className="space-y-4">
                              <div className="bg-yellow-50 p-3 rounded-lg flex items-start gap-2">
                                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                                <div className="text-sm text-yellow-800">
                                  يمكنك تعديل معلوماتك الشخصية فقط عندما يكون الطلب قيد المراجعة أو تحت المراجعة.
                                </div>
                              </div>
                              <div className="grid grid-cols-1 gap-4">
                                <div>
                                  <label className="block text-sm font-medium mb-1">الاسم الكامل</label>
                                  <Input 
                                    defaultValue={editingOrder.formSubmission?.fullName}
                                    id="fullName"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
                                  <Input 
                                    defaultValue={editingOrder.formSubmission?.email}
                                    id="email"
                                    type="email"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1">رقم الهاتف</label>
                                  <Input 
                                    defaultValue={editingOrder.formSubmission?.contactNumber}
                                    id="contactNumber"
                                  />
                                </div>
                              </div>
                              <div className="flex gap-2 pt-4">
                                <Button 
                                  onClick={() => {
                                    const fullName = (document.getElementById('fullName') as HTMLInputElement)?.value;
                                    const email = (document.getElementById('email') as HTMLInputElement)?.value;
                                    const contactNumber = (document.getElementById('contactNumber') as HTMLInputElement)?.value;
                                    
                                    handleUpdateOrder(editingOrder.id, {
                                      fullName,
                                      email,
                                      contactNumber
                                    });
                                  }}
                                  className="bg-[#374151] hover:bg-[#4b5563]"
                                >
                                  حفظ التغييرات
                                </Button>
                                <Button variant="outline" onClick={() => setEditingOrder(null)}>
                                  إلغاء
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    )}

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MessageCircle className="w-4 h-4 ml-1" />
                          التواصل مع {order.agent ? "الوكيل" : "الإدارة"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent dir="rtl">
                        <DialogHeader>
                          <DialogTitle>إرسال رسالة بخصوص الطلب #{order.id}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">الرسالة</label>
                            <Textarea 
                              placeholder="اكتب رسالتك هنا..."
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              rows={4}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button className="bg-[#374151] hover:bg-[#4b5563]">
                              إرسال الرسالة
                            </Button>
                            <Button variant="outline" onClick={() => setMessage("")}>
                              إلغاء
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
