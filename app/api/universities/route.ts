import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET() {
  try {
    const universities = await db.university.findMany({
      orderBy: { order: 'asc' }
    })

    // Add default values for optional properties
    const universitiesWithDefaults = universities.map(university => ({
      ...university,
      nameEn: university.name,
      location: university.country,
      tuitionFee: "15,000",
      currency: "RM",
      courses: 100,
      rating: 4.5,
      popular: true,
      featured: false,
      specializations: ["تقنية المعلومات", "الهندسة", "إدارة الأعمال", "الفنون الإبداعية"],
      students: university.students
    }))

    return NextResponse.json(universitiesWithDefaults)
  } catch (error) {
    console.error('Error fetching universities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch universities' },
      { status: 500 }
    )
  }
}
