import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
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
