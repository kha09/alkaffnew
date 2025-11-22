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

    const userId = parseInt(session.user.id);

    // Fetch orders for this student
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        user: true,
        formSubmission: {
          select: {
            fullName: true,
            preferredProgram: true,
            email: true,
            contactNumber: true,
          }
        },
        agent: {
          select: {
            name: true,
            email: true,
          }
        }
      },
      orderBy: { dateCreated: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching student orders:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الطلبات" },
      { status: 500 }
    );
  }
}

// POST /api/student/orders - Update order information (for student profile updates)
export async function POST(request: NextRequest) {
  try {
    // For now, mock userId. In production, extract from session/token.
    const userId = 1;

    const body = await request.json();
    const { orderId, updatedInfo } = body;

    // Validate required fields
    if (!orderId) {
      return NextResponse.json({ error: 'رقم الطلب مطلوب' }, { status: 400 });
    }

    // Check if the order belongs to this student
    const existingOrder = await prisma.order.findFirst({
      where: { 
        id: orderId,
        userId: userId 
      }
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'الطلب غير موجود أو غير مصرح لك بالوصول إليه' }, { status: 404 });
    }

    // Only allow updates if the order is still pending or under review
    if (existingOrder.adminStatus !== "Pending" && existingOrder.adminStatus !== "Under Review") {
      return NextResponse.json({ error: 'لا يمكن تعديل هذا الطلب في الوقت الحالي' }, { status: 400 });
    }

    // Update the form submission associated with this order
    if (existingOrder.formSubmissionId && updatedInfo) {
      await prisma.formSubmission.update({
        where: { id: existingOrder.formSubmissionId },
        data: updatedInfo
      });
    }

    // Fetch the updated order
    const updatedOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        formSubmission: true,
        agent: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث الطلب' },
      { status: 500 }
    );
  }
}
