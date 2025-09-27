import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  UserPlus,
  FileText,
  Settings,
  Bell,
  ChevronDown,
  Download,
  Plus,
  AlertCircle,
  Clock,
  DollarSign,
} from "lucide-react"

export default function ArabicDashboard() {
  return (
    <div className="min-h-screen bg-[#f9fafb] rtl">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-[#1f2937] text-white min-h-screen fixed right-0 top-0">
          {/* Header */}
          <div className="p-4 border-b border-[#374151]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#374151] rounded-full flex items-center justify-center text-sm font-bold">
                SM
              </div>
              <div>
                <div className="font-semibold">الكافي</div>
                <div className="text-xs text-gray-400">وكيل</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#374151] text-white">
              <Users className="w-5 h-5" />
              <span>الطلاب المسجلين عبرك</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#374151] transition-colors">
              <UserPlus className="w-5 h-5" />
              <span>إدارة الطلاب</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#374151] transition-colors">
              <FileText className="w-5 h-5" />
              <span>متابعة الطلبات</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#374151] transition-colors">
              <Settings className="w-5 h-5" />
              <span>طلبات الأدميس</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#374151] transition-colors">
              <Bell className="w-5 h-5" />
              <span>تقديمات وتوصيات</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#374151] transition-colors">
              <DollarSign className="w-5 h-5" />
              <span>المدفوعات والمستحقات</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#374151] transition-colors">
              <Bell className="w-5 h-5" />
              <span>الإشعارات</span>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 mr-64">
          {/* Top Bar */}
          <div className="bg-[#1f2937] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span>وكيل</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-4">
              <Bell className="w-5 h-5" />
              <span>الإشعارات</span>
              <div className="text-sm">لوحة أدميل</div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Students Registration Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  الطلاب المسجلين عبرك
                </CardTitle>
                <Button className="bg-[#1f2937] hover:bg-[#374151]">إضافة طالب جديد</Button>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input placeholder="البحث عن الطلاب أو رقم الطلب..." className="max-w-md" />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right p-3 font-medium">الصورة</th>
                        <th className="text-right p-3 font-medium">اسم الطالب</th>
                        <th className="text-right p-3 font-medium">الحالة</th>
                        <th className="text-right p-3 font-medium">تاريخ التسجيل</th>
                        <th className="text-right p-3 font-medium">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        </td>
                        <td className="p-3">محمد الأمين</td>
                        <td className="p-3">
                          <Badge className="bg-green-100 text-green-800">قيد المتابعة</Badge>
                        </td>
                        <td className="p-3">2025-03-12</td>
                        <td className="p-3">
                          <Button size="sm" variant="outline">
                            تفاصيل
                          </Button>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        </td>
                        <td className="p-3">سارة ياسين</td>
                        <td className="p-3">
                          <Badge className="bg-blue-100 text-blue-800">مقبول</Badge>
                        </td>
                        <td className="p-3">2025-02-28</td>
                        <td className="p-3">
                          <Button size="sm" variant="outline">
                            تفاصيل
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Follow-up Requests */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  متابعة الطلبات
                </CardTitle>
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Download className="w-4 h-4" />
                  تحديث الحالة
                </Button>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex gap-4">
                  <Input placeholder="بحث برقم الطلب..." className="max-w-xs" />
                  <select className="px-3 py-2 border rounded-md">
                    <option>كل الحالات</option>
                    <option>قيد المراجعة</option>
                    <option>مقبول</option>
                    <option>مرفوض</option>
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right p-3 font-medium">رقم الطلب</th>
                        <th className="text-right p-3 font-medium">اسم الطالب</th>
                        <th className="text-right p-3 font-medium">الحالة</th>
                        <th className="text-right p-3 font-medium">تاريخ التقديم</th>
                        <th className="text-right p-3 font-medium">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-3">#2025-231</td>
                        <td className="p-3">محمد الأمين</td>
                        <td className="p-3">
                          <Badge className="bg-green-100 text-green-800">قيد المتابعة</Badge>
                        </td>
                        <td className="p-3">2025-03-12</td>
                        <td className="p-3">
                          <Button size="sm" variant="outline">
                            عرض
                          </Button>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3">#2025-211</td>
                        <td className="p-3">سارة ياسين</td>
                        <td className="p-3">
                          <Badge className="bg-blue-100 text-blue-800">مقبول</Badge>
                        </td>
                        <td className="p-3">2025-02-28</td>
                        <td className="p-3">
                          <Button size="sm" variant="outline">
                            عرض
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* University Requests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  طلبات خاصة من الأدميس
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">يجب الانتباه إلى وضع الشهادات الأصلية في الملف الخاص بالطالب</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm">تم تحديث نظام الشهادات الخاصة - في مراجعة سجلة المدفوعات</span>
                </div>
              </CardContent>
            </Card>

            {/* New Student Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  تقديم طالب جديد / رفع طلبات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Input placeholder="اسم الطالب" />
                  <Input placeholder="رقم الهوية" />
                  <Input placeholder="البريد الإلكتروني" />
                  <Input placeholder="رقم الجوال" />
                </div>
                <div className="mb-4">
                  <span className="text-sm text-gray-600">رفع طلبات الشهادات (اختياري)</span>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    منطقة رفع طلبات
                  </Button>
                  <Button className="bg-[#1f2937] hover:bg-[#374151]">رفع طلب</Button>
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full bg-transparent">
                    إرسال طلب
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Payments Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  المدفوعات والمستحقات
                </CardTitle>
                <Button variant="outline">تحديث</Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right p-3 font-medium">اسم الطالب</th>
                        <th className="text-right p-3 font-medium">المبلغ المستحق</th>
                        <th className="text-right p-3 font-medium">الحالة</th>
                        <th className="text-right p-3 font-medium">تاريخ الاستحقاق</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-3">سارة ياسين</td>
                        <td className="p-3">400$</td>
                        <td className="p-3">
                          <Badge className="bg-red-100 text-red-800">مطلوب</Badge>
                        </td>
                        <td className="p-3">2025-03-10</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3">محمد الأمين</td>
                        <td className="p-3">300$</td>
                        <td className="p-3">
                          <Badge className="bg-green-100 text-green-800">قيد المتابعة</Badge>
                        </td>
                        <td className="p-3">2025-03-25</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Payment History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  تتبع المدفوعات المستلمة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right p-3 font-medium">تاريخ الدفع</th>
                        <th className="text-right p-3 font-medium">المبلغ</th>
                        <th className="text-right p-3 font-medium">الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-3">2025-03-10</td>
                        <td className="p-3">400$</td>
                        <td className="p-3">
                          <Badge className="bg-green-100 text-green-800">مراجعة</Badge>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3">2025-03-01</td>
                        <td className="p-3">600$</td>
                        <td className="p-3">
                          <Badge className="bg-blue-100 text-blue-800">تسليم الدفعة</Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  الإشعارات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <span className="text-sm">حالة الطلبات</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
