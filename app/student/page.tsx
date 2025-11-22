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

type StudentSubmission = {
  id: number;
  fullName: string;
  preferredProgram: string;
  email: string;
  contactNumber: string;
  nationality: string;
  countryOfResidence: string;
  cityOfResidence: string;
  submissionStatus: string;
  submittedAt: string;
  agent?: {
    name: string;
    email: string;
  };
  uploadedFiles?: any[];
};

export default function StudentDashboard() {
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubmissions() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/student/submissions");
        if (!res.ok) throw new Error("فشل في جلب بيانات الطلبات");
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

  // Get the current submission (assuming one submission per student)
  const currentSubmission = submissions.length > 0 ? submissions[0] : null;
  
  // Define submission status stages
  const submissionStages = [
    { key: "submitted", label: "تم التقديم", icon: FileText },
    { key: "approved_by_admin", label: "موافقة الإدارة", icon: CheckCircle },
    { key: "sent_to_university", label: "مرسل للجامعة", icon: FileText },
    { key: "accepted_by_university", label: "مقبول من الجامعة", icon: CheckCircle },
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

  // Count submissions by status for stats
  const pendingSubmissions = submissions.filter(submission => 
    submission.submissionStatus === "submitted" || submission.submissionStatus === "approved_by_admin"
  ).length;
  const acceptedSubmissions = submissions.filter(submission => 
    submission.submissionStatus === "accepted_by_university" || submission.submissionStatus === "completed"
  ).length;
  const rejectedSubmissions = submissions.filter(submission => 
    submission.submissionStatus === "rejected_by_university"
  ).length;
  const inProgressSubmissions = submissions.filter(submission => 
    submission.submissionStatus === "sent_to_university" || submission.submissionStatus === "submitted_visa_info"
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
                <div className="text-2xl font-bold text-[#111827]">{submissions.length}</div>
                <div className="text-xs text-[#4b5563]">إجمالي الطلبات</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#f59e0b]">{pendingSubmissions}</div>
                <div className="text-xs text-[#4b5563]">قيد المراجعة</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#10b981]">{acceptedSubmissions}</div>
                <div className="text-xs text-[#4b5563]">مقبولة</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#ef4444]">{rejectedSubmissions}</div>
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
                <p className="text-2xl font-bold text-[#f59e0b]">{pendingSubmissions}</p>
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
                <p className="text-2xl font-bold text-[#10b981]">{acceptedSubmissions}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-[#10b981]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#4b5563]">الطلبات قيد المعالجة</p>
                <p className="text-2xl font-bold text-[#ef4444]">{inProgressSubmissions}</p>
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
            ) : submissions.length === 0 ? (
              <div className="p-6 text-center text-gray-500">لا توجد طلبات بعد.</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right p-3 font-medium">التخصص</th>
                    <th className="text-right p-3 font-medium">حالة الطلب</th>
                    <th className="text-right p-3 font-medium">الوكيل</th>
                    <th className="text-right p-3 font-medium">تاريخ التقديم</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.slice(0, 5).map((submission) => (
                    <tr className="border-b" key={submission.id}>
                      <td className="p-3">
                        {submission.preferredProgram || "غير محدد"}
                      </td>
                      <td className="p-3">
                        <Badge 
                          className={
                            submission.submissionStatus === "accepted_by_university" || submission.submissionStatus === "completed"
                              ? "bg-green-100 text-green-800"
                              : submission.submissionStatus === "rejected_by_university"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {submission.submissionStatus === "submitted" && "تم التقديم"}
                          {submission.submissionStatus === "approved_by_admin" && "موافقة الإدارة"}
                          {submission.submissionStatus === "sent_to_university" && "مرسل للجامعة"}
                          {submission.submissionStatus === "accepted_by_university" && "مقبول من الجامعة"}
                          {submission.submissionStatus === "rejected_by_university" && "مرفوض من الجامعة"}
                          {submission.submissionStatus === "submitted_visa_info" && "تقديم معلومات التأشيرة"}
                          {submission.submissionStatus === "submitted_payment" && "تقديم الدفع"}
                          {submission.submissionStatus === "completed" && "مكتمل"}
                        </Badge>
                      </td>
                      <td className="p-3">
                        {submission.agent?.name || "غير محدد"}
                      </td>
                      <td className="p-3">{new Date(submission.submittedAt).toLocaleDateString('ar-SA')}</td>
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
          {inProgressSubmissions > 0 && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <span className="text-sm">لديك {inProgressSubmissions} طلب قيد المعالجة</span>
            </div>
          )}
          {pendingSubmissions > 0 && (
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
              <span className="text-sm">لديك {pendingSubmissions} طلب قيد المراجعة</span>
            </div>
          )}
          {acceptedSubmissions > 0 && (
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm">تهانينا! لديك {acceptedSubmissions} طلب مقبول</span>
            </div>
          )}
          {rejectedSubmissions > 0 && (
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
              <span className="text-sm">لديك {rejectedSubmissions} طلب مرفوض - يرجى مراجعة الدعم الفني</span>
            </div>
          )}
          {submissions.length === 0 && (
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
