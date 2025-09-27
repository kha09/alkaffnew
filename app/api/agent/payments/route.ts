import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// TODO: Add authentication middleware to get agent's user ID from session/token

export async function GET(request: NextRequest) {
  try {
    // For now, mock agentId. In production, extract from session/token.
    const agentId = 1;

    // Fetch orders/payments for this agent
    const payments = await prisma.order.findMany({
      where: { agentId },
      select: {
        id: true,
        formSubmission: { select: { fullName: true } },
        price: true,
        status: true,
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
