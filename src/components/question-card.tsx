'use client'

import { useState } from 'react'
import { Question } from '@/lib/ai/schemas'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Edit2, Trash2, Save, X, Check } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { cn } from '@/lib/utils'

interface QuestionCardProps {
  question: Question
  index: number
  isSelected: boolean
  onSelect: (checked: boolean) => void
  onUpdate: (updatedQuestion: Question) => void
  onDelete: () => void
  onSave: () => void
}

export function QuestionCard({
  question,
  index,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onSave
}: QuestionCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedQuestion, setEditedQuestion] = useState<Question>(question)

  const handleSaveEdit = () => {
    onUpdate(editedQuestion)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditedQuestion(question)
    setIsEditing(false)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'SINGLE': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'MULTI': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
      case 'TRUE_FALSE': return 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300'
      case 'ESSAY': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className={cn("transition-all duration-200 hover:shadow-md", isSelected && "ring-2 ring-primary border-primary bg-primary/5")}>
      <CardHeader className="flex flex-row items-start space-y-0 pb-3 gap-4 border-b bg-muted/20">
        <Checkbox 
          checked={isSelected} 
          onCheckedChange={(checked) => onSelect(checked as boolean)}
          className="mt-1.5"
        />
        <div className="flex-1 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {question.id && (
              <Badge variant="outline" className="font-mono">
                #{question.id}
              </Badge>
            )}
            <Badge variant="outline" className={cn("font-semibold", getTypeColor(question.type))}>
              {question.type.replace('_', ' ')}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            {!isEditing ? (
              <>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsEditing(true)}>
                  <Edit2 className="h-4 w-4 text-muted-foreground hover:text-primary" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onDelete}>
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleSaveEdit}>
                  <Check className="h-4 w-4 text-green-600" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleCancelEdit}>
                  <X className="h-4 w-4 text-red-600" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {isEditing ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Question Content</label>
              <Textarea 
                value={editedQuestion.content} 
                onChange={(e) => setEditedQuestion({...editedQuestion, content: e.target.value})}
                className="font-mono text-sm min-h-[100px]"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</label>
                  <Select
                    value={editedQuestion.type}
                    onValueChange={(value) => setEditedQuestion({...editedQuestion, type: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SINGLE">Single Choice</SelectItem>
                      <SelectItem value="MULTI">Multiple Choice</SelectItem>
                      <SelectItem value="TRUE_FALSE">True / False</SelectItem>
                      <SelectItem value="ESSAY">Essay / Short Answer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
            </div>

            {(editedQuestion.type === 'SINGLE' || editedQuestion.type === 'MULTI') && (
               <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Options (JSON List of {"{id, content}"})</label>
                  <Textarea
                    value={JSON.stringify(editedQuestion.options, null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value)
                        setEditedQuestion({...editedQuestion, options: parsed})
                      } catch (e) {
                         // Allow typing
                      }
                    }}
                    className="font-mono text-xs min-h-[150px]"
                  />
               </div>
            )}
             <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Correct Answer</label>
                <Input
                  value={typeof editedQuestion.answer === 'string' ? editedQuestion.answer : JSON.stringify(editedQuestion.answer)}
                  onChange={(e) => setEditedQuestion({...editedQuestion, answer: e.target.value})}
                  placeholder={editedQuestion.type === 'SINGLE' ? 'e.g. "A"' : 'e.g. ["A", "B"]'}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Solution / Explanation</label>
                <Textarea
                  value={editedQuestion.explanation || ''}
                  onChange={(e) => setEditedQuestion({...editedQuestion, explanation: e.target.value})}
                  className="min-h-[100px]"
                />
              </div>
          </div>
        ) : (
          <>
            <div className="prose dark:prose-invert prose-sm max-w-none text-foreground">
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {question.content}
              </ReactMarkdown>
            </div>

            {(question.type === 'SINGLE' || question.type === 'MULTI' || question.type === 'TRUE_FALSE') && question.options && question.options.length > 0 && (
              <div className="grid gap-3">
                {question.options.map((option, i) => {
                  const isCorrect = Array.isArray(question.answer) 
                    ? question.answer.includes(option.id)
                    : question.answer === option.id;
                  
                  return (
                    <div 
                      key={i} 
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg border transition-colors",
                        isCorrect 
                          ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900" 
                          : "bg-card hover:bg-accent/50"
                      )}
                    >
                      <div className={cn(
                        "flex items-center justify-center h-6 w-6 rounded-full border text-xs font-medium shrink-0",
                        isCorrect
                          ? "bg-green-500 border-green-500 text-white"
                          : "bg-muted text-muted-foreground"
                      )}>
                        {option.id}
                      </div>
                      <div className="flex-1 text-sm pt-0.5">
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                          {option.content}
                        </ReactMarkdown>
                      </div>
                      {isCorrect && <Check className="h-4 w-4 text-green-600 shrink-0" />}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Solution Section */}
            {(question.explanation || (question.type === 'ESSAY' && question.answer)) && (
              <div className="mt-6 pt-4 border-t border-dashed">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Solution</span>
                </div>
                
                <div className="bg-muted/30 p-5 rounded-xl text-sm space-y-4 border border-muted/50">
                  {/* For Essay questions, show the Answer first */}
                  {question.type === 'ESSAY' && question.answer && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[10px] text-muted-foreground uppercase tracking-widest">Model Answer</span>
                      </div>
                      <div className="prose dark:prose-invert prose-sm max-w-none text-foreground bg-background/50 p-3 rounded-lg border border-muted/30">
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                          {typeof question.answer === 'string' ? question.answer : JSON.stringify(question.answer)}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                  
                  {/* Show Explanation for all types if it exists */}
                  {question.explanation && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[10px] text-muted-foreground uppercase tracking-widest">
                          {question.type === 'ESSAY' ? 'Detailed Explanation' : 'Explanation'}
                        </span>
                      </div>
                      <div className="prose dark:prose-invert prose-sm max-w-none text-foreground">
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                          {question.explanation}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
