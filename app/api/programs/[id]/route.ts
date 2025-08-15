import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { Program } from '@/lib/types'

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params
    const programId = parseInt(params.id)
    
    if (isNaN(programId)) {
      return NextResponse.json({ error: 'Invalid program ID' }, { status: 400 })
    }

    const program = await db.program.findUnique({
      where: { id: programId },
      include: {
        department: {
          include: {
            university: true
          }
        }
      }
    })

    if (!program) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 })
    }

    return NextResponse.json(program)
  } catch (error) {
    console.error('Error fetching program details:', error)
    return NextResponse.json({ error: 'Failed to fetch program details' }, { status: 500 })
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params
    const programId = parseInt(params.id)
    
    if (isNaN(programId)) {
      return NextResponse.json({ error: 'Invalid program ID' }, { status: 400 })
    }

    const body: Program = await request.json()
    
    // Extract the department ID from the department object if it exists
    const departmentId = body.department?.id
    
    const updatedProgram = await db.program.update({
      where: { id: programId },
      data: {
        name: body.name,
        description: body.description,
        tuitionFees: body.tuitionFees,
        duration: body.duration,
        intakeMonths: body.intakeMonths,
        qualification: body.qualification,
        englishRequirement: body.englishRequirement,
        offerLetter: body.offerLetter,
        classType: body.classType,
        yearlyTuitionFees: body.yearlyTuitionFees,
        otherFees: body.otherFees,
        ...(departmentId && {
          department: {
            connect: { id: departmentId }
          }
        })
      },
      include: {
        department: {
          include: {
            university: true
          }
        }
      }
    })

    return NextResponse.json(updatedProgram)
  } catch (error) {
    console.error('Error updating program:', error)
    return NextResponse.json(
      { error: 'Failed to update program' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params
    const programId = parseInt(params.id)
    
    if (isNaN(programId)) {
      return NextResponse.json({ error: 'Invalid program ID' }, { status: 400 })
    }

    await db.program.delete({
      where: { id: programId }
    })

    return NextResponse.json({ message: 'Program deleted successfully' })
  } catch (error) {
    console.error('Error deleting program:', error)
    return NextResponse.json(
      { error: 'Failed to delete program' },
      { status: 500 }
    )
  }
}
