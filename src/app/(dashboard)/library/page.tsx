import { getQuestions, getAllTags } from '@/lib/actions/questions'
import { QuestionCard } from '@/components/questions/question-card'

export const dynamic = 'force-dynamic'

export default async function LibraryPage() {
  const { questions, total } = await getQuestions()
  const allTags = await getAllTags()

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Question Library</h1>
          <p className="text-muted-foreground">
            {total} questions in your bank
          </p>
        </div>
        {/* Filters will go here */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {questions.map((question: any) => (
          <QuestionCard key={question.id} question={question} allTags={allTags} />
        ))}
      </div>
    </div>
  )
}
