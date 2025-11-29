import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

// GET /api/support/tickets/[id] - Get ticket details with messages
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

    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true
          }
        },
        assignedTo: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true
          }
        },
        messages: {
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
        }
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

    // Filter internal messages for non-admin users
    if (session.user.role !== 'admin') {
      ticket.messages = ticket.messages.filter((msg: any) => !msg.isInternal)
    }

    return NextResponse.json(ticket)
  } catch (error) {
    console.error('Error fetching ticket:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب التذكرة' },
      { status: 500 }
    )
  }
}

// PUT /api/support/tickets/[id] - Update ticket (status, assignment, etc.)
export async function PUT(
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
    const { status, assignedToId, priority, category } = body

    // Get the current ticket
    const currentTicket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
      include: {
        createdBy: { select: { id: true, role: true } }
      }
    })

    if (!currentTicket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    // Check permissions
    const userId = parseInt(session.user.id)
    const canUpdate = 
      session.user.role === 'admin' ||
      (session.user.role === 'agent' && currentTicket.assignedToId === userId) ||
      currentTicket.createdById === userId

    if (!canUpdate) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Prepare update data
    const updateData: any = {}
    
    if (status !== undefined) {
      updateData.status = status
    }
    
    if (assignedToId !== undefined && session.user.role === 'admin') {
      updateData.assignedToId = assignedToId
    }
    
    if (priority !== undefined && (session.user.role === 'admin' || currentTicket.createdById === userId)) {
      updateData.priority = priority
    }
    
    if (category !== undefined && (session.user.role === 'admin' || currentTicket.createdById === userId)) {
      updateData.category = category
    }

    // Update the ticket
    const updatedTicket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: updateData,
      include: {
        createdBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true
          }
        },
        assignedTo: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true
          }
        },
        _count: {
          select: {
            messages: true
          }
        }
      }
    })

    return NextResponse.json(updatedTicket)
  } catch (error) {
    console.error('Error updating ticket:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث التذكرة' },
      { status: 500 }
    )
  }
}

// DELETE /api/support/tickets/[id] - Delete ticket (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const ticketId = parseInt(id)
    if (isNaN(ticketId)) {
      return NextResponse.json({ error: 'Invalid ticket ID' }, { status: 400 })
    }

    // Check if ticket exists
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId }
    })

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    // Delete the ticket (messages will be deleted automatically due to cascade)
    await prisma.supportTicket.delete({
      where: { id: ticketId }
    })

    return NextResponse.json({ message: 'Ticket deleted successfully' })
  } catch (error) {
    console.error('Error deleting ticket:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حذف التذكرة' },
      { status: 500 }
    )
  }
}
