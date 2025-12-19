import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    if (session.user.role !== 'agent') {
      return NextResponse.json({ error: 'غير مصرح للوصول' }, { status: 403 })
    }

    // Get the agent record using the user's email
    const agent = await prisma.agent.findUnique({
      where: { email: session.user.email! }
    })

    if (!agent) {
      return NextResponse.json({ error: 'الوكيل غير موجود' }, { status: 404 })
    }

    // Fetch orders/payments for this agent
    const payments = await prisma.order.findMany({
      where: { agentId: agent.id },
      select: {
        id: true,
        formSubmission: { select: { fullName: true } },
        agentStatus: true,
        adminStatus: true,
        paymentStatus: true,
        dateCreated: true,
        createdAt: true,
      },
      orderBy: { dateCreated: "desc" },
    });

    return NextResponse.json({ payments });
  } catch (error) {
    console.error("Error fetching agent payments:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب المدفوعات" },
      { status: 500 }
    );
  }
}
