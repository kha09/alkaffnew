"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  Bell,
  TrendingUp,
  User,
} from "lucide-react"

import { useEffect, useState } from "react";

type StudentOrder = {
  id: number;
  agentStatus: string;
  adminStatus: string;
  paymentStatus: string;
  submissionStatus: string;
  dateCreated: string;
  formSubmission?: {
    fullName: string;
    preferredProgram: string;
    email: string;
    contactNumber: string;
  };
  agent?: {
    name: string;
    email: string;
  };
};

export default function StudentDashboard() {
  const [orders, setOrders] = useState<StudentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Get the current submission (assuming one submission per student)
  const currentSubmission = orders.length > 0 ? orders[0] : null;
  
  // Define submission status stages
  const submissionStages = [
    { key: "submitted", label: "تم التقديم", icon: FileText },
    { key: "approved_by_admin", label: "موافقة الإدارة", icon: CheckCircle },
    { key: "sent_to_university", label: "مرسل للجامعة", icon: FileText },
    { key: "university_response", label: "رد الجامعة", icon: CheckCircle },
    { key: "submitted_visa_info", label: "تقديم معلومات التأشيرة", icon: FileText },
    { key: "submitted_payment", label: "تقديم الدفع", icon: CreditCard },
    { key: "completed", label: "مكتمل", icon: CheckCircle }
  ];

  // Calculate progress based on current submission status
  const getCurrentStageIndex = (status: string) => {
    const stageIndex = submissionStages.findIndex(stage => stage.key === status);
    return stageIndex >= 0 ? stageIndex : 0;
  };

  const currentStageIndex = currentSubmission ? getCurrentStageIndex(currentSubmission.submissionStatus) : 0;
  const progressPercentage = currentSubmission ? ((currentStageIndex + 1) / submissionStages.length) * 100 : 0;

  // Count orders by status for stats
  const pendingOrders = orders.filter(order => 
    order.adminStatus === "Pending" || order.adminStatus === "Under Review"
  ).length;
  const acceptedOrders = orders.filter(order => 
    order.adminStatus === "Approved" || order.adminStatus === "Accepted by University"
  ).length;
  const rejectedOrders = orders.filter(order => 
    order.adminStatus === "Rejected"
  ).length;
  const unpaidOrders = orders.filter(order => 
    order.paymentStatus === "unpaid"
  ).length;

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Dashboard Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#111827]">لوحة الطالب</h1>
        <p className="text-[#4b5563] mt-1">مرحباً بك في لوحة التحكم الخاصة بك</p>
      </div>

      {/* Progress Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            تقدم طلباتك
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#4b5563]">إجمالي التقدم</span>
              <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            {/* Submission Status Progress Steps */}
            {currentSubmission && (
              <div className="space-y-4">
                <h4 className="font-medium text-[#111827]">مراحل التقديم</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {submissionStages.map((stage, index) => {
                    const Icon = stage.icon;
                    const isCompleted = index <= currentStageIndex;
                    const isCurrent = index === currentStageIndex;
                    const isRejected = stage.key === "rejected_by_university" && currentSubmission.submissionStatus === "rejected_by_university";
                    
                    return (
                      <div
                        key={stage.key}
                        className={`flex items-center gap-2 p-2 rounded-lg border ${
                          isRejected
                            ? "bg-red-50 border-red-200"
                            : isCompleted
                            ? "bg-green-50 border-green-200"
                            : isCurrent
                            ? "bg-blue-50 border-blue-200"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 ${
                            isRejected
                              ? "text-red-600"
                              : isCompleted
                              ? "text-green-600"
                              : isCurrent
                              ? "text-blue-600"
                              : "text-gray-400"
                          }`}
                        />
                        <span
                          className={`text-xs font-medium ${
                            isRejected
                              ? "text-red-800"
                              : isCompleted
                              ? "text-green-800"
                              : isCurrent
                              ? "text-blue-800"
                              : "text-gray-600"
                          }`}
                        >
                          {stage.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center pt-4 border-t">
              <div>
                <div className="text-2xl font-bold text-[#111827]">{orders.length}</div>
                <div className="text-xs text-[#4b5563]">إجمالي الطلبات</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#f59e0b]">{pendingOrders}</div>
                <div className="text-xs text-[#4b5563]">قيد المراجعة</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#10b981]">{acceptedOrders}</div>
                <div className="text-xs text-[#4b5563]">مقبولة</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#ef4444]">{rejectedOrders}</div>
                <div className="text-xs text-[#4b5563]">مرفوضة</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#4b5563]">الطلبات النشطة</p>
                <p className="text-2xl font-bold text-[#f59e0b]">{pendingOrders}</p>
              </div>
              <Clock className="w-8 h-8 text-[#f59e0b]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#4b5563]">الطلبات المقبولة</p>
                <p className="text-2xl font-bold text-[#10b981]">{acceptedOrders}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-[#10b981]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#4b5563]">المدفوعات المعلقة</p>
                <p className="text-2xl font-bold text-[#ef4444]">{unpaidOrders}</p>
              </div>
              <CreditCard className="w-8 h-8 text-[#ef4444]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            طلباتك الأخيرة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 text-center text-gray-500">جاري التحميل...</div>
            ) : error ? (
              <div className="p-6 text-center text-red-600">{error}</div>
            ) : orders.length === 0 ? (
              <div className="p-6 text-center text-gray-500">لا توجد طلبات بعد.</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right p-3 font-medium">التخصص</th>
                    <th className="text-right p-3 font-medium">حالة الطلب</th>
                    <th className="text-right p-3 font-medium">حالة الدفع</th>
                    <th className="text-right p-3 font-medium">تاريخ التقديم</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr className="border-b" key={order.id}>
                      <td className="p-3">
                        {order.formSubmission?.preferredProgram || "غير محدد"}
                      </td>
                      <td className="p-3">
                        <Badge 
                          className={
                            order.adminStatus === "Accepted by University" 
                              ? "bg-green-100 text-green-800"
                              : order.adminStatus === "Rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {order.adminStatus === "Pending" && "قيد المراجعة"}
                          {order.adminStatus === "Approved" && "مقبول"}
                          {order.adminStatus === "Rejected" && "مرفوض"}
                          {order.adminStatus === "Sent to University" && "مرسل للجامعة"}
                          {order.adminStatus === "Accepted by University" && "مقبول من الجامعة"}
                          {order.adminStatus === "Under Review" && "تحت المراجعة"}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge 
                          className={
                            order.paymentStatus === "paid" 
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {order.paymentStatus === "paid" ? "مدفوع" : "غير مدفوع"}
                        </Badge>
                      </td>
                      <td className="p-3">{order.dateCreated?.slice(0, 10)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            إشعارات مهمة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {unpaidOrders > 0 && (
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
              <CreditCard className="w-5 h-5 text-red-600" />
              <span className="text-sm">لديك {unpaidOrders} طلب يتطلب دفع الرسوم</span>
            </div>
          )}
          {pendingOrders > 0 && (
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
              <span className="text-sm">لديك {pendingOrders} طلب قيد المراجعة</span>
            </div>
          )}
          {acceptedOrders > 0 && (
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm">تهانينا! لديك {acceptedOrders} طلب مقبول</span>
            </div>
          )}
          {orders.length === 0 && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
              <span className="text-sm">مرحباً بك! يمكنك البدء بتقديم طلب جديد من الموقع الرئيسي</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
