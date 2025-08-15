import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { University } from '@/lib/types'

export async function GET() {
  try {
    const universities = await db.university.findMany({
      orderBy: { order: 'asc' },
      include: {
        departments: true
      }
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
      specializations: university.departments?.map(department => department.name) || [],
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

export async function POST(request: Request) {
  try {
    const body: University = await request.json()
    
    // Remove fields that are computed or have default values
    const { id, nameEn, location, tuitionFee, currency, courses, rating, popular, featured, specializations, departments, ...universityData } = body
    
    const newUniversity = await db.university.create({
      data: {
        ...universityData,
        order: 0 // Default order value
      }
    })

    return NextResponse.json(newUniversity, { status: 201 })
  } catch (error) {
    console.error('Error creating university:', error)
    return NextResponse.json(
      { error: 'Failed to create university' },
      { status: 500 }
    )
  }
}
