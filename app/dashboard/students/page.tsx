"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, Plus, Download, Filter, Eye, Edit, Trash2, Send, Key, User } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

// Types
type Agent = {
  id: number
  name: string
  email: string
  phone?: string
  createdAt: string
  updatedAt: string
}

type User = {
  id: number
  username: string
  email: string
  fullName: string
  role: string
  createdAt: string
  updatedAt: string
}

type UploadedFile = {
  id: number
  filename: string
  originalName: string
  path: string
  size: number
  type: string
  uploadedAt: string
}

type FormSubmission = {
  id: number
  fullName: string
  nationality: string
  email: string
  countryOfResidence: string
  contactNumber: string
  cityOfResidence: string
  preferredProgram: string
  universityId: number | null
  programId: number | null
  submittedAt: string
  agentId: number | null
  orderStage: string
  userId: number | null
  agent: Agent | null
  user: User | null
  uploadedFiles: UploadedFile[]
}

// Mock data for order stages
const orderStages = [
  { value: "New", label: "جديد" },
  { value: "In Progress", label: "قيد المعالجة" },
  { value: "Completed", label: "مكتمل" },
  { value: "Cancelled", label: "ملغي" },
]

export default function StudentsPage() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAgent, setSelectedAgent] = useState("")
  const [selectedOrderStage, setSelectedOrderStage] = useState("")
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null)
  const [emailSubject, setEmailSubject] = useState("")
  const [emailMessage, setEmailMessage] = useState("")

  useEffect(() => {
    fetchSubmissions()
    fetchAgents()
  }, [])

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/form-submissions')
      const data = await response.json()
      setSubmissions(data.submissions)
    } catch (error) {
      console.error('Error fetching submissions:', error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب الطلبات",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/admin/agents')
      const data = await response.json()
      setAgents(data.agents)
    } catch (error) {
      console.error('Error fetching agents:', error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب الوكلاء",
        variant: "destructive",
      })
    }
  }

  const handleAssignAgent = async (submissionId: number, agentId: string) => {
    try {
      const response = await fetch(`/api/admin/form-submissions/${submissionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          agentId: agentId === "unassigned" ? null : parseInt(agentId)
        })
      })
      
      if (response.ok) {
        const updatedSubmission = await response.json()
        setSubmissions(submissions.map(sub => 
          sub.id === submissionId ? updatedSubmission : sub
        ))
        toast({
          title: "نجاح",
          description: "تم تعيين الوكيل بنجاح",
        })
      } else {
        throw new Error('Failed to update submission')
      }
    } catch (error) {
      console.error('Error assigning agent:', error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تعيين الوكيل",
        variant: "destructive",
      })
    }
  }

  const handleUpdateOrderStage = async (submissionId: number, stage: string) => {
    try {
      const response = await fetch(`/api/admin/form-submissions/${submissionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStage: stage })
      })
      
      if (response.ok) {
        const updatedSubmission = await response.json()
        setSubmissions(submissions.map(sub => 
          sub.id === submissionId ? updatedSubmission : sub
        ))
        toast({
          title: "نجاح",
          description: "تم تحديث حالة الطلب بنجاح",
        })
      } else {
        throw new Error('Failed to update submission')
      }
    } catch (error) {
      console.error('Error updating order stage:', error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث حالة الطلب",
        variant: "destructive",
      })
    }
  }

  const handleGenerateUser = async (submissionId: number) => {
    try {
      const response = await fetch('/api/admin/form-submissions/generate-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId })
      })
      
      if (response.ok) {
        const data = await response.json()
        // Refresh submissions to get updated data
        fetchSubmissions()
        toast({
          title: "نجاح",
          description: `تم إنشاء المستخدم بنجاح. اسم المستخدم: ${data.username}, كلمة المرور: ${data.password}`,
        })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate user')
      }
    } catch (error: any) {
      console.error('Error generating user:', error)
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء إنشاء المستخدم",
        variant: "destructive",
      })
    }
  }

  const handleSendEmail = async () => {
    if (!selectedSubmission || !emailSubject || !emailMessage) return

    try {
      const response = await fetch('/api/admin/form-submissions/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          submissionId: selectedSubmission.id,
          subject: emailSubject,
          message: emailMessage
        })
      })
      
      if (response.ok) {
        setIsEmailDialogOpen(false)
        setEmailSubject("")
        setEmailMessage("")
        setSelectedSubmission(null)
        toast({
          title: "نجاح",
          description: "تم إرسال البريد الإلكتروني بنجاح",
        })
      } else {
        throw new Error('Failed to send email')
      }
    } catch (error) {
      console.error('Error sending email:', error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال البريد الإلكتروني",
        variant: "destructive",
      })
    }
  }

  const openEmailDialog = (submission: FormSubmission) => {
    setSelectedSubmission(submission)
    setIsEmailDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#111827]">إدارة الطلاب</h1>
            <p className="text-[#4b5563] mt-1">إدارة جميع طلبات الطلاب</p>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#111827]"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#111827]">إدارة الطلاب</h1>
          <p className="text-[#4b5563] mt-1">إدارة جميع طلبات الطلاب</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 ml-2" />
            تصدير
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#4b5563]">إجمالي الطلبات</p>
                <p className="text-2xl font-bold text-[#111827]">{submissions.length}</p>
              </div>
              <User className="w-8 h-8 text-[#4b5563]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#4b5563]">قيد المعالجة</p>
                <p className="text-2xl font-bold text-[#f59e0b]">
                  {submissions.filter(s => s.orderStage === "In Progress").length}
                </p>
              </div>
              <Filter className="w-8 h-8 text-[#f59e0b]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#4b5563]">مكتملة</p>
                <p className="text-2xl font-bold text-[#10b981]">
                  {submissions.filter(s => s.orderStage === "Completed").length}
                </p>
              </div>
              <Key className="w-8 h-8 text-[#10b981]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#4b5563]">ملغية</p>
                <p className="text-2xl font-bold text-[#ef4444]">
                  {submissions.filter(s => s.orderStage === "Cancelled").length}
                </p>
              </div>
              <Trash2 className="w-8 h-8 text-[#ef4444]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4b5563] w-4 h-4" />
              <Input 
                placeholder="البحث في الطلبات..." 
                className="pr-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="الوكيل" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الوكلاء</SelectItem>
                {agents.map(agent => (
                  <SelectItem key={agent.id} value={agent.id.toString()}>{agent.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedOrderStage} onValueChange={setSelectedOrderStage}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="حالة الطلب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                {orderStages.map(stage => (
                  <SelectItem key={stage.value} value={stage.value}>{stage.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 ml-2" />
              فلترة
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الطلبات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e7eb]">
                  <th className="text-right p-3 text-sm font-medium text-[#4b5563]">الإجراءات</th>
                  <th className="text-right p-3 text-sm font-medium text-[#4b5563]">الوكيل</th>
                  <th className="text-right p-3 text-sm font-medium text-[#4b5563]">حالة الطلب</th>
                  <th className="text-right p-3 text-sm font-medium text-[#4b5563]">التخصص المفضل</th>
                  <th className="text-right p-3 text-sm font-medium text-[#4b5563]">رقم الاتصال</th>
                  <th className="text-right p-3 text-sm font-medium text-[#4b5563]">البريد الإلكتروني</th>
                  <th className="text-right p-3 text-sm font-medium text-[#4b5563]">الاسم الكامل</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr key={submission.id} className="border-b border-[#f3f4f6] hover:bg-[#f9fafb]">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => openEmailDialog(submission)}
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleGenerateUser(submission.id)}
                          disabled={!!submission.user}
                        >
                          <Key className="w-4 h-4" />
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>تعديل الطلب</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>تعيين وكيل</Label>
                                <Select 
                                  value={submission.agent?.id?.toString() || ""} 
                                  onValueChange={(value) => handleAssignAgent(submission.id, value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="اختر وكيل" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="unassigned">غير محدد</SelectItem>
                                    {agents.map(agent => (
                                      <SelectItem key={agent.id} value={agent.id.toString()}>{agent.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>حالة الطلب</Label>
                                <Select 
                                  value={submission.orderStage} 
                                  onValueChange={(value) => handleUpdateOrderStage(submission.id, value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {orderStages.map(stage => (
                                      <SelectItem key={stage.value} value={stage.value}>{stage.label}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </td>
                    <td className="p-3">
                      {submission.agent ? (
                        <Badge className="bg-blue-100 text-blue-800">{submission.agent.name}</Badge>
                      ) : (
                        <Badge variant="outline">غير محدد</Badge>
                      )}
                    </td>
                    <td className="p-3">
                      <Badge 
                        className={
                          submission.orderStage === "Completed" ? "bg-green-100 text-green-800" :
                          submission.orderStage === "In Progress" ? "bg-yellow-100 text-yellow-800" :
                          submission.orderStage === "Cancelled" ? "bg-red-100 text-red-800" :
                          "bg-gray-100 text-gray-800"
                        }
                      >
                        {orderStages.find(s => s.value === submission.orderStage)?.label || submission.orderStage}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm text-[#111827]">{submission.preferredProgram}</td>
                    <td className="p-3 text-sm text-[#111827]">{submission.contactNumber}</td>
                    <td className="p-3 text-sm text-[#111827]">{submission.email}</td>
                    <td className="p-3 text-sm font-medium text-[#111827]">{submission.fullName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Email Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إرسال بريد إلكتروني</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div>
                <Label>إلى</Label>
                <Input value={selectedSubmission.email} disabled />
              </div>
              <div>
                <Label>الموضوع</Label>
                <Input 
                  value={emailSubject} 
                  onChange={(e) => setEmailSubject(e.target.value)} 
                  placeholder="موضوع البريد الإلكتروني"
                />
              </div>
              <div>
                <Label>الرسالة</Label>
                <Textarea 
                  value={emailMessage} 
                  onChange={(e) => setEmailMessage(e.target.value)} 
                  placeholder="محتوى البريد الإلكتروني"
                  rows={5}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleSendEmail}>
                  إرسال
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
