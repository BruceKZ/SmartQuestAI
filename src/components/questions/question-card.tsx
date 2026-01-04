'use client'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Edit, Trash, Plus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Question, Tag } from '@prisma/client'
import { TagManager } from './tag-manager'

interface QuestionCardProps {
  question: Question & { tags: Tag[] }
  allTags: Tag[]
}

export function QuestionCard({ question, allTags }: QuestionCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex gap-2">
          <Badge variant={question.type === 'SINGLE' ? 'default' : 'secondary'}>
            {question.type}
          </Badge>

        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Plus className="mr-2 h-4 w-4" />
              Add to List
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="prose dark:prose-invert text-sm line-clamp-4 mb-4">
          {question.content}
        </div>
        <TagManager 
          questionId={question.id} 
          initialTags={question.tags} 
          allTags={allTags} 
        />
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Created {new Date(question.created_at).toLocaleDateString()}
      </CardFooter>
    </Card>
  )
}
