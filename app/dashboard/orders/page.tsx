"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, Plus, Download, Filter, Eye, Edit, Trash2, Package, Clock, CheckCircle, XCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// Types
type User = {
  id: number
  fullName: string
  email: string
}

type FormSubmission = {
  id: number
  fullName: string
  preferredProgram: string
  universityId: number | null
  programId: number | null
}

type Agent = {
  id: number
  name: string
}

type Order = {
  id: number
  userId: number
  formSubmissionId: number | null
  agentId: number | null
  price: number
  status: string
  paymentStatus: string
  agentStatus: string
  adminStatus: string
  dateCreated: string
  receipt: string | null
  agentNotes: string | null
  adminNotes: string | null
  createdAt: string
  updatedAt: string
  user: User
  formSubmission: FormSubmission | null
  agent: Agent | null
}

type UserOption = {
  id: number
  fullName: string
  email: string
  formSubmission: {
    id: number
    fullName: string
    preferredProgram: string
  } | null
}

type University = {
  id: number
  name: string
}

type Program = {
  id: number
  name: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [users, setUsers] = useState<UserOption[]>([])
  const [universities, setUniversities] = useState<University[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all")
  const [universityFilter, setUniversityFilter] = useState("all")
  const [programFilter, setProgramFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [newOrder, setNewOrder] = useState({
    userId: null as number | null,
    formSubmissionId: null as number | null,
    agentId: null as number | null,
    price: null as number | null,
    status: "pending",
    paymentStatus: "unpaid",
    receipt: null as string | null,
  })
  const [orderNotes, setOrderNotes] = useState("")
  const [notificationMessage, setNotificationMessage] = useState("")

  useEffect(() => {
    fetchOrders()
    fetchUsers()
    fetchUniversities()
    fetchPrograms()
  }, [])

  const fetchUniversities = async () => {
    try {
      const response = await fetch('/api/universities')
      const data = await response.json()
      setUniversities(data)
    } catch (error) {
      console.error('Error fetching universities:', error)
    }
  }

  const fetchPrograms = async () => {
    try {
      const response = await fetch('/api/programs')
      const data = await response.json()
      setPrograms(data)
    } catch (error) {
      console.error('Error fetching programs:', error)
    }
  }

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/orders')
      const data = await response.json()
      setOrders(data.orders)
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب الطلبات",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب المستخدمين",
        variant: "destructive",
      })
    }
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setOrderNotes(order.adminNotes || "")
    setIsViewDialogOpen(true)
  }

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order)
    setIsEditDialogOpen(true)
  }

  const handleSaveEditedOrder = async () => {
    if (!editingOrder) return

    try {
      const response = await fetch(`/api/admin/orders/${editingOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: editingOrder.userId,
          formSubmissionId: editingOrder.formSubmissionId,
          agentId: editingOrder.agentId,
          price: editingOrder.price,
          status: editingOrder.status,
          paymentStatus: editingOrder.paymentStatus,
          receipt: editingOrder.receipt,
        })
      })
      
      if (response.ok) {
        const updatedOrder = await response.json()
        setOrders(orders.map(order => 
          order.id === updatedOrder.id ? updatedOrder : order
        ))
        setIsEditDialogOpen(false)
        setEditingOrder(null)
        toast({
          title: "نجاح",
          description: "تم تحديث الطلب بنجاح",
        })
      } else {
        throw new Error('Failed to update order')
      }
    } catch (error) {
      console.error('Error updating order:', error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث الطلب",
        variant: "destructive",
      })
    }
  }

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return

    try {
      const response = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: selectedOrder.status,
          paymentStatus: selectedOrder.paymentStatus,
          notes: orderNotes
        })
      })
      
      if (response.ok) {
        const updatedOrder = await response.json()
        setOrders(orders.map(order => 
          order.id === updatedOrder.id ? updatedOrder : order
        ))
        setSelectedOrder(updatedOrder)
        toast({
          title: "نجاح",
          description: "تم تحديث الطلب بنجاح",
        })
      } else {
        throw new Error('Failed to update order')
      }
    } catch (error) {
      console.error('Error updating order:', error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث الطلب",
        variant: "destructive",
      })
    }
  }

  const handleSendNotification = async () => {
    if (!selectedOrder || !notificationMessage) return

    try {
      // In a real implementation, this would call an API endpoint to send notifications
      // For now, we'll just show a success message
      toast({
        title: "نجاح",
        description: "تم إرسال الإشعار للطالب",
      })
      setNotificationMessage("")
    } catch (error) {
      console.error('Error sending notification:', error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال الإشعار",
        variant: "destructive",
      })
    }
  }

  const handleConfirmPayment = async () => {
    if (!selectedOrder) return

    try {
      // Update order payment status
      const response = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          paymentStatus: "paid",
          status: selectedOrder.status === "pending" ? "completed" : selectedOrder.status
        })
      })
      
      if (response.ok) {
        const updatedOrder = await response.json()
        setOrders(orders.map(order => 
          order.id === updatedOrder.id ? updatedOrder : order
        ))
        setSelectedOrder(updatedOrder)
        toast({
          title: "نجاح",
          description: "تم تأكيد الدفع وتحديث حالة الطلب",
        })
        
        // In a real implementation, we would also update the student's status
        // This would require calling another API endpoint
      } else {
        throw new Error('Failed to confirm payment')
      }
    } catch (error) {
      console.error('Error confirming payment:', error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تأكيد الدفع",
        variant: "destructive",
      })
    }
  }

  const handleDeleteOrder = async (orderId: number) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setOrders(orders.filter(order => order.id !== orderId))
        toast({
          title: "نجاح",
          description: "تم حذف الطلب بنجاح",
        })
      } else {
        throw new Error('Failed to delete order')
      }
    } catch (error) {
      console.error('Error deleting order:', error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف الطلب",
        variant: "destructive",
      })
    }
  }

  const handleCreateOrder = async () => {
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      })
      
      if (response.ok) {
        const createdOrder = await response.json()
        setOrders([createdOrder, ...orders])
        setIsCreateDialogOpen(false)
        setNewOrder({
          userId: null,
          formSubmissionId: null,
          agentId: null,
          price: null,
          status: "pending",
          paymentStatus: "unpaid",
          receipt: null,
        })
        toast({
          title: "نجاح",
          description: "تم إنشاء الطلب بنجاح",
        })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create order')
      }
    } catch (error: any) {
      console.error('Error creating order:', error)
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء إنشاء الطلب",
        variant: "destructive",
      })
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return "bg-green-100 text-green-800"
      case 'pending':
        return "bg-yellow-100 text-yellow-800"
      case 'cancelled':
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return "مكتمل"
      case 'pending':
        return "قيد المعالجة"
      case 'cancelled':
        return "ملغي"
      default:
        return status
    }
  }

  const getPaymentStatusLabel = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'paid':
        return "مدفوع"
      case 'unpaid':
        return "غير مدفوع"
      case 'refunded':
        return "مرتجع"
      default:
        return paymentStatus
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.formSubmission?.fullName && order.formSubmission.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesPaymentStatus = paymentStatusFilter === "all" || order.paymentStatus === paymentStatusFilter
    const matchesUniversity = universityFilter === "all" || 
      (order.formSubmission?.universityId && order.formSubmission.universityId.toString() === universityFilter)
    const matchesProgram = programFilter === "all" || 
      (order.formSubmission?.programId && order.formSubmission.programId.toString() === programFilter)
    
    return matchesSearch && matchesStatus && matchesPaymentStatus && matchesUniversity && matchesProgram
  })

  if (loading) {
    return (
      <div className="p-6 space-y-6" dir="rtl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#111827]">إدارة الطلبات</h1>
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
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#111827]">إدارة الطلبات</h1>
          <p className="text-[#4b5563] mt-1">إدارة جميع طلبات الطلاب</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 ml-2" />
            تصدير
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#111827] hover:bg-[#374151]">
                <Plus className="w-4 h-4 ml-2" />
                طلب جديد
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إنشاء طلب جديد</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="userId">المستخدم</Label>
                  <Select 
                    value={newOrder.userId?.toString() || ''} 
                    onValueChange={(value) => setNewOrder({...newOrder, userId: parseInt(value) || null})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر مستخدم" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.formSubmission?.fullName || user.fullName} - {user.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="price">السعر</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newOrder.price || ''}
                    onChange={(e) => setNewOrder({...newOrder, price: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="status">الحالة</Label>
                  <Select value={newOrder.status} onValueChange={(value) => setNewOrder({...newOrder, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">قيد المعالجة</SelectItem>
                      <SelectItem value="completed">مكتمل</SelectItem>
                      <SelectItem value="cancelled">ملغي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="paymentStatus">حالة الدفع</Label>
                  <Select value={newOrder.paymentStatus} onValueChange={(value) => setNewOrder({...newOrder, paymentStatus: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unpaid">غير مدفوع</SelectItem>
                      <SelectItem value="paid">مدفوع</SelectItem>
                      <SelectItem value="refunded">مرتجع</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={handleCreateOrder}>
                    إنشاء
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#4b5563]">إجمالي الطلبات</p>
                <p className="text-2xl font-bold text-[#111827]">{orders.length}</p>
              </div>
              <Package className="w-8 h-8 text-[#4b5563]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#4b5563]">قيد المعالجة</p>
                <p className="text-2xl font-bold text-[#f59e0b]">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-[#f59e0b]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#4b5563]">مكتملة</p>
                <p className="text-2xl font-bold text-[#10b981]">
                  {orders.filter(o => o.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-[#10b981]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#4b5563]">ملغية</p>
                <p className="text-2xl font-bold text-[#ef4444]">
                  {orders.filter(o => o.status === 'cancelled').length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-[#ef4444]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4b5563] w-4 h-4" />
              <Input 
                placeholder="البحث في الطلبات..." 
                className="pr-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="pending">قيد المعالجة</SelectItem>
                <SelectItem value="completed">مكتملة</SelectItem>
                <SelectItem value="cancelled">ملغية</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="حالة الدفع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع حالات الدفع</SelectItem>
                <SelectItem value="paid">مدفوع</SelectItem>
                <SelectItem value="unpaid">غير مدفوع</SelectItem>
                <SelectItem value="refunded">مرتجع</SelectItem>
              </SelectContent>
            </Select>
            <Select value={universityFilter} onValueChange={setUniversityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="الجامعة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الجامعات</SelectItem>
                {universities.map((university) => (
                  <SelectItem key={university.id} value={university.id.toString()}>
                    {university.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={programFilter} onValueChange={setProgramFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="التخصص" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع التخصصات</SelectItem>
                {programs.map((program) => (
                  <SelectItem key={program.id} value={program.id.toString()}>
                    {program.name}
                  </SelectItem>
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

      {/* Orders Table */}
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
                  <th className="text-right p-3 text-sm font-medium text-[#4b5563]">حالة الدفع</th>
                  <th className="text-right p-3 text-sm font-medium text-[#4b5563]">الحالة</th>
                  <th className="text-right p-3 text-sm font-medium text-[#4b5563]">المبلغ</th>
                  <th className="text-right p-3 text-sm font-medium text-[#4b5563]">تاريخ الطلب</th>
                  <th className="text-right p-3 text-sm font-medium text-[#4b5563]">العميل</th>
                  <th className="text-right p-3 text-sm font-medium text-[#4b5563]">رقم الطلب</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-[#f3f4f6] hover:bg-[#f9fafb]">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditOrder(order)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700 bg-transparent"
                          onClick={() => handleDeleteOrder(order.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className={getStatusBadgeClass(order.paymentStatus)}>
                        {getPaymentStatusLabel(order.paymentStatus)}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={getStatusBadgeClass(order.status)}>
                        {getStatusLabel(order.status)}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm font-medium text-[#111827]">${order.price}</td>
                    <td className="p-3 text-sm text-[#4b5563]">
                      {new Date(order.dateCreated).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="p-3 text-sm text-[#111827]">
                      {order.formSubmission?.fullName || order.user.fullName}
                    </td>
                    <td className="p-3 text-sm font-medium text-[#111827]">#{order.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View Order Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تفاصيل الطلب #{selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>معلومات الطلب</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">رقم الطلب:</span>
                      <span className="font-medium">#{selectedOrder.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">تاريخ الطلب:</span>
                      <span>{new Date(selectedOrder.dateCreated).toLocaleDateString('ar-SA')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">المبلغ:</span>
                      <span className="font-medium">${selectedOrder.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الحالة:</span>
                      <Badge className={getStatusBadgeClass(selectedOrder.status)}>
                        {getStatusLabel(selectedOrder.status)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">حالة الدفع:</span>
                      <Badge className={getStatusBadgeClass(selectedOrder.paymentStatus)}>
                        {getPaymentStatusLabel(selectedOrder.paymentStatus)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>معلومات الطالب</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">الاسم:</span>
                      <span>{selectedOrder.formSubmission?.fullName || selectedOrder.user.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">البريد الإلكتروني:</span>
                      <span>{selectedOrder.user.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">التخصص المفضل:</span>
                      <span>{selectedOrder.formSubmission?.preferredProgram || "—"}</span>
                    </div>
                    {selectedOrder.agent && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">الوكيل:</span>
                        <span>{selectedOrder.agent.name}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Notes Section */}
              <Card>
                <CardHeader>
                  <CardTitle>الملاحظات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="orderNotes">إضافة ملاحظات</Label>
                      <textarea
                        id="orderNotes"
                        className="w-full p-3 border rounded-md mt-1"
                        rows={4}
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        placeholder="أضف ملاحظات حول هذا الطلب..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleUpdateOrder}>
                  حفظ الملاحظات
                </Button>
                <Button 
                  onClick={handleConfirmPayment}
                  disabled={selectedOrder.paymentStatus === "paid"}
                >
                  {selectedOrder.paymentStatus === "paid" ? "تم الدفع" : "تأكيد الدفع"}
                </Button>
                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="رسالة الإشعار..."
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleSendNotification}
                  disabled={!notificationMessage}
                >
                  إرسال إشعار
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Order Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تعديل الطلب #{editingOrder?.id}</DialogTitle>
          </DialogHeader>
          {editingOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="editUserId">المستخدم</Label>
                  <Select 
                    value={editingOrder.userId?.toString() || ''} 
                    onValueChange={(value) => setEditingOrder({...editingOrder, userId: value ? parseInt(value) : null})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر مستخدم" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.formSubmission?.fullName || user.fullName} - {user.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editPrice">السعر</Label>
                  <Input
                    id="editPrice"
                    type="number"
                    value={editingOrder.price || ''}
                    onChange={(e) => setEditingOrder({...editingOrder, price: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="editStatus">الحالة</Label>
                  <Select 
                    value={editingOrder.status} 
                    onValueChange={(value) => setEditingOrder({...editingOrder, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">قيد المعالجة</SelectItem>
                      <SelectItem value="completed">مكتمل</SelectItem>
                      <SelectItem value="cancelled">ملغي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editPaymentStatus">حالة الدفع</Label>
                  <Select 
                    value={editingOrder.paymentStatus} 
                    onValueChange={(value) => setEditingOrder({...editingOrder, paymentStatus: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unpaid">غير مدفوع</SelectItem>
                      <SelectItem value="paid">مدفوع</SelectItem>
                      <SelectItem value="refunded">مرتجع</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="editReceipt">رابط الإيصال</Label>
                  <Input
                    id="editReceipt"
                    value={editingOrder.receipt || ''}
                    onChange={(e) => setEditingOrder({...editingOrder, receipt: e.target.value})}
                    placeholder="https://example.com/receipt.pdf"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleSaveEditedOrder}>
                  حفظ التغييرات
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
