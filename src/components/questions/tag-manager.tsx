'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { Tag } from '@prisma/client'
import { addTagToQuestion, removeTagFromQuestion, createTag } from '@/lib/actions/questions'
import { toast } from 'sonner'

interface TagManagerProps {
  questionId: string
  initialTags: Tag[]
  allTags: Tag[]
}

export function TagManager({ questionId, initialTags, allTags }: TagManagerProps) {
  const [open, setOpen] = React.useState(false)
  const [tags, setTags] = React.useState<Tag[]>(initialTags)
  const [inputValue, setInputValue] = React.useState('')

  const handleSelect = async (tag: Tag) => {
    const isSelected = tags.some((t) => t.id === tag.id)
    if (isSelected) {
      // Remove tag
      const result = await removeTagFromQuestion(questionId, tag.id)
      if (result.success) {
        setTags(tags.filter((t) => t.id !== tag.id))
        toast.success('Tag removed')
      } else {
        toast.error('Failed to remove tag')
      }
    } else {
      // Add tag
      const result = await addTagToQuestion(questionId, tag.id)
      if (result.success) {
        setTags([...tags, tag])
        toast.success('Tag added')
      } else {
        toast.error('Failed to add tag')
      }
    }
    setOpen(false)
  }

  const handleCreateTag = async () => {
    if (!inputValue.trim()) return
    const result = await createTag(inputValue)
    if (result.success && result.tag) {
      // Add to question immediately
      const addResult = await addTagToQuestion(questionId, result.tag.id)
      if (addResult.success) {
        setTags([...tags, result.tag])
        toast.success('Tag created and added')
        // Ideally we should update allTags list too, but that comes from server props. 
        // For now, we rely on revalidation or just local state if we had a way to update parent.
        // Since allTags is prop, we can't update it easily without router refresh.
      }
    } else {
      toast.error('Failed to create tag')
    }
    setOpen(false)
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {tags.map((tag) => (
        <Badge key={tag.id} variant="secondary" className="flex items-center gap-1">
          {tag.name}
          <X
            className="h-3 w-3 cursor-pointer hover:text-red-500"
            onClick={() => handleSelect(tag)}
          />
        </Badge>
      ))}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-6 border-dashed">
            <Plus className="h-3 w-3 mr-1" />
            Tag
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Command>
            <CommandInput 
              placeholder="Search tags..." 
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              <CommandEmpty>
                <div className="p-2">
                  <p className="text-sm text-muted-foreground mb-2">No tag found.</p>
                  <Button size="sm" className="w-full" onClick={handleCreateTag}>
                    Create "{inputValue}"
                  </Button>
                </div>
              </CommandEmpty>
              <CommandGroup>
                {allTags.map((tag) => (
                  <CommandItem
                    key={tag.id}
                    value={tag.name}
                    onSelect={() => handleSelect(tag)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        tags.some((t) => t.id === tag.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {tag.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
