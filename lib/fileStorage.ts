import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export interface FileStorageConfig {
  basePath: string;
  urlBasePath: string;
}

export interface SaveFileResult {
  filePath: string;
  relativePath: string;
  fileName: string;
}

/**
 * Get file storage configuration based on environment
 */
export function getFileStorageConfig(): FileStorageConfig {
  const fileStoragePath = process.env.FILE_STORAGE_PATH;
  
  if (fileStoragePath && fileStoragePath !== '') {
    // Using mounted storage (e.g., /mpath in railway)
    return {
      basePath: fileStoragePath,
      urlBasePath: '/api/files' // Files will be served via API endpoint
    };
  } else {
    // Fallback to public directory for development
    return {
      basePath: path.join(process.cwd(), 'public', 'uploads'),
      urlBasePath: '/uploads' // Files served directly by Next.js static serving
    };
  }
}

/**
 * Save a file to the configured storage location
 */
export async function saveFile(
  file: File,
  category: string,
  identifier: string | number
): Promise<SaveFileResult> {
  const config = getFileStorageConfig();
  
  // Create category directory path
  const categoryDir = path.join(config.basePath, category);
  
  // Ensure directory exists
  try {
    await mkdir(categoryDir, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
  
  // Generate unique filename
  const timestamp = Date.now();
  const fileExtension = path.extname(file.name);
  const fileName = `${category}_${identifier}_${timestamp}${fileExtension}`;
  const filePath = path.join(categoryDir, fileName);
  
  // Generate relative path for database storage
  const relativePath = config.urlBasePath === '/api/files' 
    ? `${config.urlBasePath}/${category}/${fileName}`
    : `${config.urlBasePath}/${category}/${fileName}`;
  
  // Save file
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(filePath, buffer);
  
  return {
    filePath,
    relativePath,
    fileName
  };
}

/**
 * Get the absolute file path from a relative path
 */
export function getAbsoluteFilePath(relativePath: string): string {
  const config = getFileStorageConfig();
  
  if (config.urlBasePath === '/api/files') {
    // Remove /api/files prefix and construct absolute path
    const pathWithoutPrefix = relativePath.replace('/api/files/', '');
    return path.join(config.basePath, pathWithoutPrefix);
  } else {
    // Remove /uploads prefix and construct absolute path
    const pathWithoutPrefix = relativePath.replace('/uploads/', '');
    return path.join(config.basePath, pathWithoutPrefix);
  }
}

/**
 * Validate file type and size
 */
export function validateFile(file: File, maxSizeMB: number = 5): { isValid: boolean; error?: string } {
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'نوع الملف غير مدعوم. يرجى رفع ملف PDF أو صورة (JPG, PNG)'
    };
  }

  // Validate file size
  const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `حجم الملف كبير جداً. الحد الأقصى ${maxSizeMB} ميجابايت`
    };
  }

  return { isValid: true };
}
