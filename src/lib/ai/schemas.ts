import { z } from 'zod'

export const QuestionTypeEnum = z.enum(['SINGLE', 'MULTI', 'SHORT', 'ESSAY'])

export const OptionSchema = z.object({
  id: z.string().describe('The option identifier, e.g., "A", "B", "1", "2"'),
  content: z.string().describe('The text content of the option'),
})

export const QuestionSchema = z.object({
  content: z.string().describe('The main text of the question. Use Markdown and LaTeX for math.'),
  type: QuestionTypeEnum.describe('The type of the question'),
  options: z.array(OptionSchema).optional().describe('List of options for multiple choice questions'),
  answer: z.any().describe('The correct answer. For SINGLE/MULTI, use the option ID(s). For SHORT/ESSAY, provide the text answer.'),
  explanation: z.string().optional().describe('Detailed explanation of the solution'),
  difficulty: z.number().min(1).max(5).optional().describe('Difficulty level from 1 (Easy) to 5 (Hard)'),
})

export const ExtractionResultSchema = z.object({
  questions: z.array(QuestionSchema),
})

export type Question = z.infer<typeof QuestionSchema>
export type ExtractionResult = z.infer<typeof ExtractionResultSchema>
