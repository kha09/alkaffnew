import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import bcrypt from 'bcrypt'

// GET /api/admin/agents/[id] - Get a single agent
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params
  const id = parseInt(idParam)
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
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params
  const id = parseInt(idParam)
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

  // Validate password if provided
  if (data.password && data.password.length < 6) {
    return NextResponse.json({ error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' }, { status: 400 })
  }

  // Hash password if provided
  let hashedPassword = existingAgent.password
  let plainPassword = null
  if (data.password) {
    hashedPassword = await bcrypt.hash(data.password, 10)
    plainPassword = data.password // Store for response
  }

  const agent = await prisma.agent.update({
    where: { id },
    data: {
      name: data.name || existingAgent.name,
      email: data.email || existingAgent.email,
      phone: data.phone !== undefined ? data.phone : existingAgent.phone,
      password: hashedPassword
    }
  })

  // Return agent data with plain password for admin to see if password was updated
  const response = {
    ...agent,
    password: undefined, // Don't return hashed password
    plainPassword: plainPassword // Return plain password for admin if updated
  }

  return NextResponse.json(response)
}

// DELETE /api/admin/agents/[id] - Delete an agent
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params
  const id = parseInt(idParam)
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
