'use client'

import { useState } from 'react'
import { Question } from '@/lib/ai/schemas'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Save, Trash2, CheckSquare, Square } from 'lucide-react'
import { toast } from 'sonner'
import { saveQuestions } from '@/lib/actions/question'
import { useRouter } from 'next/navigation'
import { QuestionCard } from '@/components/question-card'

interface QuestionEditorProps {
  initialQuestions: Question[]
  sourceFileName: string
}

export function QuestionEditor({ initialQuestions, sourceFileName }: QuestionEditorProps) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions)
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set())
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const handleUpdateQuestion = (index: number, updatedQuestion: Question) => {
    const newQuestions = [...questions]
    newQuestions[index] = updatedQuestion
    setQuestions(newQuestions)
  }

  const handleDeleteQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index)
    setQuestions(newQuestions)
    
    // Update selection indices
    const newSelection = new Set<number>()
    selectedIndices.forEach(i => {
      if (i < index) newSelection.add(i)
      if (i > index) newSelection.add(i - 1)
    })
    setSelectedIndices(newSelection)
  }

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        content: 'New Question',
        type: 'SINGLE',
        options: [],
        answer: '',
        explanation: '',
      },
    ])
  }

  const handleSelect = (index: number, checked: boolean) => {
    const newSelection = new Set(selectedIndices)
    if (checked) {
      newSelection.add(index)
    } else {
      newSelection.delete(index)
    }
    setSelectedIndices(newSelection)
  }

  const handleSelectAll = () => {
    if (selectedIndices.size === questions.length) {
      setSelectedIndices(new Set())
    } else {
      const newSelection = new Set<number>()
      questions.forEach((_, i) => newSelection.add(i))
      setSelectedIndices(newSelection)
    }
  }

  const handleDeleteSelected = () => {
    const newQuestions = questions.filter((_, i) => !selectedIndices.has(i))
    setQuestions(newQuestions)
    setSelectedIndices(new Set())
    toast.success(`Deleted ${selectedIndices.size} questions`)
  }

  const handleSaveSelected = async () => {
    if (selectedIndices.size === 0) {
      toast.error('No questions selected')
      return
    }

    setIsSaving(true)
    const questionsToSave = questions.filter((_, i) => selectedIndices.has(i))

    try {
      const result = await saveQuestions(questionsToSave, sourceFileName)
      if (result.success) {
        toast.success(`Saved ${questionsToSave.length} questions successfully!`)
        // Optionally remove saved questions or redirect
        // For now, we redirect if all were saved, or just show toast
        if (selectedIndices.size === questions.length) {
             router.push('/exams')
        }
      } else {
        toast.error('Failed to save questions: ' + result.error)
      }
    } catch (error) {
      console.error(error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center sticky top-0 bg-background/95 backdrop-blur z-10 py-4 border-b">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Review Questions</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
            <span>{questions.length} Total</span>
            <span>•</span>
            <span>{selectedIndices.size} Selected</span>
          </div>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleAddQuestion}>
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 max-w-4xl mx-auto">
        {questions.map((question, index) => (
          <QuestionCard
            key={index}
            index={index}
            question={question}
            isSelected={selectedIndices.has(index)}
            onSelect={(checked) => handleSelect(index, checked)}
            onUpdate={(updated) => handleUpdateQuestion(index, updated)}
            onDelete={() => handleDeleteQuestion(index)}
            onSave={() => {}} // Individual save not implemented yet, rely on bulk
          />
        ))}
      </div>

      {/* Bulk Actions Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-background border shadow-lg rounded-full px-6 py-3 flex items-center gap-4 z-50">
        <div className="flex items-center gap-2 border-r pr-4">
          <Checkbox 
            checked={selectedIndices.size === questions.length && questions.length > 0}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm font-medium">Select All</span>
        </div>
        
        <Button 
          size="sm" 
          variant="destructive" 
          disabled={selectedIndices.size === 0}
          onClick={handleDeleteSelected}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete ({selectedIndices.size})
        </Button>
        
        <Button 
          size="sm" 
          disabled={selectedIndices.size === 0 || isSaving}
          onClick={handleSaveSelected}
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Saving...' : `Save Selected (${selectedIndices.size})`}
        </Button>
      </div>
    </div>
  )
}
