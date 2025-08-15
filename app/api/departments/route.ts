import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { Department } from '@/lib/types'

export async function GET() {
  try {
    const departments = await db.department.findMany({
      include: {
        university: true,
        programs: true
      }
    })

    return NextResponse.json(departments)
  } catch (error) {
    console.error('Error fetching departments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch departments' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body: Department = await request.json()
    
    // Extract the university ID from the university object if it exists
    const universityId = body.university?.id
    
    const newDepartment = await db.department.create({
      data: {
        name: body.name,
        ...(universityId && { universityId })
      },
      include: {
        university: true,
        programs: true
      }
    })

    return NextResponse.json(newDepartment, { status: 201 })
  } catch (error) {
    console.error('Error creating department:', error)
    return NextResponse.json(
      { error: 'Failed to create department' },
      { status: 500 }
    )
  }
}
