import { processPdf } from '@/lib/ai/actions'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { UploadDropzone } from '@/components/ui/upload-dropzone'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function UploadPage() {
  const router = useRouter()

  const handleUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const result = await processPdf(formData)
      if (result.success && result.sourceFileId) {
        toast.success('PDF processed successfully!')
        router.push(`/upload/review/${result.sourceFileId}`)
      } else {
        console.error(result.error)
        toast.error('Upload failed: ' + result.error)
      }
    } catch (error) {
      console.error(error)
      toast.error('An unexpected error occurred')
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Upload Question Bank</h1>
          <p className="text-muted-foreground">
            Upload your exam PDFs to automatically extract and organize questions using AI.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Import PDF</CardTitle>
            <CardDescription>
              Drag and drop your PDF file here. We'll process it and extract questions for you to review.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UploadDropzone onUpload={handleUpload} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
