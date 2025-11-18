import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

// GET - List all sent emails with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const universityId = searchParams.get('universityId')
    const templateId = searchParams.get('templateId')
    const fromDate = searchParams.get('fromDate')
    const toDate = searchParams.get('toDate')

    // Build where clause
    const where: any = {}
    
    if (status) {
      where.status = status
    }
    
    if (universityId) {
      where.universityId = parseInt(universityId)
    }
    
    if (templateId) {
      where.templateId = parseInt(templateId)
    }
    
    if (fromDate || toDate) {
      where.sentAt = {}
      if (fromDate) {
        where.sentAt.gte = new Date(fromDate)
      }
      if (toDate) {
        where.sentAt.lte = new Date(toDate)
      }
    }

    const sentEmails = await db.sentEmail.findMany({
      where,
      include: {
        template: {
          select: {
            id: true,
            name: true,
            templateType: true
          }
        },
        formSubmission: {
          select: {
            id: true,
            fullName: true,
            email: true,
            nationality: true,
            preferredProgram: true
          }
        },
        university: {
          select: {
            id: true,
            name: true,
            country: true
          }
        }
      },
      orderBy: { sentAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    })

    // Get total count for pagination
    const totalCount = await db.sentEmail.count({ where })

    return NextResponse.json({
      emails: sentEmails,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching sent emails:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sent emails' },
      { status: 500 }
    )
  }
}
