import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({
      session,
      userId: session?.user?.id,
      userIdType: typeof session?.user?.id,
      userIdParsed: session?.user?.id ? parseInt(session.user.id) : null
    });
  } catch (error) {
    console.error("Debug session error:", error);
    return NextResponse.json({ error: "Debug error" }, { status: 500 });
  }
}
