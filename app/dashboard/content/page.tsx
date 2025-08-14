'use client'

import { useState, useEffect } from 'react'
import { HomePageContent } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import HeroSlidesEditor from './components/HeroSlidesEditor'
import UniversitiesEditor from './components/UniversitiesEditor'
import TestimonialsEditor from './components/TestimonialsEditor'
import FaqsEditor from './components/FaqsEditor'

export default function ContentEditor() {
  const [content, setContent] = useState<HomePageContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/homepage')
        if (!response.ok) throw new Error('Failed to fetch content')
        const data: HomePageContent = await response.json()
        setContent(data)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setIsLoading(false)
      }
    }
    fetchContent()
  }, [])

  const handleSave = async () => {
    if (!content) return
    
    try {
      const response = await fetch('/api/homepage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      })
      if (!response.ok) throw new Error('Failed to save content')
      alert('Content saved successfully!')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!content) return <div>No content found</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Home Page Content Editor</h1>
      
      <Tabs defaultValue="hero">
        <TabsList className="mb-6">
          <TabsTrigger value="hero">Hero Slides</TabsTrigger>
          <TabsTrigger value="universities">Universities</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <HeroSlidesEditor 
            slides={content.heroSlides} 
            onChange={(slides: any[]) => setContent({...content, heroSlides: slides})} 
          />
        </TabsContent>

        <TabsContent value="universities">
          <UniversitiesEditor 
            universities={content.universities} 
            onChange={(universities: any[]) => setContent({...content, universities})} 
          />
        </TabsContent>

        <TabsContent value="testimonials">
          <TestimonialsEditor 
            testimonials={content.testimonials} 
            onChange={(testimonials: any[]) => setContent({...content, testimonials})} 
          />
        </TabsContent>

        <TabsContent value="faqs">
          <FaqsEditor 
            faqs={content.faqs} 
            onChange={(faqs: any[]) => setContent({...content, faqs})} 
          />
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Button onClick={handleSave}>Save All Changes</Button>
      </div>
    </div>
  )
}
