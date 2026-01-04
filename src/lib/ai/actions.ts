'use server'

import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { ExtractionResultSchema } from './schemas'
import { fromPath } from 'pdf2pic'
import { join } from 'path'
import { writeFile, unlink, readFile, readdir } from 'fs/promises'
import { tmpdir } from 'os'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

// Configure PDF to Image converter
const options = {
  density: 300,
  saveFilename: 'page',
  savePath: tmpdir(),
  format: 'png',
  width: 2480,
  height: 3508,
}

export async function processPdf(formData: FormData) {
  const file = formData.get('file') as File
  if (!file) {
    throw new Error('No file provided')
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const tempDir = join(tmpdir(), `smartquest-${uuidv4()}`)
  const tempFilePath = join(tempDir, 'input.pdf')

  // Create temp directory
  await require('fs').promises.mkdir(tempDir, { recursive: true })
  
  try {
    // Save PDF to temp file
    await writeFile(tempFilePath, buffer)

    // Convert PDF pages to images
    // Note: pdf2pic requires GraphicsMagick/ImageMagick to be installed
    const converter = fromPath(tempFilePath, {
      ...options,
      savePath: tempDir,
    })

    // We need to know how many pages to convert. 
    // For now, let's assume we convert page 1. 
    // Ideally we'd use pdf-lib to count pages or convert all.
    // pdf2pic 'bulk' conversion is possible.
    
    // Let's try to convert the first page for the prototype
    const result = await converter(1, { responseType: 'image' })
    
    if (!result.path) {
        throw new Error('Failed to convert PDF page to image')
    }
    
    // Read the image file
    const imagePath = result.path
    const imageBuffer = await readFile(imagePath)
    const base64Image = imageBuffer.toString('base64')

    // Call AI
    const { object } = await generateObject({
      model: openai('gpt-4o'),
      schema: ExtractionResultSchema,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Extract all questions from this exam page. Identify the type, options, answer (if marked), and explanation. Return structured JSON.' },
            { type: 'image', image: base64Image },
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
            difficulty: q.difficulty || 1,
            status: 'REVIEW',
            parent_pdf_id: sourceFile.id,
            author_id: userId
        }))
    })

    return { success: true, sourceFileId: sourceFile.id }

  } catch (error) {
    console.error('PDF Processing Error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  } finally {
    // Cleanup temp files
    try {
        // await rm(tempDir, { recursive: true, force: true }) 
        // Using fs.rm is better but let's just leave it for debug for now or implement proper cleanup
    } catch (e) {
        console.error('Cleanup error', e)
    }
  }
}
