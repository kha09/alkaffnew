import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { University } from '@/lib/types'
import fs from 'fs/promises'
import path from 'path'

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params
    const universityId = parseInt(params.id)
    
    if (isNaN(universityId)) {
      return NextResponse.json({ error: 'Invalid university ID' }, { status: 400 })
    }

    // Parse query parameters for filtering
    const { searchParams } = new URL(request.url)
    const searchQuery = searchParams.get('search') || ''
    const departmentId = searchParams.get('department') || ''
    const duration = searchParams.get('duration') || ''

    // Build the query conditions for departments and programs
    const departmentWhere: any = {
      universityId: universityId
    }

    // If department filter is applied, filter departments
    if (departmentId && departmentId !== 'all') {
      departmentWhere.id = parseInt(departmentId)
    }

    // Build the query conditions for programs
    const programWhere: any = {}

    // Add search condition
    if (searchQuery) {
      programWhere.OR = [
        { name: { contains: searchQuery } },
        { description: { contains: searchQuery } }
      ]
    }

    // If duration filter is applied, filter programs by duration
    if (duration && duration !== 'all') {
      programWhere.duration = duration
    }

    const university = await db.university.findUnique({
      where: { id: universityId },
      include: {
        departments: {
          where: departmentWhere,
          include: {
            programs: {
              where: programWhere
            }
          }
        }
      }
    })

    if (!university) {
      return NextResponse.json({ error: 'University not found' }, { status: 404 })
    }

    return NextResponse.json(university)
  } catch (error) {
    console.error('Error fetching university details:', error)
    return NextResponse.json({ error: 'Failed to fetch university details' }, { status: 500 })
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params
    const universityId = parseInt(params.id)
    
    if (isNaN(universityId)) {
      return NextResponse.json({ error: 'Invalid university ID' }, { status: 400 })
    }

    // Parse form data
    const formData = await request.formData();
    
    // Extract university data from form data
    const universityJson = formData.get('university') as string;
    const universityData: any = JSON.parse(universityJson);
    
    // Handle logo file upload
    let logoPath = universityData.logo; // Default to existing logo URL if no file is uploaded
    const logoFile = formData.get('logo') as File | null;
    
    if (logoFile && logoFile.size > 0) {
      // Generate unique filename
      const fileExtension = logoFile.name.split('.').pop();
      const fileName = `university-${Date.now()}.${fileExtension}`;
      const filePath = path.join(process.cwd(), 'public', 'images', 'universities', fileName);
      
      // Save file to disk
      const fileBuffer = Buffer.from(await logoFile.arrayBuffer());
      await fs.writeFile(filePath, fileBuffer);
      
      // Set logo path to be stored in database
      logoPath = `/images/universities/${fileName}`;
    }
    
    // Remove fields that are computed or have default values
    const { id, nameEn, location, tuitionFee, currency, courses, rating, popular, featured, specializations, departments, logo, ...universityFields } = universityData;
    
    const updatedUniversity = await db.university.update({
      where: { id: universityId },
      data: {
        ...universityFields,
        logo: logoPath
      }
    });

    return NextResponse.json(updatedUniversity);
  } catch (error) {
    console.error('Error updating university:', error);
    return NextResponse.json(
      { error: 'Failed to update university' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params
    const universityId = parseInt(params.id)
    
    if (isNaN(universityId)) {
      return NextResponse.json({ error: 'Invalid university ID' }, { status: 400 })
    }

    await db.university.delete({
      where: { id: universityId }
    })

    return NextResponse.json({ message: 'University deleted successfully' })
  } catch (error) {
    console.error('Error deleting university:', error)
    return NextResponse.json(
      { error: 'Failed to delete university' },
      { status: 500 }
    )
  }
}
