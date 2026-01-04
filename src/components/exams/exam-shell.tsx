'use client'

import { useEffect } from 'react'
import { useExamStore } from '@/lib/store/exam-store'
import { ExamTimer } from './exam-timer'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, ChevronRight, Flag } from 'lucide-react'
import { Question } from '@prisma/client'
import { cn } from '@/lib/utils'

interface ExamShellProps {
  questions: Question[]
  initialTimeSeconds: number
}

export function ExamShell({ questions, initialTimeSeconds }: ExamShellProps) {
  const { 
    currentQuestionIndex, 
    setQuestionIndex, 
    setTimeRemaining, 
    status,
    answers,
    setAnswer
  } = useExamStore()

  // Initialize timer only once on mount
  useEffect(() => {
    setTimeRemaining(initialTimeSeconds)
  }, [initialTimeSeconds, setTimeRemaining])

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  if (status === 'PAUSED') {
    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Exam Paused</h2>
          <ExamTimer />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-semibold">SmartQuest Exam</span>
            <div className="h-4 w-px bg-border" />
            <span className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>
          <ExamTimer />
        </div>
        <Progress value={progress} className="h-1 rounded-none" />
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-background rounded-xl shadow-sm border p-8 min-h-[400px]">
          <div className="flex justify-between items-start mb-6">
            <div className="prose dark:prose-invert max-w-none">
              {currentQuestion.content}
            </div>
            <Button variant="ghost" size="icon">
              <Flag className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>

          {/* Options / Input Area */}
          <div className="space-y-4 mt-8">
            {currentQuestion.type === 'SINGLE' && currentQuestion.options && (
              <div className="grid gap-3">
                {JSON.parse(currentQuestion.options as string).map((opt: any) => (
                  <div
                    key={opt.id}
                    className={cn(
                      "flex items-center p-4 rounded-lg border cursor-pointer transition-colors hover:bg-accent",
                      answers[currentQuestion.id] === opt.id && "border-primary bg-primary/5 ring-1 ring-primary"
                    )}
                    onClick={() => setAnswer(currentQuestion.id, opt.id)}
                  >
                    <div className={cn(
                      "h-6 w-6 rounded-full border flex items-center justify-center mr-4 text-sm font-medium",
                      answers[currentQuestion.id] === opt.id ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground"
                    )}>
                      {opt.id}
                    </div>
                    <span>{opt.content}</span>
                  </div>
                ))}
              </div>
            )}
            {/* Add other question types handling here */}
          </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="bg-background border-t p-4">
        <div className="container mx-auto max-w-4xl flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => setQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            {/* Question Palette Dots could go here */}
          </div>

          <Button
            onClick={() => setQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </footer>
    </div>
  )
}
