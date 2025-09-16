import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData()
    
    // Extract form fields
    const fullName = formData.get('fullName') as string
    const nationality = formData.get('nationality') as string
    const email = formData.get('email') as string
    const countryOfResidence = formData.get('countryOfResidence') as string
    const contactNumber = formData.get('contactNumber') as string
    const cityOfResidence = formData.get('cityOfResidence') as string
    const preferredProgram = formData.get('preferredProgram') as string
    const universityId = formData.get('universityId') as string | null
    const programId = formData.get('programId') as string | null
    
    // Validate required fields
    if (!fullName || !nationality || !email || !countryOfResidence || 
        !contactNumber || !cityOfResidence || !preferredProgram) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      )
    }
    
    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      console.error('Error creating upload directory:', error)
    }
    
    // Process uploaded files
    const uploadedFiles = []
    const fileFields = ['highSchoolCertificate', 'personalPhoto', 'passport', 'additionalDocuments']
    
    for (const fieldName of fileFields) {
      const file = formData.get(fieldName) as File | null
      
      if (file && file.size > 0) {
        // Generate unique filename
        const fileExtension = file.name.split('.').pop()
        const uniqueFilename = `${uuidv4()}.${fileExtension}`
        const filePath = join(uploadDir, uniqueFilename)
        
        // Convert File to Buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        
        // Save file to disk
        await writeFile(filePath, buffer)
        
        // Save file metadata to database
        const fileRecord = await prisma.uploadedFile.create({
          data: {
            filename: uniqueFilename,
            originalName: file.name,
            path: `/uploads/${uniqueFilename}`,
            size: file.size,
            type: file.type,
          }
        })
        
        uploadedFiles.push(fileRecord)
      }
    }
    
    // Create form submission record
    const formSubmission = await prisma.formSubmission.create({
      data: {
        fullName,
        nationality,
        email,
        countryOfResidence,
        contactNumber,
        cityOfResidence,
        preferredProgram,
        universityId: universityId ? parseInt(universityId) : null,
        programId: programId ? parseInt(programId) : null,
      }
    })
    
    // Connect uploaded files to the form submission
    for (const file of uploadedFiles) {
      await prisma.uploadedFile.update({
        where: { id: file.id },
        data: {
          formSubmission: {
            connect: { id: formSubmission.id }
          }
        }
      })
    }
    
    // Fetch the complete form submission with uploaded files
    const completeFormSubmission = await prisma.formSubmission.findUnique({
      where: { id: formSubmission.id },
      include: { uploadedFiles: true }
    })
    
    return NextResponse.json(completeFormSubmission, { status: 201 })
  } catch (error) {
    console.error('Error processing form submission:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء معالجة الطلب' },
      { status: 500 }
    )
  }
}
