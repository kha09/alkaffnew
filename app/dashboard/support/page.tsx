"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Ticket,
  MessageSquare,
  User,
  Calendar,
  Search,
  Filter,
  Eye,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  Settings
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

// Types
type SupportTicket = {
  id: number
  title: string
  description: string
  status: string
  priority: string
  category: string
  createdAt: string
  updatedAt: string
  createdBy: {
    id: number
    fullName: string
    email: string
    role: string
  }
  assignedTo?: {
    id: number
    fullName: string
    email: string
    role: string
  }
  messages?: TicketMessage[]
  _count: {
    messages: number
  }
}

type TicketMessage = {
  id: number
  message: string
  isInternal: boolean
  createdAt: string
  sender: {
    id: number
    fullName: string
    email: string
    role: string
  }
}

type Agent = {
  id: number
  name: string
  email: string
}

const statusOptions = [
  { value: 'open', label: 'مفتوح', color: 'bg-blue-100 text-blue-800', icon: Clock },
  { value: 'in_progress', label: 'قيد المعالجة', color: 'bg-yellow-100 text-yellow-800', icon: Settings },
  { value: 'resolved', label: 'تم الحل', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  { value: 'closed', label: 'مغلق', color: 'bg-gray-100 text-gray-800', icon: XCircle }
]

const priorityOptions = [
  { value: 'low', label: 'منخفض', color: 'bg-gray-100 text-gray-800' },
  { value: 'medium', label: 'متوسط', color: 'bg-blue-100 text-blue-800' },
  { value: 'high', label: 'عالي', color: 'bg-orange-100 text-orange-800' },
  { value: 'urgent', label: 'عاجل', color: 'bg-red-100 text-red-800' }
]

const categoryOptions = [
  { value: 'technical', label: 'تقني' },
  { value: 'billing', label: 'فواتير' },
  { value: 'account', label: 'حساب' },
  { value: 'general', label: 'عام' }
]

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  
  // Ticket detail dialog
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [ticketMessages, setTicketMessages] = useState<TicketMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isInternalMessage, setIsInternalMessage] = useState(false)

  useEffect(() => {
    fetchTickets()
    fetchAgents()
  }, [])

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/support/tickets')
      
      if (!response.ok) {
        throw new Error('فشل في جلب التذاكر')
      }
      
      const data = await response.json()
      setTickets(data.tickets || [])
    } catch (error: any) {
      console.error('Error fetching tickets:', error)
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء جلب التذاكر",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/admin/agents')
      
      if (!response.ok) {
        throw new Error('فشل في جلب الوكلاء')
      }
      
      const data = await response.json()
      setAgents(data.agents || [])
    } catch (error: any) {
      console.error('Error fetching agents:', error)
    }
  }

  const fetchTicketDetails = async (ticketId: number) => {
    try {
      const response = await fetch(`/api/support/tickets/${ticketId}`)
      
      if (!response.ok) {
        throw new Error('فشل في جلب تفاصيل التذكرة')
      }
      
      const ticket = await response.json()
      setSelectedTicket(ticket)
      setTicketMessages(ticket.messages || [])
      setIsDetailDialogOpen(true)
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء جلب تفاصيل التذكرة",
        variant: "destructive",
      })
    }
  }

  const updateTicket = async (ticketId: number, updates: any) => {
    try {
      const response = await fetch(`/api/support/tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('فشل في تحديث التذكرة')
      }

      const updatedTicket = await response.json()
      
      // Update tickets list
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId ? { ...ticket, ...updatedTicket } : ticket
      ))
      
      // Update selected ticket if it's the same one
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket(prev => prev ? { ...prev, ...updatedTicket } : null)
      }
      
      toast({
        title: "تم",
        description: "تم تحديث التذكرة بنجاح",
      })
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء تحديث التذكرة",
        variant: "destructive",
      })
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return

    try {
      const response = await fetch(`/api/support/tickets/${selectedTicket.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newMessage.trim(),
          isInternal: isInternalMessage
        }),
      })

      if (!response.ok) {
        throw new Error('فشل في إرسال الرسالة')
      }

      const message = await response.json()
      setTicketMessages(prev => [...prev, message])
      setNewMessage('')
      setIsInternalMessage(false)
      
      toast({
        title: "تم",
        description: "تم إرسال الرسالة بنجاح",
      })
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء إرسال الرسالة",
        variant: "destructive",
      })
    }
  }

  const getStatusInfo = (status: string) => {
    return statusOptions.find(s => s.value === status) || statusOptions[0]
  }

  const getPriorityInfo = (priority: string) => {
    return priorityOptions.find(p => p.value === priority) || priorityOptions[1]
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.createdBy.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter
    const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory
  })

  // Statistics
  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    urgent: tickets.filter(t => t.priority === 'urgent').length
  }

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#111827]">إدارة تذاكر الدعم</h1>
        <p className="text-[#4b5563] mt-1">إدارة ومتابعة جميع تذاكر الدعم الفني</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Ticket className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-[#111827]">{stats.total}</div>
            <div className="text-sm text-[#4b5563]">إجمالي التذاكر</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{stats.open}</div>
            <div className="text-sm text-[#4b5563]">مفتوحة</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Settings className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
            <div className="text-sm text-[#4b5563]">قيد المعالجة</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            <div className="text-sm text-[#4b5563]">تم الحل</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">{stats.urgent}</div>
            <div className="text-sm text-[#4b5563]">عاجلة</div>
          </CardContent>
        </Card>
      </div>

      {/* Tickets Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="w-5 h-5" />
            تذاكر الدعم ({filteredTickets.length})
          </CardTitle>
          
          {/* Filters */}
          <div className="flex gap-4 items-center flex-wrap">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="البحث في التذاكر..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="الأولوية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأولويات</SelectItem>
                {priorityOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="الفئة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفئات</SelectItem>
                {categoryOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#111827]"></div>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Ticket className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>لا توجد تذاكر تطابق المعايير المحددة</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTickets.map((ticket) => {
                const statusInfo = getStatusInfo(ticket.status)
                const priorityInfo = getPriorityInfo(ticket.priority)
                const StatusIcon = statusInfo.icon
                
                return (
                  <div key={ticket.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-[#111827]">#{ticket.id} - {ticket.title}</h3>
                          <Badge className={statusInfo.color}>
                            <StatusIcon className="w-3 h-3 ml-1" />
                            {statusInfo.label}
                          </Badge>
                          <Badge className={priorityInfo.color}>
                            {priorityInfo.label}
                          </Badge>
                          <Badge variant="outline">
                            {categoryOptions.find(c => c.value === ticket.category)?.label}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {ticket.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>بواسطة: {ticket.createdBy.fullName}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(ticket.createdAt).toLocaleDateString('ar-SA')}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            <span>{ticket._count.messages} رسالة</span>
                          </div>
                          
                          {ticket.assignedTo && (
                            <div className="flex items-center gap-1">
                              <UserCheck className="w-3 h-3" />
                              <span>مُعيّن إلى: {ticket.assignedTo.fullName}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* Quick Status Update */}
                        <Select 
                          value={ticket.status} 
                          onValueChange={(value) => updateTicket(ticket.id, { status: value })}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        {/* Assign Agent */}
                        <Select 
                          value={ticket.assignedTo?.id?.toString() || "unassigned"} 
                          onValueChange={(value) => updateTicket(ticket.id, { assignedToId: value === "unassigned" ? null : parseInt(value) })}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="تعيين وكيل" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unassigned">بدون تعيين</SelectItem>
                            {agents.map(agent => (
                              <SelectItem key={agent.id} value={agent.id.toString()}>
                                {agent.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fetchTicketDetails(ticket.id)}
                        >
                          <Eye className="w-4 h-4 ml-1" />
                          عرض
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ticket Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" dir="rtl">
          {selectedTicket && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Ticket className="w-5 h-5" />
                  تذكرة #{selectedTicket.id} - {selectedTicket.title}
                </DialogTitle>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusInfo(selectedTicket.status).color}>
                    {getStatusInfo(selectedTicket.status).label}
                  </Badge>
                  <Badge className={getPriorityInfo(selectedTicket.priority).color}>
                    {getPriorityInfo(selectedTicket.priority).label}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    تم الإنشاء في {new Date(selectedTicket.createdAt).toLocaleDateString('ar-SA')}
                  </span>
                </div>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Ticket Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">معلومات التذكرة:</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>المُنشئ:</strong> {selectedTicket.createdBy.fullName}</div>
                      <div><strong>البريد الإلكتروني:</strong> {selectedTicket.createdBy.email}</div>
                      <div><strong>الفئة:</strong> {categoryOptions.find(c => c.value === selectedTicket.category)?.label}</div>
                      {selectedTicket.assignedTo && (
                        <div><strong>مُعيّن إلى:</strong> {selectedTicket.assignedTo.fullName}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">وصف المشكلة:</h4>
                    <p className="text-gray-700 text-sm">{selectedTicket.description}</p>
                  </div>
                </div>
                
                {/* Messages */}
                <div className="space-y-4">
                  <h4 className="font-medium">المحادثة:</h4>
                  <div className="max-h-60 overflow-y-auto space-y-3">
                    {ticketMessages.map((message) => (
                      <div key={message.id} className={`border rounded-lg p-3 ${message.isInternal ? 'bg-yellow-50 border-yellow-200' : ''}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-sm">{message.sender.fullName}</span>
                          <Badge variant="outline" className="text-xs">
                            {message.sender.role === 'admin' ? 'إدارة' : 
                             message.sender.role === 'agent' ? 'وكيل' : 'طالب'}
                          </Badge>
                          {message.isInternal && (
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                              ملاحظة داخلية
                            </Badge>
                          )}
                          <span className="text-xs text-gray-500">
                            {new Date(message.createdAt).toLocaleString('ar-SA')}
                          </span>
                        </div>
                        <p className="text-gray-700">{message.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Send Message */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">إضافة رسالة:</label>
                  <Textarea
                    placeholder="اكتب رسالتك هنا..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows={3}
                  />
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={isInternalMessage}
                        onChange={(e) => setIsInternalMessage(e.target.checked)}
                      />
                      ملاحظة داخلية (مرئية للإدارة والوكلاء فقط)
                    </label>
                    <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                      <Send className="w-4 h-4 ml-1" />
                      إرسال الرسالة
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
