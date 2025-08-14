import { NextResponse } from 'next/server'
import { HomePageContent } from '@/lib/types'
import fs from 'fs'
import path from 'path'

const contentFilePath = path.join(process.cwd(), 'data', 'homepage-content.json')

// Initialize with default content if file doesn't exist
if (!fs.existsSync(contentFilePath)) {
  const defaultContent: HomePageContent = {
    heroSlides: [],
    universities: [],
    testimonials: [],
    faqs: []
  }
  fs.writeFileSync(contentFilePath, JSON.stringify(defaultContent, null, 2))
}

export async function GET() {
  try {
    const content = JSON.parse(fs.readFileSync(contentFilePath, 'utf-8'))
    return NextResponse.json(content)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load content' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const newContent: HomePageContent = await request.json()
    
    // Basic validation
    if (!newContent.heroSlides || !newContent.universities || !newContent.testimonials || !newContent.faqs) {
      return NextResponse.json(
        { error: 'Invalid content structure' },
        { status: 400 }
      )
    }

    fs.writeFileSync(contentFilePath, JSON.stringify(newContent, null, 2))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save content' },
      { status: 500 }
    )
  }
}
