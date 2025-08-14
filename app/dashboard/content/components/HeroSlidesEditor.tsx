'use client'

import { HeroSlide } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface HeroSlidesEditorProps {
  slides: HeroSlide[]
  onChange: (slides: HeroSlide[]) => void
}

export default function HeroSlidesEditor({ slides, onChange }: HeroSlidesEditorProps) {
  const addSlide = () => {
    const newSlide: HeroSlide = {
      title: '',
      subtitle: '',
      description: '',
      image: '',
      gradient: 'from-blue-600 to-purple-700'
    }
    onChange([...slides, newSlide])
  }

  const updateSlide = (index: number, field: keyof HeroSlide, value: string) => {
    const updatedSlides = [...slides]
    updatedSlides[index] = { ...updatedSlides[index], [field]: value }
    onChange(updatedSlides)
  }

  const removeSlide = (index: number) => {
    const updatedSlides = slides.filter((_, i) => i !== index)
    onChange(updatedSlides)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={addSlide}>Add Slide</Button>
      </div>
      
      {slides.map((slide, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>Slide {index + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={slide.title}
                  onChange={(e) => updateSlide(index, 'title', e.target.value)}
                  placeholder="Slide title"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Subtitle</label>
                <Input
                  value={slide.subtitle}
                  onChange={(e) => updateSlide(index, 'subtitle', e.target.value)}
                  placeholder="Slide subtitle"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={slide.description}
                onChange={(e) => updateSlide(index, 'description', e.target.value)}
                placeholder="Slide description"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Image URL</label>
                <Input
                  value={slide.image}
                  onChange={(e) => updateSlide(index, 'image', e.target.value)}
                  placeholder="/images/students-campus.png"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Gradient</label>
                <Input
                  value={slide.gradient}
                  onChange={(e) => updateSlide(index, 'gradient', e.target.value)}
                  placeholder="from-blue-600 to-purple-700"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button variant="destructive" onClick={() => removeSlide(index)}>
                Remove Slide
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
