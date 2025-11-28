import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

// PUT /api/student/notes/[id]/read - Mark a note as read
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const noteId = parseInt(params.id)
    const userId = parseInt(session.user.id)

    // Get the current note
    const note = await prisma.sentNote.findUnique({
      where: { id: noteId }
    })

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    // Parse current read status
    let readStatus: any = {}
    try {
      readStatus = JSON.parse(note.readStatus || '{}')
    } catch (e) {
      readStatus = {}
    }

    // Update read status for this user
    readStatus[userId.toString()] = new Date().toISOString()

    // Update the note with new read status
    await prisma.sentNote.update({
      where: { id: noteId },
      data: {
        readStatus: JSON.stringify(readStatus)
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking note as read:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث حالة القراءة' },
      { status: 500 }
    )
  }
}
