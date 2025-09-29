import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET /api/test-mock - Test endpoint to verify mock database is working
export async function GET(request: NextRequest) {
  try {
    // Test fetching universities
    const universities = await prisma.university.findMany()
    
    // Test fetching programs
    const programs = await prisma.program.findMany()
    
    // Test fetching agents
    const agents = await prisma.agent.findMany()
    
    // Test fetching orders
    const orders = await prisma.order.findMany()
    
    return NextResponse.json({
      success: true,
      universities: universities.length,
      programs: programs.length,
      agents: agents.length,
      orders: orders.length,
      message: "Mock database is working correctly!"
    })
  } catch (error) {
    console.error('Error testing mock database:', error)
    return NextResponse.json(
      { error: 'Failed to test mock database', details: (error as Error).message },
      { status: 500 }
    )
  }
}
