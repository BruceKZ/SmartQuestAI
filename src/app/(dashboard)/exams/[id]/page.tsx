import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ExamShell } from '@/components/exams/exam-shell'

export default async function ExamPage({ params }: { params: { id: string } }) {
  const { id } = await params

  // Fetch the exam session or problem list
  // For now, assuming we are taking a "Problem List" as an exam
  const problemList = await prisma.problemList.findUnique({
    where: { id },
    include: {
      questions: true
    }
  })

  if (!problemList) {
    notFound()
  }

  // Default 60 seconds per question for now
  const initialTime = problemList.questions.length * 60

  return (
    <ExamShell 
      questions={problemList.questions} 
      initialTimeSeconds={initialTime} 
    />
  )
}
