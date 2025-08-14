import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
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
