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
