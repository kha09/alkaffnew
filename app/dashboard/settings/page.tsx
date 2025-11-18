import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { User, Bell, Shield, Palette, Database, Mail, Save } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#111827]">الإعدادات</h1>
          <p className="text-[#4b5563] mt-1">إدارة إعدادات النظام والحساب</p>
        </div>
        <Button className="bg-[#111827] hover:bg-[#374151]">
          <Save className="w-4 h-4 ml-2" />
          حفظ التغييرات
        </Button>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="profile">الملف الشخصي</TabsTrigger>
          <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
          <TabsTrigger value="security">الأمان</TabsTrigger>
          <TabsTrigger value="appearance">المظهر</TabsTrigger>
          <TabsTrigger value="system">النظام</TabsTrigger>
          <TabsTrigger value="email">البريد الإلكتروني</TabsTrigger>
          <TabsTrigger value="integrations">التكاملات</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  المعلومات الشخصية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">الاسم الأول</Label>
                    <Input id="firstName" defaultValue="أحمد" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">الاسم الأخير</Label>
                    <Input id="lastName" defaultValue="محمود" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input id="email" type="email" defaultValue="ahmed@example.com" />
                </div>
                <div>
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input id="phone" defaultValue="+966 50 123 4567" />
                </div>
                <div>
                  <Label htmlFor="position">المنصب</Label>
                  <Input id="position" defaultValue="مدير النظام" />
                </div>
                <div>
                  <Label htmlFor="bio">نبذة شخصية</Label>
                  <Textarea id="bio" placeholder="اكتب نبذة مختصرة عنك..." />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>صورة الملف الشخصي</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center w-32 h-32 bg-[#f3f4f6] rounded-full mx-auto">
                  <User className="w-16 h-16 text-[#4b5563]" />
                </div>
                <div className="text-center space-y-2">
                  <Button variant="outline">تغيير الصورة</Button>
                  <p className="text-sm text-[#4b5563]">JPG, PNG أو GIF (الحد الأقصى 2MB)</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                إعدادات الإشعارات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-[#111827]">إشعارات البريد الإلكتروني</h4>
                    <p className="text-sm text-[#4b5563]">تلقي إشعارات عبر البريد الإلكتروني</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-[#111827]">إشعارات الطلبات الجديدة</h4>
                    <p className="text-sm text-[#4b5563]">إشعار عند وصول طلبات جديدة</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-[#111827]">إشعارات المبيعات</h4>
                    <p className="text-sm text-[#4b5563]">إشعار عند إتمام عمليات البيع</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-[#111827]">التقارير الأسبوعية</h4>
                    <p className="text-sm text-[#4b5563]">تلقي تقارير أسبوعية عن الأداء</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-[#111827]">إشعارات النظام</h4>
                    <p className="text-sm text-[#4b5563]">إشعارات حول تحديثات النظام</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  تغيير كلمة المرور
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div>
                  <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button className="w-full">تحديث كلمة المرور</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>إعدادات الأمان</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-[#111827]">المصادقة الثنائية</h4>
                    <p className="text-sm text-[#4b5563]">حماية إضافية للحساب</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-[#111827]">تسجيل الدخول التلقائي</h4>
                    <p className="text-sm text-[#4b5563]">البقاء مسجلاً للدخول</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-[#111827]">إشعارات تسجيل الدخول</h4>
                    <p className="text-sm text-[#4b5563]">إشعار عند تسجيل دخول جديد</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appearance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                إعدادات المظهر
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="theme">المظهر</Label>
                <Select defaultValue="light">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">فاتح</SelectItem>
                    <SelectItem value="dark">داكن</SelectItem>
                    <SelectItem value="system">تلقائي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="language">اللغة</Label>
                <Select defaultValue="ar">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="timezone">المنطقة الزمنية</Label>
                <Select defaultValue="riyadh">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="riyadh">الرياض (GMT+3)</SelectItem>
                    <SelectItem value="dubai">دبي (GMT+4)</SelectItem>
                    <SelectItem value="cairo">القاهرة (GMT+2)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                إعدادات النظام
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-[#111827]">النسخ الاحتياطي التلقائي</h4>
                  <p className="text-sm text-[#4b5563]">نسخ احتياطي يومي للبيانات</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-[#111827]">التحديثات التلقائية</h4>
                  <p className="text-sm text-[#4b5563]">تحديث النظام تلقائياً</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-[#111827]">سجل النشاطات</h4>
                  <p className="text-sm text-[#4b5563]">حفظ سجل جميع العمليات</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  إعدادات SMTP
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="smtpHost">خادم SMTP</Label>
                  <Input id="smtpHost" placeholder="smtp.gmail.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtpPort">المنفذ</Label>
                    <Input id="smtpPort" type="number" placeholder="587" />
                  </div>
                  <div>
                    <Label htmlFor="smtpEncryption">التشفير</Label>
                    <Select defaultValue="tls">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tls">TLS</SelectItem>
                        <SelectItem value="ssl">SSL</SelectItem>
                        <SelectItem value="none">بدون تشفير</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="smtpUsername">اسم المستخدم</Label>
                  <Input id="smtpUsername" placeholder="your-email@gmail.com" />
                </div>
                <div>
                  <Label htmlFor="smtpPassword">كلمة المرور</Label>
                  <Input id="smtpPassword" type="password" placeholder="كلمة مرور التطبيق" />
                </div>
                <div>
                  <Label htmlFor="fromEmail">البريد المرسل</Label>
                  <Input id="fromEmail" placeholder="no-reply@smalkaff.com" />
                </div>
                <div>
                  <Label htmlFor="fromName">اسم المرسل</Label>
                  <Input id="fromName" defaultValue="SM Alkaff" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-[#111827]">تفعيل SMTP</h4>
                    <p className="text-sm text-[#4b5563]">تمكين إرسال البريد الإلكتروني</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Button className="w-full">حفظ إعدادات SMTP</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>اختبار البريد الإلكتروني</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="testEmail">البريد الإلكتروني للاختبار</Label>
                  <Input id="testEmail" type="email" placeholder="test@example.com" />
                </div>
                <Button variant="outline" className="w-full">إرسال بريد تجريبي</Button>
                
                <div className="mt-6 p-4 bg-[#f3f4f6] rounded-lg">
                  <h4 className="font-medium text-[#111827] mb-2">حالة الاتصال</h4>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-[#4b5563]">غير متصل</span>
                  </div>
                  <p className="text-xs text-[#4b5563] mt-1">لم يتم اختبار الإعدادات بعد</p>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium text-[#111827] mb-2">إعدادات شائعة</h4>
                  <div className="space-y-2 text-sm text-[#4b5563]">
                    <div>
                      <strong>Gmail:</strong> smtp.gmail.com:587 (TLS)
                    </div>
                    <div>
                      <strong>Outlook:</strong> smtp-mail.outlook.com:587 (TLS)
                    </div>
                    <div>
                      <strong>Yahoo:</strong> smtp.mail.yahoo.com:587 (TLS)
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                التكاملات الخارجية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium text-[#111827]">WhatsApp Business</h4>
                  <p className="text-sm text-[#4b5563]">إرسال الإشعارات عبر واتساب</p>
                </div>
                <Button variant="outline">ربط</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium text-[#111827]">SMS Gateway</h4>
                  <p className="text-sm text-[#4b5563]">إرسال الرسائل النصية</p>
                </div>
                <Button variant="outline">ربط</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium text-[#111827]">Payment Gateway</h4>
                  <p className="text-sm text-[#4b5563]">بوابة الدفع الإلكتروني</p>
                </div>
                <Button variant="outline">ربط</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
