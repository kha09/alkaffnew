'use client'

import { University } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface UniversitiesEditorProps {
  universities: University[]
  onChange: (universities: University[]) => void
}

export default function UniversitiesEditor({ universities, onChange }: UniversitiesEditorProps) {
  const addUniversity = () => {
    const newUniversity: University = {
      id: 0, // This will be set by the database
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
    }
    onChange([...universities, newUniversity])
  }

  const updateUniversity = (index: number, field: keyof University, value: string) => {
    const updatedUniversities = [...universities]
    updatedUniversities[index] = { ...updatedUniversities[index], [field]: value }
    onChange(updatedUniversities)
  }

  const removeUniversity = (index: number) => {
    const updatedUniversities = universities.filter((_, i) => i !== index)
    onChange(updatedUniversities)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={addUniversity}>Add University</Button>
      </div>
      
      {universities.map((university, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>University {index + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={university.name}
                  onChange={(e) => updateUniversity(index, 'name', e.target.value)}
                  placeholder="University name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Country</label>
                <Input
                  value={university.country}
                  onChange={(e) => updateUniversity(index, 'country', e.target.value)}
                  placeholder="Country"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Logo URL</label>
                <Input
                  value={university.logo}
                  onChange={(e) => updateUniversity(index, 'logo', e.target.value)}
                  placeholder="/placeholder.svg?height=80&width=80"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Flag</label>
                <Input
                  value={university.flag}
                  onChange={(e) => updateUniversity(index, 'flag', e.target.value)}
                  placeholder="🇺🇸"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Ranking</label>
                <Input
                  value={university.ranking}
                  onChange={(e) => updateUniversity(index, 'ranking', e.target.value)}
                  placeholder="#1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Students</label>
                <Input
                  value={university.students}
                  onChange={(e) => updateUniversity(index, 'students', e.target.value)}
                  placeholder="23,000+"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Programs</label>
                <Input
                  value={university.programs}
                  onChange={(e) => updateUniversity(index, 'programs', e.target.value)}
                  placeholder="180+"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Acceptance Rate</label>
                <Input
                  value={university.acceptance}
                  onChange={(e) => updateUniversity(index, 'acceptance', e.target.value)}
                  placeholder="3.4%"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Color Gradient</label>
                <Input
                  value={university.color}
                  onChange={(e) => updateUniversity(index, 'color', e.target.value)}
                  placeholder="from-blue-500 to-purple-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button variant="destructive" onClick={() => removeUniversity(index)}>
                Remove University
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
