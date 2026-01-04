import { HeroSection } from "@/components/home/hero-section";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 flex flex-col">
        <HeroSection />
      </main>
      <footer className="py-6 w-full border-t bg-muted/30 mt-auto">
        <div className="container mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center px-4 md:px-6 gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SmartQuest AI. All rights reserved.
          </p>
          <nav className="flex gap-4 sm:gap-6">
            <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground hover:text-foreground transition-colors" href="#">
              Terms
            </Link>
            <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground hover:text-foreground transition-colors" href="#">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
