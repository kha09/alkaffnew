import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    const body = await request.json();
    const { orderId, invoicePath, fileName } = body;

    // Validate required fields
    if (!orderId || !invoicePath) {
      return NextResponse.json({ error: 'رقم الطلب ومسار الفاتورة مطلوبان' }, { status: 400 });
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

    // Update the order with the invoice path
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        invoice: invoicePath,
        // Optionally update payment status to indicate invoice uploaded
        // paymentStatus: "pending_verification"
      }
    });

    return NextResponse.json({ 
      message: 'تم رفع الفاتورة بنجاح',
      order: updatedOrder 
    });
  } catch (error) {
    console.error('Error uploading payment invoice:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء رفع الفاتورة' },
      { status: 500 }
    );
  }
}

// GET /api/student/payments - Get payment history for student
export async function GET(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    // Fetch orders with payment information for this student
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        formSubmission: {
          select: {
            fullName: true,
            preferredProgram: true,
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

    // Calculate payment statistics
    const totalOrders = orders.length;
    const paidOrders = orders.filter((order: any) => order.paymentStatus === "paid").length;
    const unpaidOrders = orders.filter((order: any) => order.paymentStatus === "unpaid").length;

    return NextResponse.json({ 
      orders,
      statistics: {
        total: totalOrders,
        paid: paidOrders,
        unpaid: unpaidOrders
      }
    });
  } catch (error) {
    console.error("Error fetching student payment history:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب سجل المدفوعات" },
      { status: 500 }
    );
  }
}
