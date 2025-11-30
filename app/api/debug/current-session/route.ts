import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    return NextResponse.json({
      session,
      hasSession: !!session,
      userId: session?.user?.id,
      userRole: session?.user?.role,
      userName: session?.user?.name,
      userEmail: session?.user?.email
    })
  } catch (error: any) {
    console.error('Error getting session:', error)
    return NextResponse.json(
      { error: 'Error getting session', details: error.message },
      { status: 500 }
    )
  }
}
