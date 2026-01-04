import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const sourceFile = await prisma.sourceFile.findUnique({
    where: { id },
    include: {
      questions: true
    }
  })

  if (!sourceFile) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Review Questions</h1>
      <div className="grid gap-6">
        {sourceFile.questions.map((question: any) => (
          <div key={question.id} className="border p-4 rounded-lg">
            <div className="font-semibold mb-2">{question.type}</div>
            <div className="prose dark:prose-invert">
              {question.content}
            </div>
            {question.options && (
              <div className="mt-4 pl-4 border-l-2">
                <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  {question.options as string}
                </pre>
              </div>
            )}
            <div className="mt-4 text-sm text-green-600">
              Answer: {JSON.stringify(question.answer)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
