import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default async function ListsPage() {
  const lists = await prisma.problemList.findMany({
    orderBy: { created_at: 'desc' },
    include: { _count: { select: { questions: true } } }
  })

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Problem Lists</h1>
          <p className="text-muted-foreground">
            Organize your questions into exams or practice sets.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create List
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lists.map((list) => (
          <Card key={list.id} className="cursor-pointer hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle>{list.title}</CardTitle>
              <CardDescription>{list.description || 'No description'}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {list._count.questions} questions
              </p>
            </CardContent>
          </Card>
        ))}
        {lists.length === 0 && (
          <div className="col-span-full text-center py-10 text-muted-foreground">
            No lists found. Create one to get started.
          </div>
        )}
      </div>
    </div>
  )
}
