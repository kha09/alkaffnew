import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { getAbsoluteFilePath, getFileStorageConfig } from '@/lib/fileStorage'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params
    
    // Reconstruct the file path
    const relativePath = `/api/files/${pathSegments.join('/')}`
    
    // Get absolute file path
    const absolutePath = getAbsoluteFilePath(relativePath)
    
    // Security check: ensure the path is within the allowed storage directory
    const config = getFileStorageConfig()
    const normalizedStoragePath = path.resolve(config.basePath)
    const normalizedFilePath = path.resolve(absolutePath)
    
    if (!normalizedFilePath.startsWith(normalizedStoragePath)) {
      return NextResponse.json({ error: 'غير مصرح بالوصول' }, { status: 403 })
    }
    
    // Read the file
    const fileBuffer = await readFile(absolutePath)
    
    // Determine content type based on file extension
    const fileExtension = path.extname(absolutePath).toLowerCase()
    let contentType = 'application/octet-stream'
    
    switch (fileExtension) {
      case '.pdf':
        contentType = 'application/pdf'
        break
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg'
        break
      case '.png':
        contentType = 'image/png'
        break
    }
    
    // Return the file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    })
    
  } catch (error) {
    console.error('Error serving file:', error)
    
    // Check if it's a file not found error
    if ((error as any).code === 'ENOENT') {
      return NextResponse.json({ error: 'الملف غير موجود' }, { status: 404 })
    }
    
    return NextResponse.json({ error: 'حدث خطأ أثناء تحميل الملف' }, { status: 500 })
  }
}
