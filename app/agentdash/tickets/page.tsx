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
  Search,
  Plus,
  Ticket,
  Eye,
  MessageSquare,
  Calendar,
  User,
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

const statusOptions = [
  { value: 'open', label: 'مفتوح', color: 'bg-blue-100 text-blue-800' },
  { value: 'in_progress', label: 'قيد المعالجة', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'resolved', label: 'تم الحل', color: 'bg-green-100 text-green-800' },
  { value: 'closed', label: 'مغلق', color: 'bg-gray-100 text-gray-800' }
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
  { value: 'student_issue', label: 'مشكلة طالب' },
  { value: 'commission', label: 'عمولة' },
  { value: 'general', label: 'عام' }
]

export default function AgentTickets() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  
  // New ticket form
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'general'
  })

  // Ticket detail dialog
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [ticketMessages, setTicketMessages] = useState<TicketMessage[]>([])
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    fetchTickets()
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

  const createTicket = async () => {
    if (!newTicket.title.trim() || !newTicket.description.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTicket),
      })

      if (!response.ok) {
        throw new Error('فشل في إنشاء التذكرة')
      }

      const createdTicket = await response.json()
      setTickets(prev => [createdTicket, ...prev])
      setNewTicket({ title: '', description: '', priority: 'medium', category: 'general' })
      setIsCreateDialogOpen(false)
      
      toast({
        title: "تم",
        description: "تم إنشاء التذكرة بنجاح وإرسالها للإدارة",
      })
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء إنشاء التذكرة",
        variant: "destructive",
      })
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
          isInternal: false
        }),
      })

      if (!response.ok) {
        throw new Error('فشل في إرسال الرسالة')
      }

      const message = await response.json()
      setTicketMessages(prev => [...prev, message])
      setNewMessage('')
      
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
                         ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#111827]">تذاكر الدعم</h1>
          <p className="text-[#4b5563] mt-1">إدارة تذاكر الدعم والتواصل مع الإدارة</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#374151] hover:bg-[#4b5563]">
              <Plus className="w-4 h-4 ml-1" />
              تذكرة جديدة للإدارة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md" dir="rtl">
            <DialogHeader>
              <DialogTitle>إنشاء تذكرة دعم للإدارة</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">العنوان *</label>
                <Input
                  placeholder="عنوان التذكرة..."
                  value={newTicket.title}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">الأولوية</label>
                  <Select value={newTicket.priority} onValueChange={(value) => setNewTicket(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">الفئة</label>
                  <Select value={newTicket.category} onValueChange={(value) => setNewTicket(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">الوصف *</label>
                <Textarea
                  placeholder="اشرح مشكلتك أو استفسارك بالتفصيل..."
                  value={newTicket.description}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={createTicket} className="flex-1">
                  إرسال للإدارة
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  إلغاء
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tickets Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="w-5 h-5" />
            تذاكر الدعم ({tickets.length})
          </CardTitle>
          
          {/* Filters */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
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
              <p>لا توجد تذاكر دعم بعد</p>
              <p className="text-sm">انقر على "تذكرة جديدة للإدارة" لإنشاء أول تذكرة دعم</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTickets.map((ticket) => {
                const statusInfo = getStatusInfo(ticket.status)
                const priorityInfo = getPriorityInfo(ticket.priority)
                
                return (
                  <div key={ticket.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-[#111827]">#{ticket.id} - {ticket.title}</h3>
                          <Badge className={statusInfo.color}>
                            {statusInfo.label}
                          </Badge>
                          <Badge className={priorityInfo.color}>
                            {priorityInfo.label}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {ticket.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
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
                              <User className="w-3 h-3" />
                              <span>مُعيّن إلى: {ticket.assignedTo.fullName}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
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
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            معلومات التواصل مع الإدارة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium">البريد الإلكتروني:</span>
              <span>admin@alkaffpro.com</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">الهاتف:</span>
              <span>+966 12 345 6789</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            يمكنك إنشاء تذكرة دعم جديدة للتواصل مع الإدارة حول أي مشكلة أو استفسار. سيتم الرد عليك في أقرب وقت ممكن.
          </p>
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
                {/* Ticket Description */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">وصف المشكلة:</h4>
                  <p className="text-gray-700">{selectedTicket.description}</p>
                </div>
                
                {/* Messages */}
                <div className="space-y-4">
                  <h4 className="font-medium">المحادثة:</h4>
                  <div className="max-h-60 overflow-y-auto space-y-3">
                    {ticketMessages.map((message) => (
                      <div key={message.id} className="border rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-sm">{message.sender.fullName}</span>
                          <Badge variant="outline" className="text-xs">
                            {message.sender.role === 'admin' ? 'إدارة' : 
                             message.sender.role === 'agent' ? 'وكيل' : 'طالب'}
                          </Badge>
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
                {selectedTicket.status !== 'closed' && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">إضافة رسالة:</label>
                    <Textarea
                      placeholder="اكتب رسالتك هنا..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      rows={3}
                    />
                    <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                      <Send className="w-4 h-4 ml-1" />
                      إرسال الرسالة
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
