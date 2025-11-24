import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    // Check if user is an agent
    if (session.user.role !== 'agent') {
      return NextResponse.json({ error: 'غير مصرح - يجب أن تكون وكيل' }, { status: 403 });
    }

    const userId = parseInt(session.user.id);

    // Find the agent record associated with this user
    // For now, we'll use a simple mapping based on email or use agentId = 1 as fallback
    // In a complete implementation, you'd have a proper User -> Agent relationship
    let agentId = 1; // Default fallback
    
    try {
      // Try to find agent by email matching
      const agent = await prisma.agent.findFirst({
        where: { email: session.user.email || '' }
      });
      if (agent) {
        agentId = agent.id;
      }
    } catch (err) {
      console.log("Could not find agent by email, using default agentId = 1");
    }

    // Fetch form submissions assigned to this agent
    const submissions = await prisma.formSubmission.findMany({
      where: { agentId },
      include: {
        uploadedFiles: true,
        orders: true,
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          }
        }
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
