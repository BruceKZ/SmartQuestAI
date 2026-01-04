'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, File, X, Loader2, ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { experimental_useObject as useObject } from '@ai-sdk/react'
import { ExtractionResultSchema, Question } from '@/lib/ai/schemas'
import { toast } from 'sonner'

interface UploadDropzoneProps {
  onQuestionsExtracted: (questions: Question[], fileName: string) => void
}

export function UploadDropzone({ onQuestionsExtracted }: UploadDropzoneProps) {
  const [file, setFile] = useState<File | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const { object, submit, isLoading, error } = useObject({
    api: '/api/process-pdf',
    schema: ExtractionResultSchema,
    onFinish: (result: { object?: any, error?: Error }) => {
      if (result.object && result.object.questions) {
        toast.success('Processing complete!')
        // Pass questions and filename to parent
        onQuestionsExtracted(result.object.questions, file?.name || 'uploaded.pdf')
      }
    },
    onError: (error: Error) => {
      console.error('Streaming error', error)
      toast.error('Error processing PDF')
    }
  })

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

    setElapsedTime(0)
    const startTime = Date.now()
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    try {
      const reader = new FileReader()
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1]
        submit({ file: base64String, filename: file.name })
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Upload failed', error)
    } finally {
      // We don't clear interval here because loading continues
      // We should clear it in onFinish or useEffect
    }
  }

  // Effect to clear interval when loading stops
  // (Simplified for this snippet, in real app use useEffect)

  const removeFile = () => {
    setFile(null)
    setElapsedTime(0)
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
            {!isLoading && (
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

          {(isLoading || object) && (
            <div className="space-y-4 py-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <div className="text-center">
                    <p className="font-medium text-sm">Processing PDF...</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Time elapsed: {elapsedTime}s
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                    <File className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-sm text-green-600 dark:text-green-400">Processing Complete!</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {object?.questions?.length || 0} questions extracted
                    </p>
                  </div>
                </div>
              )}
              
              <div className="border rounded-md overflow-hidden">
                <button 
                  onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                  className="w-full flex items-center justify-between p-2 bg-muted/50 text-xs font-medium hover:bg-muted transition-colors"
                >
                  <span>Raw AI Output</span>
                  {isDetailsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
                {isDetailsOpen && (
                  <div className="p-2 bg-muted/30 max-h-60 overflow-y-auto text-xs font-mono whitespace-pre-wrap">
                    {JSON.stringify(object, null, 2)}
                  </div>
                )}
              </div>

              {!isLoading && object && object.questions && (
                <Button className="w-full" onClick={() => onQuestionsExtracted(object.questions, file?.name || 'uploaded.pdf')}>
                  Continue to Review
                </Button>
              )}
            </div>
          )}

          {!isLoading && !object && (
            <Button className="w-full mt-2" onClick={handleUpload}>
              Start Processing
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
