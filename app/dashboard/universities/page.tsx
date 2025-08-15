'use client'

import { useState, useEffect } from 'react'
import { University } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export default function UniversitiesManagement() {
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentUniversity, setCurrentUniversity] = useState<University | null>(null)

  useEffect(() => {
    fetchUniversities()
  }, [])

  const fetchUniversities = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/universities')
      if (!response.ok) throw new Error('Failed to fetch universities')
      const data = await response.json()
      setUniversities(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setCurrentUniversity({
      id: 0,
      name: '',
      country: '',
      logo: '',
      ranking: '',
      students: '',
      programs: '',
      acceptance: '',
      color: 'from-blue-500 to-purple-500',
      flag: '',
      freeOfferLetter: false
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (university: University) => {
    setCurrentUniversity(university)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this university?')) return
    
    try {
      const response = await fetch(`/api/universities/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) throw new Error('Failed to delete university')
      
      // Refresh the list
      fetchUniversities()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    }
  }

  const handleSave = async () => {
    if (!currentUniversity) return
    
    try {
      const method = currentUniversity.id ? 'PUT' : 'POST'
      const url = currentUniversity.id ? `/api/universities/${currentUniversity.id}` : '/api/universities'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentUniversity),
      })
      
      if (!response.ok) throw new Error(`Failed to ${currentUniversity.id ? 'update' : 'create'} university`)
      
      // Close dialog and refresh the list
      setIsDialogOpen(false)
      fetchUniversities()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    }
  }

  const handleInputChange = (field: keyof University, value: string | boolean) => {
    if (currentUniversity) {
      setCurrentUniversity({
        ...currentUniversity,
        [field]: value
      })
    }
  }

  if (loading) return <div className="p-6">Loading universities...</div>
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة الجامعات</h1>
        <Button onClick={handleCreate}>إضافة جامعة جديدة</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة الجامعات</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>البلد</TableHead>
                <TableHead>الترتيب</TableHead>
                <TableHead>الطلاب</TableHead>
                <TableHead>البرامج</TableHead>
                <TableHead>معدل القبول</TableHead>
                <TableHead>رسالة قبول مجانية</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {universities.map((university) => (
                <TableRow key={university.id}>
                  <TableCell className="font-medium">{university.name}</TableCell>
                  <TableCell>{university.country}</TableCell>
                  <TableCell>{university.ranking}</TableCell>
                  <TableCell>{university.students}</TableCell>
                  <TableCell>{university.programs}</TableCell>
                  <TableCell>{university.acceptance}</TableCell>
                  <TableCell>
                    {university.freeOfferLetter ? 'نعم' : 'لا'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="ml-2" onClick={() => handleEdit(university)}>
                      تعديل
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(university.id)}>
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
              {currentUniversity?.id ? 'تعديل الجامعة' : 'إضافة جامعة جديدة'}
            </DialogTitle>
          </DialogHeader>
          {currentUniversity && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  الاسم
                </Label>
                <Input
                  id="name"
                  value={currentUniversity.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="country" className="text-right">
                  البلد
                </Label>
                <Input
                  id="country"
                  value={currentUniversity.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="logo" className="text-right">
                  رابط الشعار
                </Label>
                <Input
                  id="logo"
                  value={currentUniversity.logo}
                  onChange={(e) => handleInputChange('logo', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="flag" className="text-right">
                  العلم
                </Label>
                <Input
                  id="flag"
                  value={currentUniversity.flag}
                  onChange={(e) => handleInputChange('flag', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ranking" className="text-right">
                  الترتيب
                </Label>
                <Input
                  id="ranking"
                  value={currentUniversity.ranking}
                  onChange={(e) => handleInputChange('ranking', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="students" className="text-right">
                  عدد الطلاب
                </Label>
                <Input
                  id="students"
                  value={currentUniversity.students}
                  onChange={(e) => handleInputChange('students', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="programs" className="text-right">
                  عدد البرامج
                </Label>
                <Input
                  id="programs"
                  value={currentUniversity.programs}
                  onChange={(e) => handleInputChange('programs', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="acceptance" className="text-right">
                  معدل القبول
                </Label>
                <Input
                  id="acceptance"
                  value={currentUniversity.acceptance}
                  onChange={(e) => handleInputChange('acceptance', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="color" className="text-right">
                  تدرج الألوان
                </Label>
                <Input
                  id="color"
                  value={currentUniversity.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="freeOfferLetter" className="text-right">
                  رسالة قبول مجانية
                </Label>
                <div className="col-span-3">
                  <Switch
                    id="freeOfferLetter"
                    checked={currentUniversity.freeOfferLetter}
                    onCheckedChange={(checked) => handleInputChange('freeOfferLetter', checked)}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSave}>
                  {currentUniversity.id ? 'تحديث' : 'إنشاء'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
