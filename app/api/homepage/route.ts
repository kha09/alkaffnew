import { NextResponse } from 'next/server'
import { getHomepageContent, updateHomepageContent, initializeDefaultContent } from '@/lib/homepageService'

export async function GET() {
  try {
    // Initialize default content if database is empty
    await initializeDefaultContent()
    
    const content = await getHomepageContent()
    return NextResponse.json(content)
  } catch (error) {
    console.error('Error fetching homepage content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch homepage content' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const content = await request.json()
    await updateHomepageContent(content)
    return NextResponse.json({ message: 'Content updated successfully' })
  } catch (error) {
    console.error('Error updating homepage content:', error)
    return NextResponse.json(
      { error: 'Failed to update homepage content' },
      { status: 500 }
    )
  }
}
