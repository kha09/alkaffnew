import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// PUT /api/admin/form-submissions/:id - Update a form submission
export async function PUT(request: NextRequest) {
  try {
    // Check if user is admin (would need to implement auth)
    // const session = await getServerSession(authOptions)
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const id = parseInt(request.nextUrl.pathname.split('/').pop() || '')
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const data = await request.json()
    
    // Prepare update data
    const updateData: any = {}
    
    if (data.agentId !== undefined) {
      updateData.agentId = data.agentId === 'unassigned' ? null : parseInt(data.agentId)
    }
    
    if (data.orderStage !== undefined) {
      updateData.orderStage = data.orderStage
    }
    
    // Add other fields that can be updated as needed
    
    // Update the form submission
    const updatedSubmission = await prisma.formSubmission.update({
      where: { id },
      data: updateData,
      include: {
        uploadedFiles: true,
        agent: true,
        user: true
      }
    })

    return NextResponse.json(updatedSubmission)
  } catch (error) {
    console.error('Error updating form submission:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث الطلب' },
      { status: 500 }
    )
  }
}
