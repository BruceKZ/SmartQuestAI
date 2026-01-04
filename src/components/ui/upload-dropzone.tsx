'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, File, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface UploadDropzoneProps {
  onUpload: (file: File) => Promise<void>
}

export function UploadDropzone({ onUpload }: UploadDropzoneProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    multiple: false,
  })

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate progress for better UX
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        return prev + 10
      })
    }, 500)

    try {
      await onUpload(file)
      setUploadProgress(100)
    } catch (error) {
      console.error('Upload failed', error)
      // Handle error state here
    } finally {
      clearInterval(interval)
      setIsUploading(false)
    }
  }

  const removeFile = () => {
    setFile(null)
    setUploadProgress(0)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!file ? (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-lg p-10 transition-colors cursor-pointer flex flex-col items-center justify-center gap-4',
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 hover:border-primary hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900'
          )}
        >
          <input {...getInputProps()} />
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
            <UploadCloud className="h-8 w-8 text-gray-500 dark:text-gray-400" />
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
              {isDragActive ? 'Drop the PDF here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              PDF (up to 10MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-6 bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <File className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate max-w-[200px]">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            {!isUploading && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile()
                }}
              >
                <X className="h-4 w-4 text-gray-500" />
              </Button>
            )}
          </div>

          {isUploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-center text-gray-500 animate-pulse">
                Processing PDF...
              </p>
            </div>
          )}

          {!isUploading && (
            <Button className="w-full mt-2" onClick={handleUpload}>
              Start Processing
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
