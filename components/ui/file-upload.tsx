'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState, useRef, useEffect } from 'react'

interface FileUploadProps {
  label: string
  value: string | File
  onChange: (value: string | File) => void
  accept?: string
  placeholder?: string
}

export function FileUpload({ label, value, onChange, accept = 'image/*', placeholder }: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // If value is a URL/path, set it as preview
    if (value && typeof value === 'string') {
      setPreview(value)
    } else if (value instanceof File) {
      // If value is a File, create a preview URL
      const url = URL.createObjectURL(value)
      setPreview(url)
      // Clean up the URL when the component unmounts or value changes
      return () => URL.revokeObjectURL(url)
    } else {
      setPreview(null)
    }
  }, [value])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Create preview using URL.createObjectURL
      const url = URL.createObjectURL(file)
      setPreview(url)
      
      // Pass the file to the parent component
      onChange(file)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="grid grid-cols-4 items-start gap-4">
      <Label htmlFor={label} className="text-right pt-2">
        {label}
      </Label>
      <div className="col-span-3">
        <Input
          id={label}
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          className="mb-2"
        />
        {preview && (
          <div className="mt-2">
            <div className="flex items-center gap-2">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-16 h-16 object-cover rounded"
              />
              <button 
                type="button" 
                onClick={handleRemove}
                className="text-sm text-red-500 hover:text-red-700"
              >
                إزالة
              </button>
            </div>
          </div>
        )}
        {placeholder && !preview && (
          <p className="text-sm text-gray-500 mt-1">
            {placeholder}
          </p>
        )}
      </div>
    </div>
  )
}
