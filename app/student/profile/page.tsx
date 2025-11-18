"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  Key,
  Shield,
} from "lucide-react"

import { useEffect, useState } from "react";

type StudentProfile = {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  nationality?: string;
  countryOfResidence?: string;
  cityOfResidence?: string;
  dateJoined: string;
  totalOrders: number;
  completedOrders: number;
};

export default function StudentProfile() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<StudentProfile>>({});

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError(null);
      try {
        // Mock profile data - in real implementation, fetch from API
        const mockProfile: StudentProfile = {
          id: 1,
          fullName: "علي حسن",
          email: "ali@example.com",
          phone: "+966 50 000 0000",
          nationality: "Saudi Arabia",
          countryOfResidence: "Saudi Arabia",
          cityOfResidence: "الرياض",
          dateJoined: "2025-01-15",
          totalOrders: 2,
          completedOrders: 1
        };
        
        setProfile(mockProfile);
        setEditedProfile(mockProfile);
      } catch (err: any) {
        setError(err.message || "حدث خطأ");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    if (!profile) return;
    
    try {
      // In real implementation, send to API
      console.log("Saving profile:", editedProfile);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfile({ ...profile, ...editedProfile });
      setIsEditing(false);
      alert("تم حفظ التغييرات بنجاح");
    } catch (error) {
      alert("حدث خطأ أثناء حفظ التغييرات");
    }
  };

  const handleCancelEdit = () => {
    setEditedProfile(profile || {});
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">جاري التحميل...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center text-red-600">{error || "حدث خطأ"}</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#111827]">الملف الشخصي</h1>
        <p className="text-[#4b5563] mt-1">إدارة معلوماتك الشخصية وإعدادات الحساب</p>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback className="text-2xl bg-[#374151] text-white">
                {profile.fullName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-[#111827]">{profile.fullName}</h2>
              <p className="text-[#4b5563] mb-2">{profile.email}</p>
              <div className="flex items-center gap-4 text-sm text-[#4b5563]">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>انضم في {profile.dateJoined}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="outline">{profile.totalOrders} طلب</Badge>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-[#10b981]">{profile.completedOrders}</div>
              <div className="text-sm text-[#4b5563]">طلب مكتمل</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              المعلومات الشخصية
            </CardTitle>
            {!isEditing ? (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="w-4 h-4 ml-1" />
                تعديل
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  size="sm"
                  onClick={handleSaveProfile}
                  className="bg-[#374151] hover:bg-[#4b5563]"
                >
                  <Save className="w-4 h-4 ml-1" />
                  حفظ
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleCancelEdit}
                >
                  <X className="w-4 h-4 ml-1" />
                  إلغاء
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">الاسم الكامل</label>
              {isEditing ? (
                <Input 
                  value={editedProfile.fullName || ''}
                  onChange={(e) => setEditedProfile({...editedProfile, fullName: e.target.value})}
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded">{profile.fullName}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
              {isEditing ? (
                <Input 
                  type="email"
                  value={editedProfile.email || ''}
                  onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {profile.email}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">رقم الهاتف</label>
              {isEditing ? (
                <Input 
                  value={editedProfile.phone || ''}
                  onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {profile.phone || 'غير محدد'}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">الجنسية</label>
              {isEditing ? (
                <Input 
                  value={editedProfile.nationality || ''}
                  onChange={(e) => setEditedProfile({...editedProfile, nationality: e.target.value})}
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded">{profile.nationality || 'غير محدد'}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">بلد الإقامة</label>
              {isEditing ? (
                <Input 
                  value={editedProfile.countryOfResidence || ''}
                  onChange={(e) => setEditedProfile({...editedProfile, countryOfResidence: e.target.value})}
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {profile.countryOfResidence || 'غير محدد'}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">مدينة الإقامة</label>
              {isEditing ? (
                <Input 
                  value={editedProfile.cityOfResidence || ''}
                  onChange={(e) => setEditedProfile({...editedProfile, cityOfResidence: e.target.value})}
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded">{profile.cityOfResidence || 'غير محدد'}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            أمان الحساب
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-[#4b5563]" />
              <div>
                <h4 className="font-medium">كلمة المرور</h4>
                <p className="text-sm text-[#4b5563]">آخر تغيير منذ 30 يوماً</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              تغيير كلمة المرور
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#4b5563]" />
              <div>
                <h4 className="font-medium">التحقق بخطوتين</h4>
                <p className="text-sm text-[#4b5563]">حماية إضافية لحسابك</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              تفعيل
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>إحصائيات الحساب</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{profile.totalOrders}</div>
              <div className="text-sm text-blue-800">إجمالي الطلبات</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{profile.completedOrders}</div>
              <div className="text-sm text-green-800">طلبات مكتملة</div>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{profile.totalOrders - profile.completedOrders}</div>
              <div className="text-sm text-yellow-800">طلبات قيد المعالجة</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">إعدادات الحساب</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">تصدير البيانات</h4>
            <p className="text-sm text-yellow-700 mb-3">
              احصل على نسخة من جميع بياناتك المحفوظة لدينا
            </p>
            <Button variant="outline" size="sm">
              تصدير البيانات
            </Button>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-medium text-red-800 mb-2">حذف الحساب</h4>
            <p className="text-sm text-red-700 mb-3">
              حذف حسابك نهائياً مع جميع البيانات المرتبطة به. هذا الإجراء لا يمكن التراجع عنه.
            </p>
            <Button variant="destructive" size="sm">
              حذف الحساب
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
