import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { University } from '@/lib/types'
import formidable from 'formidable'
import fs from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    const universities = await db.university.findMany({
      orderBy: { order: 'asc' },
      include: {
        departments: true
      }
    })

    // Add default values for optional properties
    const universitiesWithDefaults = universities.map(university => ({
      ...university,
      nameEn: university.name,
      location: university.country,
      tuitionFee: "15,000",
      currency: "RM",
      courses: 100,
      rating: 4.5,
      popular: true,
      featured: false,
      specializations: university.departments?.map(department => department.name) || [],
      students: university.students
    }))

    return NextResponse.json(universitiesWithDefaults)
  } catch (error) {
    console.error('Error fetching universities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch universities' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
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
    
    const newUniversity = await db.university.create({
      data: {
        ...universityFields,
        logo: logoPath,
        order: 0 // Default order value
      }
    });

    return NextResponse.json(newUniversity, { status: 201 });
  } catch (error) {
    console.error('Error creating university:', error);
    return NextResponse.json(
      { error: 'Failed to create university' },
      { status: 500 }
    );
  }
}
