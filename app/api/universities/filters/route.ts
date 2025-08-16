import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET() {
  try {
    // Fetch all universities to get unique locations
    const universities = await db.university.findMany({
      select: {
        country: true,
        freeOfferLetter: true
      }
    })

    // Fetch all programs to get unique qualifications (levels)
    const programs = await db.program.findMany({
      select: {
        qualification: true
      }
    })

    // Extract unique locations
    const locations = [...new Set(universities.map(u => u.country))].filter(Boolean).map(location => ({
      id: location,
      name: location
    }))

    // Extract unique qualifications (levels)
    const levels = [...new Set(programs.map(p => p.qualification))].filter(Boolean).map(level => ({
      id: level.toLowerCase().replace(/\s+/g, '-'),
      name: level
    }))

    // Offer letter fees options (static)
    const offerLetterFees = [
      { id: "all", name: "جميع الأنواع" },
      { id: "free", name: "مجاني" },
      { id: "paid", name: "مدفوع" },
    ]

    return NextResponse.json({
      locations,
      levels,
      offerLetterFees
    })
  } catch (error) {
    console.error('Error fetching filter options:', error)
    return NextResponse.json(
      { error: 'Failed to fetch filter options' },
      { status: 500 }
    )
  }
}
