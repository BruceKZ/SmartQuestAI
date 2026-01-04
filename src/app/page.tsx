import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowRight, CheckCircle2, Zap, Brain } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <Link className="flex items-center justify-center" href="#">
          <GraduationCap className="h-6 w-6 mr-2 text-primary" />
          <span className="font-bold text-xl">SmartQuest AI</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="/login">
            Login
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="/library">
            Dashboard
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Master Your Exams with <span className="text-primary">AI Intelligence</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Upload your PDFs, generate smart questions, and practice in a distraction-free environment designed for high achievers.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/library">
                  <Button size="lg" className="h-12 px-8">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" size="lg" className="h-12 px-8">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center p-6 border rounded-xl bg-card shadow-sm">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Instant Extraction</h3>
                <p className="text-muted-foreground">
                  Turn any PDF exam paper into a structured question bank in seconds using GPT-4o Vision.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 border rounded-xl bg-card shadow-sm">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <Brain className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Smart Analysis</h3>
                <p className="text-muted-foreground">
                  Get detailed explanations and AI-powered grading for both objective and subjective questions.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 border rounded-xl bg-card shadow-sm">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Zen Mode</h3>
                <p className="text-muted-foreground">
                  Practice in a distraction-free environment with built-in timers and progress tracking.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-muted/30">
        <p className="text-xs text-muted-foreground">© 2024 SmartQuest AI. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
