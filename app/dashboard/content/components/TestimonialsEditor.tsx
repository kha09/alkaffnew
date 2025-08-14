'use client'

import { Testimonial } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface TestimonialsEditorProps {
  testimonials: Testimonial[]
  onChange: (testimonials: Testimonial[]) => void
}

export default function TestimonialsEditor({ testimonials, onChange }: TestimonialsEditorProps) {
  const addTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: Date.now(),
      name: '',
      program: '',
      text: '',
      rating: 5,
      avatar: '',
      university: '',
      country: '',
      flag: '',
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      hasVideo: false,
      featured: false,
      category: 'بكالوريوس'
    }
    onChange([...testimonials, newTestimonial])
  }

  const updateTestimonial = (index: number, field: keyof Testimonial, value: string | number | boolean) => {
    const updatedTestimonials = [...testimonials]
    updatedTestimonials[index] = { ...updatedTestimonials[index], [field]: value }
    onChange(updatedTestimonials)
  }

  const removeTestimonial = (index: number) => {
    const updatedTestimonials = testimonials.filter((_, i) => i !== index)
    onChange(updatedTestimonials)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={addTestimonial}>Add Testimonial</Button>
      </div>
      
      {testimonials.map((testimonial, index) => (
        <Card key={testimonial.id || index}>
          <CardHeader>
            <CardTitle>Testimonial {index + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={testimonial.name}
                  onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                  placeholder="Student name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Program</label>
                <Input
                  value={testimonial.program}
                  onChange={(e) => updateTestimonial(index, 'program', e.target.value)}
                  placeholder="Student program"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Testimonial Text</label>
              <Textarea
                value={testimonial.text}
                onChange={(e) => updateTestimonial(index, 'text', e.target.value)}
                placeholder="Testimonial content"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Rating</label>
                <Select
                  value={testimonial.rating.toString()}
                  onValueChange={(value) => updateTestimonial(index, 'rating', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <SelectItem key={rating} value={rating.toString()}>
                        {rating} Star{rating > 1 ? 's' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={testimonial.category}
                  onValueChange={(value) => updateTestimonial(index, 'category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="بكالوريوس">بكالوريوس</SelectItem>
                    <SelectItem value="ماجستير">ماجستير</SelectItem>
                    <SelectItem value="دكتوراه">دكتوراه</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Date</label>
                <Input
                  value={testimonial.date}
                  onChange={(e) => updateTestimonial(index, 'date', e.target.value)}
                  placeholder="March 2025"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Avatar URL</label>
                <Input
                  value={testimonial.avatar}
                  onChange={(e) => updateTestimonial(index, 'avatar', e.target.value)}
                  placeholder="/placeholder.svg?height=120&width=120"
                />
              </div>
              <div>
                <label className="text-sm font-medium">University</label>
                <Input
                  value={testimonial.university}
                  onChange={(e) => updateTestimonial(index, 'university', e.target.value)}
                  placeholder="University name"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Country</label>
                <Input
                  value={testimonial.country}
                  onChange={(e) => updateTestimonial(index, 'country', e.target.value)}
                  placeholder="Country"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Flag</label>
                <Input
                  value={testimonial.flag}
                  onChange={(e) => updateTestimonial(index, 'flag', e.target.value)}
                  placeholder="🇺🇸"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`hasVideo-${index}`}
                  checked={testimonial.hasVideo}
                  onChange={(e) => updateTestimonial(index, 'hasVideo', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor={`hasVideo-${index}`} className="text-sm font-medium">
                  Has Video
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`featured-${index}`}
                  checked={testimonial.featured}
                  onChange={(e) => updateTestimonial(index, 'featured', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor={`featured-${index}`} className="text-sm font-medium">
                  Featured
                </label>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button variant="destructive" onClick={() => removeTestimonial(index)}>
                Remove Testimonial
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
