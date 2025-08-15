'use client'

import { useState, useEffect } from 'react'
import { Department, University } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function DepartmentsManagement() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [departmentsRes, universitiesRes] = await Promise.all([
        fetch('/api/departments'),
        fetch('/api/universities')
      ])

      if (!departmentsRes.ok || !universitiesRes.ok) {
        throw new Error('Failed to fetch data')
      }

      const departmentsData = await departmentsRes.json()
      const universitiesData = await universitiesRes.json()

      setDepartments(departmentsData)
      setUniversities(universitiesData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setCurrentDepartment({
      id: 0,
      name: '',
      university: undefined,
      programs: []
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (department: Department) => {
    setCurrentDepartment(department)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this department?')) return
    
    try {
      const response = await fetch(`/api/departments/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) throw new Error('Failed to delete department')
      
      // Refresh the list
      fetchData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    }
  }

  const handleSave = async () => {
    if (!currentDepartment) return
    
    try {
      const method = currentDepartment.id ? 'PUT' : 'POST'
      const url = currentDepartment.id ? `/api/departments/${currentDepartment.id}` : '/api/departments'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentDepartment),
      })
      
      if (!response.ok) throw new Error(`Failed to ${currentDepartment.id ? 'update' : 'create'} department`)
      
      // Close dialog and refresh the list
      setIsDialogOpen(false)
      fetchData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    }
  }

  const handleInputChange = (field: keyof Department, value: string | University) => {
    if (currentDepartment) {
      setCurrentDepartment({
        ...currentDepartment,
        [field]: value
      })
    }
  }

  if (loading) return <div className="p-6">Loading departments...</div>
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة الأقسام</h1>
        <Button onClick={handleCreate}>إضافة قسم جديد</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة الأقسام</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>الجامعة</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell className="font-medium">{department.name}</TableCell>
                  <TableCell>{department.university?.name}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="ml-2" onClick={() => handleEdit(department)}>
                      تعديل
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(department.id)}>
                      حذف
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {currentDepartment?.id ? 'تعديل القسم' : 'إضافة قسم جديد'}
            </DialogTitle>
          </DialogHeader>
          {currentDepartment && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  الاسم
                </Label>
                <Input
                  id="name"
                  value={currentDepartment.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="university" className="text-right">
                  الجامعة
                </Label>
                <Select
                  value={currentDepartment.university?.id.toString() || ''}
                  onValueChange={(value) => {
                    const university = universities.find(u => u.id === parseInt(value))
                    if (university) {
                      handleInputChange('university', university)
                    }
                  }}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="اختر جامعة" />
                  </SelectTrigger>
                  <SelectContent>
                    {universities.map((university) => (
                      <SelectItem key={university.id} value={university.id.toString()}>
                        {university.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSave}>
                  {currentDepartment.id ? 'تحديث' : 'إنشاء'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
