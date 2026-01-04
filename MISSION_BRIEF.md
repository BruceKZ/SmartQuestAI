# 📂 Project Mission: SmartQuest AI (Next.js Full-Stack)

**Role**: You are a Senior Full-Stack Product Engineer / UX Architect.
**Objective**: Build a modern, responsive, AI-powered Question Bank & Exam platform.
**Target Output**: A production-ready web application that feels like a native app (PWA ready), using the latest Next.js 14/15 ecosystem.

---

## 1. Technical Architecture (The Stack)

* **Core Framework**: Next.js 15 (App Router, Server Actions).
* **Language**: TypeScript (Strict Mode).
* **Database**: PostgreSQL (via Supabase).
* **Authentication**: **Supabase Auth** (Native integration) or **Clerk**. Must support **OAuth** (Google, GitHub) for seamless persistent login.
* **ORM**: Prisma (preferred for type safety) or Drizzle.
* **Styling & UI**:
* Tailwind CSS (Utility-first).
* **Shadcn/UI** (Radix Primitives) - Critical for the "Pro Max" look.
* **Framer Motion** (Micro-interactions & transitions).
* **Lucide React** (Icons).


* **State Management**: Nuqs (URL state sync) + Zustand (Global Client State).
* **AI & Operations**:
* **Vercel AI SDK** (Standardized API for LLM calls).
* **LangChain.js** (Structured Output parsing).
* **PDF Parsing**: `pdf-parse` (text) or LLM Vision (images).
* **Math Rendering**: `react-latex-next` or `katex` (Must support block & inline LaTeX).



---

## 2. UI/UX Design System ("Pro Max" Standard)

**Design Philosophy**: "Clean, Distraction-Free, Academic Focus".

* **Reference**: Vercel Dashboard, Linear App, Notion.
* **Responsiveness**: Mobile-First approach. The UI must adapt perfectly to iPhone/iPad screens (touch targets, bottom navigation for mobile, sidebar for desktop).
* **Theme**: System Default / Dark Mode toggle.
* **Visuals**:
* Use "Cards" for question items.
* Use "Sheet/Drawer" components for mobile settings/filters.
* **Skeleton Loaders**: No spinning wheels; use pulsating skeletons for data fetching.
* **Optimistic UI**: Interactions (like "Save", "Tag") should feel instant.



---

## 3. Database Schema Strategy (Prisma)

You must implement the following core models. (Names are indicative).

* **User**: `id`, `email`, `avatar_url`, `api_keys` (Encrypted JSON), `settings` (JSON - default prompt language, etc.).
* **Question**:
* `content`: String (Markdown + LaTeX).
* `type`: Enum (`SINGLE`, `MULTI`, `SHORT`, `ESSAY`).
* `options`: JSONB (`[{id: "A", content: "..."}]`).
* `answer`: JSONB (Correct Answer structure).
* `explanation`: String (Markdown).
* `difficulty`: Int (1-5).
* `status`: Enum (`DRAFT`, `REVIEW`, `PUBLISHED`). **Crucial**: Uploaded questions start as `REVIEW`.
* `parent_pdf_id`: Relation to `SourceFile`.


* **SourceFile**: Tracks uploaded PDFs.
* **Tag**: Many-to-Many with Questions.
* **ProblemList**: Collections of questions (Manual or Auto-generated from PDF).
* **ExamSession**: `status` (`ACTIVE`, `PAUSED`, `FINISHED`), `timer_seconds`, `answers_json`.
* **Submission**: Records of past attempts, scores, and **AI Grading Feedback**.

---

## 4. Feature Specifications (Detailed)

### Module A: The "Ingestion Engine" (PDF -> AI -> JSON)

1. **Upload Interface**: Drag & Drop PDF. Visual progress bar.
2. **Processing Pipeline** (Server Action):
* Convert PDF pages to Images (using `pdf2pic` or similar library).
* Send Image + Prompt to User's configured LLM (GPT-4o / Gemini 1.5 Pro).
* **Prompt Goal**: Extract text, identify Question Type, Extract Options, Convert Math to LaTeX.
* **Output**: Strictly structured JSON array.


3. **The "Staging Area" (Review UI)**:
* **Layout**: Split Screen (Desktop) / Tabs (Mobile).
* **Left**: Original PDF Image (Zoomable).
* **Right**: Editable Form. User corrects OCR errors here.
* **Actions**: "Approve & Add to Bank", "Discard", "Merge with Previous".



### Module B: The Question Bank

1. **Grid/List View**: Infinite scroll.
2. **Smart Filters**: Filter by Tag, Type, Difficulty, Source PDF.
3. **AI Operations**:
* **Auto-Tagging**: Button to "Analyze & Tag" selected questions using LLM.
* **Translation**: Dropdown to translate content to [User Target Language]. Store translation as a toggleable view overlay.
* **Assistant**: Context-aware Chat sidebar ("Explain this formula", "Show me a similar problem").



### Module C: Practice & Simulation (Exam Mode)

1. **Playlist Construction**: User selects questions -> "Create Exam".
2. **Exam Interface (Zen Mode)**:
* Remove all headers/sidebars.
* **Timer**: Floating widget (Top Right). Supports **Pause** (blurs screen).
* **Navigation**: Question Palette (Grid of circles: 1, 2, 3...) to jump between questions.
* **Mobile Support**: Swipe left/right to change questions.


3. **Input Methods**:
* Choice: Clickable Cards.
* Short Answer: Markdown Text Area / **Camera Upload** (for handwritten answers).



### Module D: AI Grading & Feedback

1. **Trigger**: User clicks "Submit Exam".
2. **Objective Questions**: Auto-graded locally.
3. **Subjective Questions (The AI Grader)**:
* If user uploaded an image: Send Image + Standard Answer + Rubric to Vision LLM.
* If text: Send Text + Standard Answer.
* **Response**: Score (0-100), Specific Feedback, "Model Answer".



### Module E: Settings & PWA

1. **BYOK (Bring Your Own Key)**: Secure input for OpenAI/Gemini API Keys. Stored in DB (encrypted) or LocalStorage (user choice).
2. **PWA Manifest**: `manifest.json` configured for standalone install on iOS/Android.

---

## 5. Development Roadmap for Agent

Please execute in this order. Do not skip steps.

**Phase 1: Foundation**

1. Initialize Next.js 15, Shadcn UI, Supabase Client.
2. Set up Authentication (Google/GitHub Login) & Protected Routes.
3. Design the Database Schema & Run Migrations.

**Phase 2: The Core (Upload & Parse)**

1. Create the PDF Upload component.
2. Implement the Vision LLM integration (using Vercel AI SDK `generateObject` for JSON enforcement).
3. Build the "Staging/Review" Dashboard.

**Phase 3: Organization**

1. Build the Library View with Filtering.
2. Implement Tagging & Problem Lists.

**Phase 4: The "Arena" (Exam Mode)**

1. Build the dedicated Exam Layout (Timer, State Machine).
2. Implement the Grading logic.

**Phase 5: Polish**

1. Mobile responsiveness check (CSS tweaks).
2. Add PWA configuration.

---

## 6. Important Constraints

* **No Python Backend**: All logic must live in Next.js Server Actions.
* **Latency Handling**: For long OCR tasks, implement a "Loading State" skeleton or use Vercel's `maxDuration` config for the specific route.
* **Error Handling**: If AI extraction fails, provide a "Manual Entry" fallback.

---

**Instruction to Agent:**
Start by acknowledging this plan. Then, generate the **Prisma Schema** (`schema.prisma`) and the **Project Directory Structure** so I can confirm the data architecture before we write component code.