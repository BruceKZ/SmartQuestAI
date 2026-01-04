'use server'

import { prisma } from '@/lib/prisma'

export async function submitExam(sessionId: string, answers: Record<string, any>) {
  // 1. Fetch questions
  // 2. Calculate score for objective questions
  // 3. Trigger AI grading for subjective questions (future)
  // 4. Save submission

  // Placeholder implementation
  return { success: true, score: 0 }
}
