'use client'


import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { UploadDropzone } from '@/components/ui/upload-dropzone'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { useState } from 'react'
import { Question } from '@/lib/ai/schemas'
import { QuestionEditor } from '@/components/question-editor'

export default function UploadPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [sourceFileName, setSourceFileName] = useState<string>('')

  const handleQuestionsExtracted = (extractedQuestions: Question[], fileName: string) => {
    setQuestions(extractedQuestions)
    setSourceFileName(fileName)
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

        {questions.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Import PDF</CardTitle>
              <CardDescription>
                Drag and drop your PDF file here. We'll process it and extract questions for you to review.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UploadDropzone onQuestionsExtracted={handleQuestionsExtracted} />
            </CardContent>
          </Card>
        ) : (
          <QuestionEditor initialQuestions={questions} sourceFileName={sourceFileName} />
        )}
      </div>
    </div>
  )
}
