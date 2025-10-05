import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="group flex items-center gap-2.5 transition-smooth"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/20 transition-smooth group-hover:shadow-primary/40">
              <span className="font-mono text-sm font-bold text-primary-foreground">
                BB
              </span>
            </div>
            <span className="font-semibold text-foreground text-lg transition-smooth group-hover:text-primary">
              Beyond Blue
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/explore"
              className="text-sm font-medium text-muted-foreground transition-smooth hover:text-foreground"
            >
              Explore
            </Link>
            <Link
              href="/classify"
              className="text-sm font-medium text-muted-foreground transition-smooth hover:text-foreground"
            >
              Classifier
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground transition-smooth hover:text-foreground"
            >
              About
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button
            variant="default"
            size="sm"
            asChild
            className="shadow-sm transition-smooth hover:shadow-md"
          >
            <Link href="/explore">Surprise Me 🎉</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
