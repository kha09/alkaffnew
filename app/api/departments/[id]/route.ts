import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { Department } from '@/lib/types'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const departmentId = parseInt(params.id)
    
    if (isNaN(departmentId)) {
      return NextResponse.json({ error: 'Invalid department ID' }, { status: 400 })
    }

    const department = await db.department.findUnique({
      where: { id: departmentId },
      include: {
        university: true,
        programs: true
      }
    })

    if (!department) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 })
    }

    return NextResponse.json(department)
  } catch (error) {
    console.error('Error fetching department details:', error)
    return NextResponse.json({ error: 'Failed to fetch department details' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const departmentId = parseInt(params.id)
    
    if (isNaN(departmentId)) {
      return NextResponse.json({ error: 'Invalid department ID' }, { status: 400 })
    }

    const body: Department = await request.json()
    
    // Extract the university ID from the university object if it exists
    const universityId = body.university?.id
    
    const updatedDepartment = await db.department.update({
      where: { id: departmentId },
      data: {
        name: body.name,
        ...(universityId && { universityId })
      },
      include: {
        university: true,
        programs: true
      }
    })

    return NextResponse.json(updatedDepartment)
  } catch (error) {
    console.error('Error updating department:', error)
    return NextResponse.json(
      { error: 'Failed to update department' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const departmentId = parseInt(params.id)
    
    if (isNaN(departmentId)) {
      return NextResponse.json({ error: 'Invalid department ID' }, { status: 400 })
    }

    await db.department.delete({
      where: { id: departmentId }
    })

    return NextResponse.json({ message: 'Department deleted successfully' })
  } catch (error) {
    console.error('Error deleting department:', error)
    return NextResponse.json(
      { error: 'Failed to delete department' },
      { status: 500 }
    )
  }
}
