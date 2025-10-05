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

          <h1 className="text-balance font-bold text-4xl leading-tight tracking-tight md:text-5xl lg:text-6xl">
            Discover Worlds
            {/* <br /> */}
            <span className="ml-3 bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
              Beyond Blue
            </span>
          </h1>

          <p className="text-balance text-muted-foreground text-md leading-relaxed md:text-md max-w-3xl">
            Explore NASA’s exoplanet archive, filter by scientific parameters,
            and classify planet candidates with machine learning—all in one
            streamlined platform.
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
              <Link href="/classify">Try Our Classifier</Link>
            </Button>
          </div>
        </div>

        <div className="grid w-full max-w-5xl gap-6 pt-20 md:grid-cols-3">
          <div className="group flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card/50 p-6 backdrop-blur-sm transition-smooth hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 transition-smooth group-hover:from-primary/20 group-hover:to-primary/10">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground text-lg">
              Scientific Filtering
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Search by name or host, then refine by orbital period, radius,
              mass, distance and more—plus quick status filters (Confirmed,
              Candidate, False Positive).
            </p>
          </div>

          <div className="group flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card/50 p-6 backdrop-blur-sm transition-smooth hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 transition-smooth group-hover:from-primary/20 group-hover:to-primary/10">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground text-lg">
              Complete Parameters
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Orbital, stellar and photometric fields with measurement
              uncertainties, sourced from peer‑reviewed catalogs.
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
              Try our FastAPI‑backed model to predict planet disposition and see
              probability plus a clear confidence label.
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

      {/* What makes Beyond Blue different */}
      <section className="border-t border-border/50 max-w-5xl mx-auto">
        <div className="container mx-auto grid gap-8 px-6 py-16 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="font-semibold text-2xl tracking-tight">
              What makes Beyond Blue different
            </h2>
            <ul className="list-disc space-y-3 pl-5 text-muted-foreground">
              <li>
                <span className="text-foreground font-medium">
                  Built for clarity
                </span>{" "}
                — units, uncertainties and field meanings are front‑and‑center,
                not hidden.
              </li>
              <li>
                <span className="text-foreground font-medium">
                  Research‑grade defaults
                </span>{" "}
                — filters and sorts mirror how astronomers actually explore
                populations.
              </li>
              <li>
                <span className="text-foreground font-medium">Honest ML</span> —
                probabilities come from the model; confidence labels are
                explicit about being heuristic buckets.
              </li>
              <li>
                <span className="text-foreground font-medium">
                  Tasteful, quiet UI
                </span>{" "}
                — beauty in service of readability; no rainbow noise.
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card/60 p-6">
            <h3 className="mb-2 font-semibold">Methodology at a glance</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                Data is sourced from the NASA Exoplanet Archive. The Explore
                view pages through confirmed planets. The Classifier sends
                KOI‑style inputs to a FastAPI Random Forest and returns
                P(planet); when the predicted class is False Positive we display
                1 − P(planet).
              </p>
              <p>
                Confidence labels: HIGH if probability ≥ 80% or ≤ 20%, MEDIUM if
                ≥ 60% or ≤ 40%, otherwise LOW. This is deliberate and
                transparent.
              </p>
              <p>
                Similar planets are found client‑side by filtering a pool within
                ±10% of the input orbital period and sorting by closeness.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
