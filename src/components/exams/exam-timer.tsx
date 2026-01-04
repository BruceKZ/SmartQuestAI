'use client'

import { useEffect } from 'react'
import { useExamStore } from '@/lib/store/exam-store'
import { Clock, Pause, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ExamTimer() {
  const { timeRemaining, status, tickTimer, setStatus } = useExamStore()

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (status === 'ACTIVE' && timeRemaining > 0) {
      interval = setInterval(() => {
        tickTimer()
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [status, timeRemaining, tickTimer])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const togglePause = () => {
    setStatus(status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE')
  }

  return (
    <div className={cn(
      "flex items-center gap-4 px-4 py-2 rounded-full border shadow-sm bg-background transition-colors",
      timeRemaining < 60 && "border-red-500 bg-red-50 dark:bg-red-900/20"
    )}>
      <Clock className={cn(
        "h-4 w-4",
        timeRemaining < 60 ? "text-red-500" : "text-muted-foreground"
      )} />
      <span className={cn(
        "font-mono text-lg font-medium",
        timeRemaining < 60 && "text-red-600 dark:text-red-400"
      )}>
        {formatTime(timeRemaining)}
      </span>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-6 w-6 rounded-full" 
        onClick={togglePause}
      >
        {status === 'ACTIVE' ? (
          <Pause className="h-3 w-3" />
        ) : (
          <Play className="h-3 w-3" />
        )}
      </Button>
    </div>
  )
}
