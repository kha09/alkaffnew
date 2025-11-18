"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  CreditCard,
  Upload,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Calendar,
} from "lucide-react"

import { useEffect, useState } from "react";

type PaymentOrder = {
  id: number;
  agentStatus: string;
  adminStatus: string;
  paymentStatus: string;
  dateCreated: string;
  invoice?: string;
  formSubmission?: {
    fullName: string;
    preferredProgram: string;
  };
  agent?: {
    name: string;
    email: string;
  };
};

export default function StudentPayments() {
  const [orders, setOrders] = useState<PaymentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingOrderId, setUploadingOrderId] = useState<number | null>(null);

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

  const handleFileUpload = async (orderId: number, file: File) => {
    try {
      setUploadingOrderId(orderId);
      
      // In a real implementation, you would upload the file to a server
      // For now, we'll simulate the upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update the order with the invoice path
      const res = await fetch("/api/student/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          orderId, 
          invoicePath: `/invoices/${file.name}`,
          fileName: file.name
        }),
      });

      if (!res.ok) {
        throw new Error("فشل في رفع الملف");
      }

      // Refresh orders
      const ordersRes = await fetch("/api/student/orders");
      const ordersData = await ordersRes.json();
      setOrders(ordersData.orders || []);
      
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء رفع الملف");
    } finally {
      setUploadingOrderId(null);
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "مدفوع";
      default:
        return "غير مدفوع";
    }
  };

  const getOrderStatusColor = (status: string) => {
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

  const getOrderStatusText = (status: string) => {
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

  const unpaidOrders = orders.filter(order => order.paymentStatus === "unpaid");
  const paidOrders = orders.filter(order => order.paymentStatus === "paid");

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#111827]">الدفع والمالية</h1>
        <p className="text-[#4b5563] mt-1">إدارة المدفوعات ورفع فواتير الدفع</p>
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#4b5563]">إجمالي الطلبات</p>
                <p className="text-2xl font-bold text-[#111827]">{orders.length}</p>
              </div>
              <FileText className="w-8 h-8 text-[#4b5563]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#4b5563]">المدفوعات المعلقة</p>
                <p className="text-2xl font-bold text-[#ef4444]">{unpaidOrders.length}</p>
              </div>
              <Clock className="w-8 h-8 text-[#ef4444]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#4b5563]">المدفوعات المكتملة</p>
                <p className="text-2xl font-bold text-[#10b981]">{paidOrders.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-[#10b981]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unpaid Orders */}
      {unpaidOrders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              طلبات تتطلب دفع الرسوم
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {unpaidOrders.map((order) => (
                <div key={order.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                        {order.id}
                      </div>
                      <div>
                        <h3 className="font-semibold text-red-800">{order.formSubmission?.preferredProgram || "غير محدد"}</h3>
                        <p className="text-sm text-red-600">تاريخ التقديم: {order.dateCreated?.slice(0, 10)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getOrderStatusColor(order.adminStatus)}>
                        {getOrderStatusText(order.adminStatus)}
                      </Badge>
                      <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                        {getPaymentStatusText(order.paymentStatus)}
                      </Badge>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg mb-3">
                    <div className="flex items-center gap-2 text-red-800 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">مطلوب دفع الرسوم</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      يرجى دفع رسوم التقديم ورفع إيصال الدفع أو الفاتورة لمتابعة معالجة طلبك.
                    </p>
                    
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" className="bg-red-600 hover:bg-red-700">
                            <Upload className="w-4 h-4 ml-1" />
                            رفع إيصال الدفع
                          </Button>
                        </DialogTrigger>
                        <DialogContent dir="rtl">
                          <DialogHeader>
                            <DialogTitle>رفع إيصال الدفع للطلب #{order.id}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <p className="text-sm text-blue-800">
                                <strong>ملاحظة:</strong> يرجى رفع إيصال الدفع أو الفاتورة بصيغة PDF أو صورة واضحة.
                                {order.agent ? 
                                  ` سيتم إرسال الإيصال إلى الوكيل ${order.agent.name} للمراجعة.` :
                                  " سيتم إرسال الإيصال إلى الإدارة للمراجعة."
                                }
                              </p>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-2">اختر ملف الإيصال</label>
                              <Input 
                                type="file" 
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleFileUpload(order.id, file);
                                  }
                                }}
                                disabled={uploadingOrderId === order.id}
                              />
                            </div>
                            
                            {uploadingOrderId === order.id && (
                              <div className="flex items-center gap-2 text-blue-600">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                <span className="text-sm">جاري رفع الملف...</span>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 ml-1" />
                        تحميل تفاصيل الرسوم
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            سجل المدفوعات
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right p-3 font-medium">رقم الطلب</th>
                    <th className="text-right p-3 font-medium">التخصص</th>
                    <th className="text-right p-3 font-medium">حالة الطلب</th>
                    <th className="text-right p-3 font-medium">حالة الدفع</th>
                    <th className="text-right p-3 font-medium">تاريخ التقديم</th>
                    <th className="text-right p-3 font-medium">الإيصال</th>
                    <th className="text-right p-3 font-medium">المسؤول</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr className="border-b" key={order.id}>
                      <td className="p-3">#{order.id}</td>
                      <td className="p-3">{order.formSubmission?.preferredProgram || "غير محدد"}</td>
                      <td className="p-3">
                        <Badge className={getOrderStatusColor(order.adminStatus)}>
                          {getOrderStatusText(order.adminStatus)}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                          {getPaymentStatusText(order.paymentStatus)}
                        </Badge>
                      </td>
                      <td className="p-3">{order.dateCreated?.slice(0, 10)}</td>
                      <td className="p-3">
                        {order.invoice ? (
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 ml-1" />
                            تحميل
                          </Button>
                        ) : (
                          <span className="text-gray-500 text-sm">لا يوجد</span>
                        )}
                      </td>
                      <td className="p-3">
                        {order.agent ? (
                          <div className="text-sm">
                            <div className="font-medium">{order.agent.name}</div>
                            <div className="text-gray-500">وكيل</div>
                          </div>
                        ) : (
                          <div className="text-sm">
                            <div className="font-medium">الإدارة</div>
                            <div className="text-gray-500">مباشر</div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            تعليمات الدفع
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">كيفية الدفع:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• قم بدفع رسوم التقديم حسب التفاصيل المرسلة إليك</li>
              <li>• احتفظ بإيصال الدفع أو الفاتورة</li>
              <li>• ارفع صورة واضحة من الإيصال في النظام</li>
              <li>• انتظر تأكيد استلام الدفع من المسؤول</li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 p-3 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">ملاحظات مهمة:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• تأكد من وضوح جميع تفاصيل الإيصال</li>
              <li>• الملفات المقبولة: PDF, JPG, PNG</li>
              <li>• حجم الملف الأقصى: 5 ميجابايت</li>
              <li>• في حالة وجود مشاكل، تواصل مع المسؤول</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
