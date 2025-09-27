import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET /api/admin/agents/[id] - Get a single agent
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }
  const agent = await prisma.agent.findUnique({ where: { id } })
  if (!agent) {
    return NextResponse.json({ error: 'الوكيل غير موجود' }, { status: 404 })
  }
  return NextResponse.json(agent)
}

// PUT /api/admin/agents/[id] - Update an agent
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }
  const data = await request.json()
  const existingAgent = await prisma.agent.findUnique({ where: { id } })
  if (!existingAgent) {
    return NextResponse.json({ error: 'الوكيل غير موجود' }, { status: 404 })
  }
  // Check if another agent with this email already exists
  if (data.email && data.email !== existingAgent.email) {
    const agentWithSameEmail = await prisma.agent.findUnique({ where: { email: data.email } })
    if (agentWithSameEmail) {
      return NextResponse.json({ error: 'وكيل مع هذا البريد الإلكتروني موجود بالفعل' }, { status: 400 })
    }
  }
  const agent = await prisma.agent.update({
    where: { id },
    data: {
      name: data.name || existingAgent.name,
      email: data.email || existingAgent.email,
      phone: data.phone !== undefined ? data.phone : existingAgent.phone
    }
  })
  return NextResponse.json(agent)
}

// DELETE /api/admin/agents/[id] - Delete an agent
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }
  const existingAgent = await prisma.agent.findUnique({ where: { id } })
  if (!existingAgent) {
    return NextResponse.json({ error: 'الوكيل غير موجود' }, { status: 404 })
  }
  await prisma.agent.delete({ where: { id } })
  return NextResponse.json({ message: 'تم حذف الوكيل بنجاح' })
}
