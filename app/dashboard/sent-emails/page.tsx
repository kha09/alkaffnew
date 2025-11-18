'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Mail, Eye, Filter, Download, Search } from 'lucide-react'
import { toast } from 'sonner'

interface SentEmail {
  id: number
  fromEmail: string
  toEmail: string
  subject: string
  body: string
  templateId?: number
  formSubmissionId: number
  universityId?: number
  attachmentPaths?: string
  status: string
  sentAt: string
  template?: {
    id: number
    name: string
    templateType: string
  }
  formSubmission?: {
    id: number
    fullName: string
    email: string
    nationality: string
    preferredProgram: string
  }
  university?: {
    id: number
    name: string
    country: string
  }
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export default function SentEmailsPage() {
  const [emails, setEmails] = useState<SentEmail[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })
  const [selectedEmail, setSelectedEmail] = useState<SentEmail | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [filters, setFilters] = useState({
    status: '',
    universityId: '',
    templateId: '',
    fromDate: '',
    toDate: '',
    search: ''
  })

  useEffect(() => {
    fetchSentEmails()
  }, [pagination.page, filters])

  const fetchSentEmails = async () => {
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.status && filters.status !== 'all' && { status: filters.status }),
        ...(filters.universityId && filters.universityId !== 'all' && { universityId: filters.universityId }),
        ...(filters.templateId && filters.templateId !== 'all' && { templateId: filters.templateId }),
        ...(filters.fromDate && { fromDate: filters.fromDate }),
        ...(filters.toDate && { toDate: filters.toDate })
      })

      const response = await fetch(`/api/admin/sent-emails?${params}`)
      if (response.ok) {
        const data = await response.json()
        setEmails(data.emails)
        setPagination(data.pagination)
      } else {
        toast.error('Failed to fetch sent emails')
      }
    } catch (error) {
      console.error('Error fetching sent emails:', error)
      toast.error('Error fetching sent emails')
    } finally {
      setLoading(false)
    }
  }

  const handleViewEmail = (email: SentEmail) => {
    setSelectedEmail(email)
    setIsViewDialogOpen(true)
  }

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const resetFilters = () => {
    setFilters({
      status: '',
      universityId: '',
      templateId: '',
      fromDate: '',
      toDate: '',
      search: ''
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge variant="default">تم الإرسال</Badge>
      case 'failed':
        return <Badge variant="destructive">فشل الإرسال</Badge>
      case 'pending':
        return <Badge variant="secondary">في الانتظار</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#111827]">البريد الإلكتروني المرسل</h1>
            <p className="text-[#4b5563] mt-1">عرض وإدارة جميع رسائل البريد الإلكتروني المرسلة للجامعات</p>
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
          <h1 className="text-3xl font-bold text-[#111827]">البريد الإلكتروني المرسل</h1>
          <p className="text-[#4b5563] mt-1">عرض وإدارة جميع رسائل البريد الإلكتروني المرسلة للجامعات</p>
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
                <p className="text-sm text-[#4b5563]">إجمالي الرسائل</p>
                <p className="text-2xl font-bold text-[#111827]">{pagination.total}</p>
              </div>
              <Mail className="w-8 h-8 text-[#4b5563]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#4b5563]">تم الإرسال</p>
                <p className="text-2xl font-bold text-[#10b981]">
                  {emails.filter(e => e.status === 'sent').length}
                </p>
              </div>
              <Eye className="w-8 h-8 text-[#10b981]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#4b5563]">في الانتظار</p>
                <p className="text-2xl font-bold text-[#f59e0b]">
                  {emails.filter(e => e.status === 'pending').length}
                </p>
              </div>
              <Search className="w-8 h-8 text-[#f59e0b]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#4b5563]">فشل الإرسال</p>
                <p className="text-2xl font-bold text-[#ef4444]">
                  {emails.filter(e => e.status === 'failed').length}
                </p>
              </div>
              <Filter className="w-8 h-8 text-[#ef4444]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            تصفية النتائج
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="status">الحالة</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع الحالات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="sent">تم الإرسال</SelectItem>
                  <SelectItem value="failed">فشل الإرسال</SelectItem>
                  <SelectItem value="pending">في الانتظار</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="fromDate">من تاريخ</Label>
              <Input
                id="fromDate"
                type="date"
                value={filters.fromDate}
                onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="toDate">إلى تاريخ</Label>
              <Input
                id="toDate"
                type="date"
                value={filters.toDate}
                onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="search">البحث</Label>
              <Input
                id="search"
                placeholder="البحث في الموضوع أو البريد الإلكتروني"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>

            <div className="flex items-end gap-2">
              <Button onClick={fetchSentEmails}>
                <Search className="h-4 w-4 mr-2" />
                بحث
              </Button>
              <Button variant="outline" onClick={resetFilters}>
                إعادة تعيين
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emails Table */}
      <Card>
        <CardHeader>
          <CardTitle>رسائل البريد الإلكتروني المرسلة</CardTitle>
          <CardDescription>
            إجمالي {pagination.total} رسالة بريد إلكتروني
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المرسل إليه</TableHead>
                <TableHead>الموضوع</TableHead>
                <TableHead>الطالب</TableHead>
                <TableHead>الجامعة</TableHead>
                <TableHead>القالب</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>تاريخ الإرسال</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {emails.map((email) => (
                <TableRow key={email.id}>
                  <TableCell className="font-medium">{email.toEmail}</TableCell>
                  <TableCell className="max-w-xs truncate">{email.subject}</TableCell>
                  <TableCell>
                    {email.formSubmission ? (
                      <div>
                        <div className="font-medium">{email.formSubmission.fullName}</div>
                        <div className="text-sm text-muted-foreground">{email.formSubmission.email}</div>
                      </div>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {email.university ? (
                      <div>
                        <div className="font-medium">{email.university.name}</div>
                        <div className="text-sm text-muted-foreground">{email.university.country}</div>
                      </div>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {email.template ? (
                      <Badge variant="outline">{email.template.name}</Badge>
                    ) : (
                      <Badge variant="secondary">مخصص</Badge>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(email.status)}</TableCell>
                  <TableCell>{formatDate(email.sentAt)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewEmail(email)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                عرض {((pagination.page - 1) * pagination.limit) + 1} إلى {Math.min(pagination.page * pagination.limit, pagination.total)} من {pagination.total} نتيجة
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  السابق
                </Button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    const page = i + 1
                    return (
                      <Button
                        key={page}
                        variant={pagination.page === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    )
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                >
                  التالي
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Email Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>عرض البريد الإلكتروني</DialogTitle>
            <DialogDescription>
              تفاصيل البريد الإلكتروني المرسل
            </DialogDescription>
          </DialogHeader>
          {selectedEmail && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>من</Label>
                  <div className="p-2 bg-muted rounded">{selectedEmail.fromEmail}</div>
                </div>
                <div>
                  <Label>إلى</Label>
                  <div className="p-2 bg-muted rounded">{selectedEmail.toEmail}</div>
                </div>
              </div>

              <div>
                <Label>الموضوع</Label>
                <div className="p-2 bg-muted rounded">{selectedEmail.subject}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>الحالة</Label>
                  <div className="p-2">{getStatusBadge(selectedEmail.status)}</div>
                </div>
                <div>
                  <Label>تاريخ الإرسال</Label>
                  <div className="p-2 bg-muted rounded">{formatDate(selectedEmail.sentAt)}</div>
                </div>
              </div>

              {selectedEmail.template && (
                <div>
                  <Label>القالب المستخدم</Label>
                  <div className="p-2 bg-muted rounded">
                    <Badge variant="outline">{selectedEmail.template.name}</Badge>
                    <span className="ml-2 text-sm text-muted-foreground">
                      ({selectedEmail.template.templateType})
                    </span>
                  </div>
                </div>
              )}

              {selectedEmail.formSubmission && (
                <div>
                  <Label>معلومات الطالب</Label>
                  <div className="p-3 bg-muted rounded space-y-1">
                    <div><strong>الاسم:</strong> {selectedEmail.formSubmission.fullName}</div>
                    <div><strong>البريد الإلكتروني:</strong> {selectedEmail.formSubmission.email}</div>
                    <div><strong>الجنسية:</strong> {selectedEmail.formSubmission.nationality}</div>
                    <div><strong>البرنامج المفضل:</strong> {selectedEmail.formSubmission.preferredProgram}</div>
                  </div>
                </div>
              )}

              {selectedEmail.university && (
                <div>
                  <Label>معلومات الجامعة</Label>
                  <div className="p-3 bg-muted rounded space-y-1">
                    <div><strong>اسم الجامعة:</strong> {selectedEmail.university.name}</div>
                    <div><strong>البلد:</strong> {selectedEmail.university.country}</div>
                  </div>
                </div>
              )}

              {selectedEmail.attachmentPaths && (
                <div>
                  <Label>المرفقات</Label>
                  <div className="p-2 bg-muted rounded">
                    <Badge variant="secondary">
                      {JSON.parse(selectedEmail.attachmentPaths).length} ملف مرفق
                    </Badge>
                  </div>
                </div>
              )}

              <div>
                <Label>محتوى البريد الإلكتروني</Label>
                <div className="p-4 bg-muted rounded border max-h-64 overflow-y-auto">
                  <div className="whitespace-pre-wrap">{selectedEmail.body}</div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setIsViewDialogOpen(false)}>
                  إغلاق
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
