import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Clock, ArrowRight } from 'lucide-react'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function ExamsPage() {
  const sessions = await prisma.examSession.findMany({
    orderBy: { started_at: 'desc' },
    take: 10,
    include: {
      user: true
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exams</h1>
          <p className="text-muted-foreground">
            Manage your exam sessions and view history.
          </p>
        </div>
        <Link href="/library">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Exam
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sessions.length === 0 ? (
          <div className="col-span-full text-center py-12 border rounded-lg bg-muted/50">
            <h3 className="text-lg font-medium">No exams yet</h3>
            <p className="text-muted-foreground mb-4">Start a new exam from your library.</p>
            <Link href="/library">
              <Button variant="outline">Go to Library</Button>
            </Link>
          </div>
        ) : (
          sessions.map((session: any) => (
            <Card key={session.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Exam Session</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    session.status === 'FINISHED' ? 'bg-green-100 text-green-800' :
                    session.status === 'ACTIVE' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {session.status}
                  </span>
                </CardTitle>
                <CardDescription>
                  {new Date(session.started_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Clock className="mr-2 h-4 w-4" />
                  {Math.floor(session.timer_seconds / 60)} mins
                </div>
                <Link href={`/exams/${session.id}`}>
                  <Button className="w-full" variant="secondary">
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
