'use server'

import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import { ExtractionResultSchema } from './schemas'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

export async function processPdf(formData: FormData) {
  const file = formData.get('file') as File
  if (!file) {
    throw new Error('No file provided')
  }

  try {
    // Convert File to Buffer and then to Base64 for Gemini
    // Note: Vercel AI SDK with Google provider supports base64 for files
    const buffer = Buffer.from(await file.arrayBuffer())
    const base64Content = buffer.toString('base64')

    // Call AI
    const { object } = await generateObject({
      model: google('gemini-2.0-flash'),
      schema: ExtractionResultSchema,
      system: `You are an expert academic content digitizer. Your specific task is to extract exam questions and their detailed solutions from a "Solutions Key" PDF document.

### 1. NOISE FILTERING & CLEANING
- **Ignore OCR Artifacts**: Strictly ignore page markers (e.g., "+1/2/59+"), source tags (e.g., ""), and header/footer text (e.g., "SCIPER", "Student 1", "DO NOT UNSTAPLE").
- **Merge Broken Lines**: The PDF contains explicit line breaks. You must merge distinct sentences into coherent paragraphs.

### 2. QUESTION EXTRACTION RULES
- **Identify Questions**: Questions typically start with "Question X" or "Question X (Topic)". Remove the "Question X" prefix from the 'content' field to keep it clean.
- **Formatting**: Use **Markdown** for text styling.
- **Math/LaTeX**: 
  - Detect ALL mathematical expressions.
  - Convert them to standard LaTeX format.
  - Use '$' for inline math (e.g., $f(x) = x^2$) and '$$' for block math.
  - **Crucial**: Fix broken OCR math (e.g., if OCR reads "XTX", infer it implies $X^TX$ based on context).

### 3. TYPE DETERMINATION & OPTIONS
- **MULTIPLE CHOICE (SINGLE/MULTI)**:
  - **Option IDs**: The 'id' MUST be a short label (e.g., "A", "B", "C"). **NEVER** put full content into 'id'.
  - **Identify Answer**: Look for visual markers (☑) or solution keys in the text. Return ONLY the ID(s).
- **TRUE/FALSE (TRUE_FALSE)**:
  - Use "A" for True and "B" for False (or labels used in PDF).
- **OPEN QUESTIONS (ESSAY)**:
  - If no options are present, classify as ESSAY.
  - **Answer**: Extract the model answer or final result if provided in the PDF.

### 4. SOLUTION & EXPLANATION EXTRACTION
- **Mandatory**: If the PDF contains a "Solution:" or "Explanation:" block after a question, you **MUST** extract its entire content into the 'explanation' field.
- **Formatting**: Preserve all LaTeX formulas and logical steps.
- **Goal**: Do NOT generate new explanations; only extract what is explicitly written in the document.

### 5. EDGE CASES
- **No Options**: Classify as ESSAY. NEVER invent options.
- **Sub-questions**: Include all parts in the main 'content' field.`,
      messages: [
        {
          role: 'user',
          content: [
            { 
              type: 'text', 
              text: `Extract the exam questions from this solution key file. Ensure logic and formulas are perfectly preserved.` 
            },
            { 
              type: 'file', 
              data: base64Content, 
              mediaType: 'application/pdf' 
            },
          ],
        },
      ],
    })

    // Save to DB
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let userId: string

    if (!user) {
        // For development without auth, we can try to find a user or throw
        // throw new Error('Unauthorized')
        // FALLBACK for demo: find first user or create one
        const firstUser = await prisma.user.findFirst()
        if (!firstUser) {
             // Create a dummy user if none exists (for dev only)
             const newUser = await prisma.user.create({
                 data: { email: 'demo@example.com' }
             })
             // Use this user
             userId = newUser.id
        } else {
            userId = firstUser.id
        }
    } else {
        // Ensure user exists in Prisma (sync if needed)
        // In a real app, we sync on webhook, but here check existence
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
            filename: file.name,
            url: 'temp-url', // In real app, upload to storage first
            user_id: userId
        }
    })

    // Create Questions
    await prisma.question.createMany({
        data: object.questions.map(q => ({
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
    console.error('PDF Processing Error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

