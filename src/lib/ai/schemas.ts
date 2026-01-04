import { z } from 'zod'

export const QuestionTypeEnum = z.enum(['SINGLE', 'MULTI', 'TRUE_FALSE', 'ESSAY'])

export const OptionSchema = z.object({
  id: z.string().describe("The option label, e.g., 'A', 'B' or '1', '2'"),
  content: z.string().describe("The text of the option"),
})

export const QuestionSchema = z.object({
  id: z.string().optional().describe("The question number, e.g., '1', '40a'"),
  type: QuestionTypeEnum.describe("Type of the question"),
  content: z.string().describe("The markdown formatted question stem, including sub-questions if any"),
  options: z.array(OptionSchema).optional().describe("Only for choice-based questions"),
  answer: z.union([z.string(), z.array(z.string())]).optional().describe("The ID(s) of the correct option(s), or the short textual answer"),
  explanation: z.string().optional().describe("The detailed solution text extracted from the document"),
})

export const ExtractionResultSchema = z.object({
  questions: z.array(QuestionSchema),
})

export type Question = z.infer<typeof QuestionSchema>
export type ExtractionResult = z.infer<typeof ExtractionResultSchema>
