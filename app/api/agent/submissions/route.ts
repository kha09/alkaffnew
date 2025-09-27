import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// TODO: Add authentication middleware to get agent's user ID from session/token

export async function GET(request: NextRequest) {
  try {
    // For now, mock agentId. In production, extract from session/token.
    const agentId = 1;

    // Fetch form submissions assigned to this agent
    const submissions = await prisma.formSubmission.findMany({
      where: { agentId },
      include: {
        uploadedFiles: true,
        orders: true,
      },
      orderBy: { submittedAt: "desc" },
    });

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error("Error fetching agent submissions:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الطلبات" },
      { status: 500 }
    );
  }
}
