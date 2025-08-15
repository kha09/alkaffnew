import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { University } from '@/lib/types'

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params
    const universityId = parseInt(params.id)
    
    if (isNaN(universityId)) {
      return NextResponse.json({ error: 'Invalid university ID' }, { status: 400 })
    }

    const university = await db.university.findUnique({
      where: { id: universityId },
      include: {
        departments: {
          include: {
            programs: true
          }
        }
      }
    })

    if (!university) {
      return NextResponse.json({ error: 'University not found' }, { status: 404 })
    }

    return NextResponse.json(university)
  } catch (error) {
    console.error('Error fetching university details:', error)
    return NextResponse.json({ error: 'Failed to fetch university details' }, { status: 500 })
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params
    const universityId = parseInt(params.id)
    
    if (isNaN(universityId)) {
      return NextResponse.json({ error: 'Invalid university ID' }, { status: 400 })
    }

    const body: University = await request.json()
    
    // Remove fields that are computed or have default values
    const { id, nameEn, location, tuitionFee, currency, courses, rating, popular, featured, specializations, departments, ...universityData } = body
    
    const updatedUniversity = await db.university.update({
      where: { id: universityId },
      data: universityData
    })

    return NextResponse.json(updatedUniversity)
  } catch (error) {
    console.error('Error updating university:', error)
    return NextResponse.json(
      { error: 'Failed to update university' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params
    const universityId = parseInt(params.id)
    
    if (isNaN(universityId)) {
      return NextResponse.json({ error: 'Invalid university ID' }, { status: 400 })
    }

    await db.university.delete({
      where: { id: universityId }
    })

    return NextResponse.json({ message: 'University deleted successfully' })
  } catch (error) {
    console.error('Error deleting university:', error)
    return NextResponse.json(
      { error: 'Failed to delete university' },
      { status: 500 }
    )
  }
}
