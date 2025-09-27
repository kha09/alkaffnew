"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Search, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ApplicationForm } from "@/components/application-form"
import { toast } from "@/hooks/use-toast"

type Submission = {
  id: number;
  fullName: string;
  submittedAt: string;
  orderStage: string;
  email: string;
  contactNumber: string;
  countryOfResidence: string;
  cityOfResidence: string;
};

export default function AgentStudentsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredSubmissions = submissions.filter(submission => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      submission.fullName.toLowerCase().includes(term) ||
      submission.email.toLowerCase().includes(term) ||
      submission.contactNumber.includes(term)
    );
  });

  const handleSubmissionSuccess = () => {
    // Refresh the submissions list
    async function refreshSubmissions() {
      try {
        const res = await fetch("/api/agent/submissions");
        if (!res.ok) throw new Error("فشل في جلب بيانات الطلاب");
        const data = await res.json();
        setSubmissions(data.submissions || []);
        toast({
          title: "نجاح",
          description: "تم إنشاء الطالب بنجاح",
        });
      } catch (err: any) {
        toast({
          title: "خطأ",
          description: err.message || "حدث خطأ أثناء تحديث القائمة",
          variant: "destructive",
        });
      }
    }
    refreshSubmissions();
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#111827]">إدارة الطلاب</h1>
        <p className="text-[#4b5563] mt-1">عرض وتنظيم الطلاب المسجلين عبرك</p>
      </div>

      {/* Students Registration Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            الطلاب المسجلين عبرك
          </CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#1f2937] hover:bg-[#374151]">
                <Plus className="w-4 h-4 ml-2" />
                إضافة طالب جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6">
              <DialogHeader>
                <DialogTitle>إضافة طالب جديد</DialogTitle>
              </DialogHeader>
              <ApplicationForm 
                inline={true}
                agentId={1} // TODO: Replace with actual agent ID from session
                onClose={() => {}} 
                onSubmissionSuccess={handleSubmissionSuccess}
                hideSuccessModal={true}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative max-w-md">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4b5563] w-4 h-4" />
              <Input 
                placeholder="البحث عن الطلاب..." 
                className="pr-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 text-center text-gray-500">جاري التحميل...</div>
            ) : error ? (
              <div className="p-6 text-center text-red-600">{error}</div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                {searchTerm ? "لا توجد نتائج مطابقة للبحث" : "لا يوجد طلاب مسجلين بعد."}
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e5e7eb]">
                    <th className="text-right p-3 text-sm font-medium text-[#4b5563]">إجراءات</th>
                    <th className="text-right p-3 text-sm font-medium text-[#4b5563]">الحالة</th>
                    <th className="text-right p-3 text-sm font-medium text-[#4b5563]">رقم الاتصال</th>
                    <th className="text-right p-3 text-sm font-medium text-[#4b5563]">البريد الإلكتروني</th>
                    <th className="text-right p-3 text-sm font-medium text-[#4b5563]">المدينة</th>
                    <th className="text-right p-3 text-sm font-medium text-[#4b5563]">البلد</th>
                    <th className="text-right p-3 text-sm font-medium text-[#4b5563]">اسم الطالب</th>
                    <th className="text-right p-3 text-sm font-medium text-[#4b5563]">تاريخ التسجيل</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map((submission) => (
                    <tr key={submission.id} className="border-b border-[#f3f4f6] hover:bg-[#f9fafb]">
                      <td className="p-3">
                        <Button size="sm" variant="outline">
                          تفاصيل
                        </Button>
                      </td>
                      <td className="p-3">
                        <Badge className="bg-green-100 text-green-800">
                          {submission.orderStage || "قيد المتابعة"}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm text-[#111827]">{submission.contactNumber}</td>
                      <td className="p-3 text-sm text-[#111827]">{submission.email}</td>
                      <td className="p-3 text-sm text-[#111827]">{submission.cityOfResidence}</td>
                      <td className="p-3 text-sm text-[#111827]">{submission.countryOfResidence}</td>
                      <td className="p-3 text-sm font-medium text-[#111827]">{submission.fullName}</td>
                      <td className="p-3 text-sm text-[#4b5563]">
                        {new Date(submission.submittedAt).toLocaleDateString('ar-SA')}
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
