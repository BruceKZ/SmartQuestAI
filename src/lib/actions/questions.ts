'use server'

import { prisma } from '@/lib/prisma'
import { Question } from '@prisma/client'

export async function getQuestions(page = 1, limit = 20) {
  const skip = (page - 1) * limit
  
  const [questions, total] = await Promise.all([
    prisma.question.findMany({
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      include: { tags: true },
    }),
    prisma.question.count(),
  ])

  return {
    questions,
    total,
    totalPages: Math.ceil(total / limit),
  }
}

export async function getAllTags() {
  return await prisma.tag.findMany({ orderBy: { name: 'asc' } })
}

export async function createTag(name: string) {
  try {
    const tag = await prisma.tag.create({ data: { name } })
    return { success: true, tag }
  } catch (error) {
    return { success: false, error }
  }
}

export async function addTagToQuestion(questionId: string, tagId: string) {
  try {
    await prisma.question.update({
      where: { id: questionId },
      data: { tags: { connect: { id: tagId } } },
    })
    return { success: true }
  } catch (error) {
    return { success: false, error }
  }
}

export async function removeTagFromQuestion(questionId: string, tagId: string) {
  try {
    await prisma.question.update({
      where: { id: questionId },
      data: { tags: { disconnect: { id: tagId } } },
    })
    return { success: true }
  } catch (error) {
    return { success: false, error }
  }
}
