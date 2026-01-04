import { streamObject } from 'ai';
import { google } from '@ai-sdk/google';
import { ExtractionResultSchema } from '@/lib/ai/schemas';


export const maxDuration = 60;

export async function POST(req: Request) {
  const { file: base64File, filename } = await req.json();

  if (!base64File) {
    return new Response('No file provided', { status: 400 });
  }

  // base64File is the base64 string
  const base64Content = base64File;
  // We can use the filename from the payload
  const fileName = filename || 'uploaded.pdf';

  const result = await streamObject({
    model: google('gemini-2.0-flash'),
    schema: ExtractionResultSchema,
    system: `You are an expert academic content digitizer. Your task is to extract exam questions and their correct answers from a PDF document.
    
### 1. NOISE FILTERING & CLEANING
- **Ignore OCR Artifacts**: Strictly ignore page markers, source tags, and header/footer text.
- **Merge Broken Lines**: Merge distinct sentences into coherent paragraphs.

### 2. QUESTION EXTRACTION RULES
- **Identify Questions**: Extract the question text. Use **Markdown** for styling.
- **Math/LaTeX**: Use '$' for inline math and '$$' for block math. Ensure all formulas are perfectly preserved.

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
            text: `Extract all questions and answers from this PDF for my question bank. Focus on accuracy and LaTeX formatting.`
          },
          {
            type: 'file',
            data: base64Content,
            mediaType: 'application/pdf',
          },
        ],
      },
    ],
    // onFinish removed to prevent auto-save
  });

  return result.toTextStreamResponse();
}
