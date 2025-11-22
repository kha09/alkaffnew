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

    // Fetch submissions for this student
    const submissions = await prisma.formSubmission.findMany({
      where: { userId },
      include: {
        uploadedFiles: true,
        agent: {
          select: {
            name: true,
            email: true,
          }
        }
      },
      orderBy: { submittedAt: "desc" },
    });

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error("Error fetching student submissions:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الطلبات" },
      { status: 500 }
    );
  }
}

// POST /api/student/submissions - Update submission information (for student profile updates)
export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const body = await request.json();
    const { submissionId, updatedInfo } = body;

    // Validate required fields
    if (!submissionId) {
      return NextResponse.json({ error: 'رقم الطلب مطلوب' }, { status: 400 });
    }

    // Check if the submission belongs to this student
    const existingSubmission = await prisma.formSubmission.findFirst({
      where: { 
        id: submissionId,
        userId: userId 
      }
    });

    if (!existingSubmission) {
      return NextResponse.json({ error: 'الطلب غير موجود أو غير مصرح لك بالوصول إليه' }, { status: 404 });
    }

    // Only allow updates if the submission is still pending or under review
    if (existingSubmission.submissionStatus !== "submitted" && existingSubmission.submissionStatus !== "approved_by_admin") {
      return NextResponse.json({ error: 'لا يمكن تعديل هذا الطلب في الوقت الحالي' }, { status: 400 });
    }

    // Update the submission
    const updatedSubmission = await prisma.formSubmission.update({
      where: { id: submissionId },
      data: updatedInfo,
      include: {
        uploadedFiles: true,
        agent: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    });

    return NextResponse.json(updatedSubmission);
  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث الطلب' },
      { status: 500 }
    );
  }
}
