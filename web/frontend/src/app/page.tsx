import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Search,
  Sparkles,
  Database,
  Telescope,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col">
      <section className="container mx-auto flex flex-1 flex-col items-center justify-center gap-10 px-6 py-20 text-center">
        <div className="flex max-w-4xl flex-col gap-8">
          <div className="mx-auto flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 backdrop-blur-sm">
            <Telescope className="h-3.5 w-3.5 text-primary" />
            <span className="text-primary text-xs font-medium">
              Powered by NASA Exoplanet Archive
            </span>
          </div>

          <h1 className="text-balance font-bold text-5xl leading-tight tracking-tight md:text-6xl lg:text-7xl">
            Discover Worlds
            <br />
            <span className="bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
              Beyond Blue
            </span>
          </h1>

          <p className="text-balance text-muted-foreground text-lg leading-relaxed md:text-xl">
            Explore thousands of confirmed exoplanets from NASA's archive.
            Browse detailed parameters, view uncertainties, and discover
            potentially habitable worlds across the cosmos.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 pt-6 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="shadow-lg shadow-primary/20 transition-smooth hover:shadow-primary/30"
            >
              <Link href="/explore">
                Start Exploring
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="transition-smooth bg-transparent hover:text-primary"
            >
              <Link href="/classify">Try Classifier Demo</Link>
            </Button>
          </div>
        </div>

        <div className="grid w-full max-w-5xl gap-6 pt-20 md:grid-cols-3">
          <div className="group flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card/50 p-6 backdrop-blur-sm transition-smooth hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 transition-smooth group-hover:from-primary/20 group-hover:to-primary/10">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground text-lg">
              Advanced Filtering
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Filter by discovery method, orbital parameters, stellar
              properties, and habitable zone location.
            </p>
          </div>

          <div className="group flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card/50 p-6 backdrop-blur-sm transition-smooth hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 transition-smooth group-hover:from-primary/20 group-hover:to-primary/10">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground text-lg">
              Complete Data
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Access comprehensive orbital, stellar, and photometric parameters
              with measurement uncertainties.
            </p>
          </div>

          <div className="group flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card/50 p-6 backdrop-blur-sm transition-smooth hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 transition-smooth group-hover:from-primary/20 group-hover:to-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground text-lg">
              ML Classifier
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Use our machine learning model to classify planets based on their
              physical characteristics.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-border/50 bg-gradient-to-b from-muted/30 to-muted/10 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-16">
          <div className="grid gap-12 md:grid-cols-3">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="font-mono font-bold text-5xl text-primary">
                5,000+
              </div>
              <div className="text-muted-foreground text-sm font-medium">
                Confirmed Exoplanets
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="font-mono font-bold text-5xl text-primary">
                60+
              </div>
              <div className="text-muted-foreground text-sm font-medium">
                Data Parameters
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="font-mono font-bold text-5xl text-primary">
                1995
              </div>
              <div className="text-muted-foreground text-sm font-medium">
                First Discovery
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
