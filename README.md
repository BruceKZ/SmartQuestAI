# SmartQuest AI 🚀

<div align="center">

![SmartQuest AI Banner](https://via.placeholder.com/1200x400?text=SmartQuest+AI+Banner)
<!-- You can replace this banner with a real screenshot later -->

**The "Pro Max" AI-Powered Question Bank & Exam Platform**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Vercel AI SDK](https://img.shields.io/badge/Vercel_AI_SDK-3.0-black?style=for-the-badge&logo=vercel)](https://sdk.vercel.ai/docs)

</div>

---

## 📖 Mission

**SmartQuest AI** is a modern, responsive, and AI-native web application designed to revolutionize how students and educators manage learning materials. By leveraging **Next.js 15**, **Supabase**, and **LLMs (GPT-4o / Gemini)**, it transforms static PDF documents into interactive, auto-graded exam simulations.

Our philosophy: **"Clean, Distraction-Free, Academic Focus"**.

## ✨ Key Features

### 🧠 Module A: The Ingestion Engine
- **PDF to JSON**: Drag & drop PDFs to automatically extract text, questions, and options using AI.
- **Smart OCR**: Handles complex layouts, math formulas (LaTeX), and images.
- **Review Dashboard**: Split-screen interface to verify and correct AI extractions before adding to the bank.

### 📚 Module B: The Question Bank
- **Organized Library**: Filter by tags, difficulty, type, and source.
- **AI Operations**: Auto-tagging, content translation, and context-aware explanations.
- **Rich Text Support**: Full Markdown and LaTeX support for math and scientific content.

### ⚔️ Module C: Exam Arena (Zen Mode)
- **Distraction-Free UI**: Immersive full-screen mode for taking exams.
- **Simulation Tools**: Built-in timer, question palette, and progress tracking.
- **Mobile First**: Optimized touch controls for studying on the go.

### 🤖 Module D: AI Grading
- **Instant Feedback**: Auto-grading for objective questions.
- **AI Grader**: Subjective answers (text or handwritten images) are graded by AI with detailed feedback and scoring.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Actions)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + [Shadcn/UI](https://ui.shadcn.com/) + [Framer Motion](https://www.framer.com/motion/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Supabase](https://supabase.com/))
- **Auth**: Supabase Auth (OAuth support)
- **AI**: [Vercel AI SDK](https://sdk.vercel.ai/docs) + [LangChain.js](https://js.langchain.com/)
- **State**: [Zustand](https://github.com/pmndrs/zustand) + [Nuqs](https://nuqs.47ng.com/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/smart-quest-ai.git
   cd smart-quest-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory and add your credentials:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # AI Keys
   OPENAI_API_KEY=your_openai_key
   # or
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
   
   # Database
   DATABASE_URL=your_prisma_connection_string
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
