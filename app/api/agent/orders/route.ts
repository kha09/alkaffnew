import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// TODO: Add authentication middleware to get agent's user ID from session/token

export async function GET(request: NextRequest) {
  try {
    // For now, mock agentId. In production, extract from session/token.
    const agentId = 1;

    // Fetch orders assigned to this agent
    const orders = await prisma.order.findMany({
      where: { agentId },
      include: {
        user: true,
        formSubmission: true,
      },
      orderBy: { dateCreated: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching agent orders:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الطلبات" },
      { status: 500 }
    );
  }
}

// POST /api/agent/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    // For now, mock agentId. In production, extract from session/token.
    const agentId = 1;

    const body = await request.json();
    
    const { userId } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json({ error: 'المستخدم مطلوب' }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        userId,
        agentId,
        agentStatus: 'Created by Agent',
        adminStatus: 'Pending',
        paymentStatus: 'unpaid',
        dateCreated: new Date()
      },
      include: {
        user: true,
        formSubmission: true,
      }
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء الطلب' },
      { status: 500 }
    );
  }
}
