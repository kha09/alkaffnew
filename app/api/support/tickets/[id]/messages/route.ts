import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

// GET /api/support/tickets/[id]/messages - Get messages for a ticket
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const ticketId = parseInt(id)
    if (isNaN(ticketId)) {
      return NextResponse.json({ error: 'Invalid ticket ID' }, { status: 400 })
    }

    // Check if ticket exists and user has access
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
      select: {
        id: true,
        createdById: true,
        assignedToId: true
      }
    })

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    // Check permissions
    const userId = parseInt(session.user.id)
    const canAccess = 
      session.user.role === 'admin' ||
      ticket.createdById === userId ||
      ticket.assignedToId === userId

    if (!canAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get messages
    let messages = await prisma.supportTicketMessage.findMany({
      where: { ticketId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true
          }
        }
      }
    })

    // Filter internal messages for non-admin users
    if (session.user.role !== 'admin') {
      messages = messages.filter((msg: any) => !msg.isInternal)
    }

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الرسائل' },
      { status: 500 }
    )
  }
}

// POST /api/support/tickets/[id]/messages - Add message to ticket
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const ticketId = parseInt(id)
    if (isNaN(ticketId)) {
      return NextResponse.json({ error: 'Invalid ticket ID' }, { status: 400 })
    }

    const body = await request.json()
    const { message, isInternal, attachments } = body

    // Validate required fields
    if (!message || message.trim() === '') {
      return NextResponse.json(
        { error: 'الرسالة مطلوبة' },
        { status: 400 }
      )
    }

    // Check if ticket exists and user has access
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
      select: {
        id: true,
        createdById: true,
        assignedToId: true,
        status: true
      }
    })

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    // Check permissions
    const userId = parseInt(session.user.id)
    const canMessage = 
      session.user.role === 'admin' ||
      ticket.createdById === userId ||
      ticket.assignedToId === userId

    if (!canMessage) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Only admins and agents can send internal messages
    const finalIsInternal = (isInternal && (session.user.role === 'admin' || session.user.role === 'agent')) || false

    // Create the message
    const newMessage = await prisma.supportTicketMessage.create({
      data: {
        ticketId,
        senderId: userId,
        message: message.trim(),
        isInternal: finalIsInternal,
        attachments: attachments ? JSON.stringify(attachments) : null
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true
          }
        }
      }
    })

    // Update ticket status if it was closed and a new message is added
    if (ticket.status === 'closed') {
      await prisma.supportTicket.update({
        where: { id: ticketId },
        data: { status: 'open' }
      })
    }

    return NextResponse.json(newMessage, { status: 201 })
  } catch (error) {
    console.error('Error creating message:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إرسال الرسالة' },
      { status: 500 }
    )
  }
}
