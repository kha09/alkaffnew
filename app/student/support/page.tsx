"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  Send,
  Search,
} from "lucide-react"

import { useState } from "react";

const faqs = [
  {
    id: 1,
    question: "كم يستغرق وقت معالجة الطلب؟",
    answer: "عادة ما تستغرق معالجة الطلب من 2-4 أسابيع حسب الجامعة والبرنامج المختار. سنقوم بإبلاغك بأي تحديثات على حالة طلبك.",
    category: "application"
  },
  {
    id: 2,
    question: "هل أحتاج إلى اختبار إجادة اللغة الإنجليزية؟",
    answer: "معظم البرامج تتطلب درجات IELTS أو TOEFL، لكن بعض الجامعات تقدم قبولاً مشروطاً مع دورات اللغة الإنجليزية.",
    category: "requirements"
  },
  {
    id: 3,
    question: "كيف يمكنني تتبع حالة طلبي؟",
    answer: "يمكنك تتبع حالة طلبك من خلال صفحة 'إدارة الطلبات' في لوحة التحكم الخاصة بك. ستتلقى أيضاً إشعارات عبر البريد الإلكتروني عند تحديث الحالة.",
    category: "tracking"
  },
  {
    id: 4,
    question: "ما هي طرق الدفع المتاحة؟",
    answer: "نقبل التحويلات البنكية والدفع الإلكتروني. ستتلقى تفاصيل الدفع بعد قبول طلبك الأولي.",
    category: "payment"
  },
  {
    id: 5,
    question: "هل يمكنني تعديل معلومات طلبي بعد التقديم؟",
    answer: "يمكنك تعديل معلوماتك الشخصية عندما يكون الطلب قيد المراجعة أو تحت المراجعة. بعد الموافقة، لا يمكن إجراء تعديلات.",
    category: "application"
  },
  {
    id: 6,
    question: "ماذا أفعل إذا تم رفض طلبي؟",
    answer: "في حالة الرفض، يمكنك التواصل معنا لمعرفة الأسباب والحصول على المشورة حول تحسين طلبك أو التقديم لبرامج أخرى مناسبة.",
    category: "application"
  }
];

export default function StudentSupport() {
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [priority, setPriority] = useState("medium");

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = async () => {
    if (!subject.trim() || !message.trim()) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    try {
      // In a real implementation, you would send this to an API
      console.log("Sending support message:", { subject, message, priority });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert("تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.");
      setMessage("");
      setSubject("");
      setPriority("medium");
    } catch (error) {
      alert("حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.");
    }
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#111827]">مركز الدعم</h1>
        <p className="text-[#4b5563] mt-1">نحن هنا لمساعدتك في أي استفسار أو مشكلة</p>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <MessageCircle className="w-12 h-12 text-[#374151] mx-auto mb-4" />
            <h3 className="font-semibold mb-2">محادثة مباشرة</h3>
            <p className="text-sm text-gray-600 mb-4">تواصل معنا مباشرة للحصول على مساعدة فورية</p>
            <Button className="bg-[#374151] hover:bg-[#4b5563]">
              بدء المحادثة
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Mail className="w-12 h-12 text-[#374151] mx-auto mb-4" />
            <h3 className="font-semibold mb-2">البريد الإلكتروني</h3>
            <p className="text-sm text-gray-600 mb-4">أرسل لنا رسالة وسنرد عليك خلال 24 ساعة</p>
            <Button variant="outline">
              support@smalkaff.com
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Phone className="w-12 h-12 text-[#374151] mx-auto mb-4" />
            <h3 className="font-semibold mb-2">الهاتف</h3>
            <p className="text-sm text-gray-600 mb-4">اتصل بنا مباشرة خلال ساعات العمل</p>
            <Button variant="outline">
              +966 50 123 4567
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Send Message */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            إرسال رسالة دعم
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">موضوع الرسالة *</label>
              <Input 
                placeholder="اكتب موضوع رسالتك..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">الأولوية</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">منخفضة</option>
                <option value="medium">متوسطة</option>
                <option value="high">عالية</option>
                <option value="urgent">عاجلة</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">الرسالة *</label>
            <Textarea 
              placeholder="اكتب رسالتك بالتفصيل..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleSendMessage}
              className="bg-[#374151] hover:bg-[#4b5563]"
            >
              <Send className="w-4 h-4 ml-1" />
              إرسال الرسالة
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setMessage("");
                setSubject("");
                setPriority("medium");
              }}
            >
              مسح الحقول
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            الأسئلة الشائعة
          </CardTitle>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="ابحث في الأسئلة الشائعة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {filteredFaqs.map((faq) => (
              <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                <AccordionTrigger className="text-right">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          {filteredFaqs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              لم يتم العثور على أسئلة تطابق بحثك. جرب كلمات مختلفة أو تواصل معنا مباشرة.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Support Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            إرشادات الدعم
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">ساعات العمل:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• الأحد - الخميس: 9:00 ص - 6:00 م</li>
              <li>• الجمعة - السبت: 10:00 ص - 4:00 م</li>
              <li>• نستجيب للرسائل الإلكترونية خلال 24 ساعة</li>
            </ul>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">نصائح للحصول على أفضل دعم:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• اذكر رقم طلبك إذا كان لديك استفسار محدد</li>
              <li>• كن واضحاً ومفصلاً في وصف مشكلتك</li>
              <li>• أرفق لقطات شاشة إذا كانت مفيدة</li>
              <li>• تحقق من الأسئلة الشائعة أولاً</li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">أولوية الرسائل:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• <strong>عاجلة:</strong> مشاكل تقنية تمنع الوصول للحساب</li>
              <li>• <strong>عالية:</strong> مشاكل في الطلبات أو المدفوعات</li>
              <li>• <strong>متوسطة:</strong> استفسارات عامة حول الخدمات</li>
              <li>• <strong>منخفضة:</strong> اقتراحات أو تحسينات</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
