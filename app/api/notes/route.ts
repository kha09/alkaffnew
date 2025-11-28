import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import db from '@/lib/db'

// GET - Get notes for current user (agent or student)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = parseInt(session.user.id)
    const userRole = session.user.role

    // Only agents and students can receive notes
    if (userRole !== 'agent' && userRole !== 'student') {
      return NextResponse.json(
        { error: 'Only agents and students can receive notes' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    // Find notes where user is in the recipient list
    const notes = await db.sentNote.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                recipientType: userRole === 'agent' ? 'agents' : 'students'
              },
              {
                recipientType: 'all'
              }
            ]
          },
          {
            OR: [
              { expiresAt: null },
              { expiresAt: { gt: new Date() } }
            ]
          }
        ]
      },
      orderBy: { sentAt: 'desc' },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        template: {
          select: {
            id: true,
            title: true,
            category: true
          }
        }
      }
    })

    // Filter notes where current user is in recipient list and apply read filter
    const userNotes = notes.filter((note: any) => {
      const recipientIds = JSON.parse(note.recipientIds)
      const readStatus = JSON.parse(note.readStatus)
      const isRecipient = recipientIds.includes(userId)
      const isRead = readStatus[userId.toString()] !== undefined

      if (!isRecipient) return false
      if (unreadOnly && isRead) return false

      return true
    }).map((note: any) => {
      const readStatus = JSON.parse(note.readStatus)
      const isRead = readStatus[userId.toString()] !== undefined
      const readAt = isRead ? readStatus[userId.toString()] : null

      return {
        ...note,
        isRead,
        readAt
      }
    })

    return NextResponse.json(userNotes)
  } catch (error) {
    console.error('Error fetching user notes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    )
  }
}

// PUT - Mark note as read
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = parseInt(session.user.id)
    const userRole = session.user.role

    // Only agents and students can mark notes as read
    if (userRole !== 'agent' && userRole !== 'student') {
      return NextResponse.json(
        { error: 'Only agents and students can mark notes as read' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { noteId } = body

    if (!noteId) {
      return NextResponse.json(
        { error: 'Note ID is required' },
        { status: 400 }
      )
    }

    // Find the note
    const note = await db.sentNote.findUnique({
      where: { id: noteId }
    })

    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      )
    }

    // Check if user is a recipient
    const recipientIds = JSON.parse(note.recipientIds)
    if (!recipientIds.includes(userId)) {
      return NextResponse.json(
        { error: 'You are not a recipient of this note' },
        { status: 403 }
      )
    }

    // Update read status
    const readStatus = JSON.parse(note.readStatus)
    readStatus[userId.toString()] = new Date().toISOString()

    await db.sentNote.update({
      where: { id: noteId },
      data: {
        readStatus: JSON.stringify(readStatus)
      }
    })

    return NextResponse.json({ message: 'Note marked as read' })
  } catch (error) {
    console.error('Error marking note as read:', error)
    return NextResponse.json(
      { error: 'Failed to mark note as read' },
      { status: 500 }
    )
  }
}
