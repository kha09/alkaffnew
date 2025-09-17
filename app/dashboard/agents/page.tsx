"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Plus,
  Download,
  Filter,
  Eye,
  Edit,
  Trash2,
  Users,
  DollarSign,
  TrendingUp,
  Phone,
  Mail,
  MapPin,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// Types
type Agent = {
  id: number
  name: string
  email: string
  phone: string | null
  createdAt: string
  updatedAt: string
  submissions?: any[] // We'll add proper typing later
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentAgent, setCurrentAgent] = useState<Agent | null>(null)
  const [agentName, setAgentName] = useState("")
  const [agentEmail, setAgentEmail] = useState("")
  const [agentPhone, setAgentPhone] = useState("")

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    try {
      setLoading(true)
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
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAgent = () => {
    setCurrentAgent(null)
    setAgentName("")
    setAgentEmail("")
    setAgentPhone("")
    setIsDialogOpen(true)
  }

  const handleEditAgent = (agent: Agent) => {
    setCurrentAgent(agent)
    setAgentName(agent.name)
    setAgentEmail(agent.email)
    setAgentPhone(agent.phone || "")
    setIsDialogOpen(true)
  }

  const handleSaveAgent = async () => {
    try {
      const agentData = {
        name: agentName,
        email: agentEmail,
        phone: agentPhone || null
      }

      if (currentAgent) {
        // Update existing agent
        const response = await fetch(`/api/admin/agents/${currentAgent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(agentData)
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error)
        }

        toast({
          title: "نجاح",
          description: "تم تحديث الوكيل بنجاح",
        })
      } else {
        // Create new agent
        const response = await fetch('/api/admin/agents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(agentData)
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error)
        }

        toast({
          title: "نجاح",
          description: "تم إنشاء الوكيل بنجاح",
        })
      }

      setIsDialogOpen(false)
      fetchAgents() // Refresh the agents list
    } catch (error: any) {
      console.error('Error saving agent:', error)
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء حفظ الوكيل",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAgent = async (agentId: number) => {
    try {
      const response = await fetch(`/api/admin/agents/${agentId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error)
      }

      toast({
        title: "نجاح",
        description: "تم حذف الوكيل بنجاح",
      })

      fetchAgents() // Refresh the agents list
    } catch (error: any) {
      console.error('Error deleting agent:', error)
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء حذف الوكيل",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6" dir="rtl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#111827]">إدارة الوكلاء</h1>
            <p className="text-[#4b5563] mt-1">إدارة الوكلاء والمندوبين</p>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#111827]"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#111827]">إدارة الوكلاء</h1>
          <p className="text-[#4b5563] mt-1">إدارة الوكلاء والمندوبين</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 ml-2" />
            تصدير
          </Button>
          <Button className="bg-[#111827] hover:bg-[#374151]" onClick={handleCreateAgent}>
            <Plus className="w-4 h-4 ml-2" />
            وكيل جديد
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#4b5563]">إجمالي الوكلاء</p>
                <p className="text-2xl font-bold text-[#111827]">{agents.length}</p>
              </div>
              <Users className="w-8 h-8 text-[#4b5563]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#4b5563]">وكلاء نشطون</p>
                <p className="text-2xl font-bold text-[#10b981]">{agents.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-[#10b981]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#4b5563]">إجمالي العمولات</p>
                <p className="text-2xl font-bold text-[#111827]">0$</p>
              </div>
              <DollarSign className="w-8 h-8 text-[#4b5563]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#4b5563]">متوسط الأداء</p>
                <p className="text-2xl font-bold text-[#111827]">0%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-[#4b5563]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agents Grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>قائمة الوكلاء</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4b5563] w-4 h-4" />
                <Input 
                  placeholder="البحث في الوكلاء..." 
                  className="pr-10 w-64" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الوكلاء</SelectItem>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="inactive">غير نشط</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 ml-2" />
                فلترة
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <Card key={agent.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40" />
                        <AvatarFallback>
                          {agent.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-[#111827]">{agent.name}</h3>
                        <p className="text-sm text-[#4b5563]">وكيل</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      نشط
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-[#4b5563]">
                      <Phone className="w-4 h-4" />
                      <span>{agent.phone || "غير متوفر"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#4b5563]">
                      <Mail className="w-4 h-4" />
                      <span>{agent.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#4b5563]">
                      <MapPin className="w-4 h-4" />
                      <span>غير محدد</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-[#f9fafb] rounded-lg">
                      <p className="text-sm text-[#4b5563]">المبيعات</p>
                      <p className="font-semibold text-[#111827]">0$</p>
                    </div>
                    <div className="text-center p-3 bg-[#f9fafb] rounded-lg">
                      <p className="text-sm text-[#4b5563]">الطلبات</p>
                      <p className="font-semibold text-[#111827]">0</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Eye className="w-4 h-4 ml-2" />
                      عرض
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditAgent(agent)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700 bg-transparent"
                      onClick={() => handleDeleteAgent(agent.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Agent Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentAgent ? "تعديل وكيل" : "وكيل جديد"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="agentName">الاسم</Label>
              <Input 
                id="agentName" 
                value={agentName} 
                onChange={(e) => setAgentName(e.target.value)} 
                placeholder="اسم الوكيل"
              />
            </div>
            <div>
              <Label htmlFor="agentEmail">البريد الإلكتروني</Label>
              <Input 
                id="agentEmail" 
                type="email" 
                value={agentEmail} 
                onChange={(e) => setAgentEmail(e.target.value)} 
                placeholder="البريد الإلكتروني"
              />
            </div>
            <div>
              <Label htmlFor="agentPhone">رقم الهاتف</Label>
              <Input 
                id="agentPhone" 
                value={agentPhone} 
                onChange={(e) => setAgentPhone(e.target.value)} 
                placeholder="رقم الهاتف"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSaveAgent}>
                حفظ
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
