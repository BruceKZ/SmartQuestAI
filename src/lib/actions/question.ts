'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { Question } from '@/lib/ai/schemas'

export async function saveQuestions(questions: Question[], sourceFileName: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let userId: string

    if (!user) {
        // FALLBACK for demo: find first user or create one
        const firstUser = await prisma.user.findFirst()
        if (!firstUser) {
             const newUser = await prisma.user.create({
                 data: { email: 'demo@example.com' }
             })
             userId = newUser.id
        } else {
            userId = firstUser.id
        }
    } else {
        const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
        if (!dbUser) {
             await prisma.user.create({
                 data: { id: user.id, email: user.email! }
             })
        }
        userId = user.id
    }

    // Create SourceFile
    const sourceFile = await prisma.sourceFile.create({
        data: {
            filename: sourceFileName,
            url: 'temp-url', // In real app, upload to storage first
            user_id: userId
        }
    })

    // Create Questions
    await prisma.question.createMany({
        data: questions.map(q => ({
            content: q.content,
            type: q.type,
            options: q.options ? JSON.stringify(q.options) : undefined,
            answer: q.answer ? JSON.stringify(q.answer) : undefined,
            explanation: q.explanation,

            status: 'REVIEW',
            parent_pdf_id: sourceFile.id,
            author_id: userId
        }))
    })

    return { success: true, sourceFileId: sourceFile.id }

  } catch (error) {
    console.error('Save Questions Error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
