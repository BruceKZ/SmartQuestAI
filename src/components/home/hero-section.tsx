import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative w-full flex-1 flex items-center justify-center overflow-hidden bg-background py-12 md:py-24">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="container relative mx-auto max-w-5xl px-4 md:px-6 flex flex-col items-center text-center space-y-8 z-10">
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-primary/5 text-primary">
          <Sparkles className="mr-2 h-3 w-3" />
          <span>AI-Powered Exam Prep</span>
        </div>
        
        <h1 className="text-5xl font-extrabold tracking-tight lg:text-7xl xl:text-8xl max-w-4xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
          Master Your Exams with <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Superhuman Intelligence
          </span>
        </h1>
        
        <p className="mx-auto max-w-[700px] text-muted-foreground text-xl md:text-2xl leading-relaxed">
          Upload PDFs. Generate Questions. Ace the Test.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-8">
          <Link href="/library" className="w-full sm:w-auto">
            <Button size="lg" className="w-full h-14 px-10 text-lg rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
