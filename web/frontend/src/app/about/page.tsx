import {
  Telescope,
  Database,
  Sparkles,
  Globe,
  Users,
  BookOpen,
} from "lucide-react";

export default function AboutPage() {
  return (
    <main className="container mx-auto px-6 py-12 max-w-4xl">
      <div className="">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 font-bold text-4xl tracking-tight md:text-5xl">
            About <span className="text-primary">Beyond Blue</span>
          </h1>
          <p className="text-balance text-muted-foreground text-lg leading-relaxed">
            A focused exoplanet explorer: high‑quality data from NASA's archive,
            practical filters, and an optional ML classifier.
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Telescope className="h-5 w-5 text-primary" />
            </div>
            <h2 className="font-semibold text-2xl">Our Mission</h2>
          </div>
          <p className="mb-4 text-muted-foreground leading-relaxed">
            Beyond Blue turns NASA's exoplanet catalog into an approachable tool
            for exploration and learning. We prioritize clarity, scientific
            context, and usability over flashy visuals.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Whether you're a student, educator or researcher, you can browse,
            filter and analyze confirmed planets with the same core parameters
            used in the literature.
          </p>
        </section>

        {/* Features Grid */}
        <section className="mb-16">
          <h2 className="mb-8 font-semibold text-2xl">What We Offer</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-lg">Curated Dataset</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                5,000+ confirmed exoplanets with 60+ fields: orbital,
                photometric and stellar properties, including uncertainties.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-lg">Purposeful Filters</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Filter by disposition (Confirmed/Candidate/False Positive),
                search by name, and narrow by period, radius, mass and distance.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-lg">ML Classification</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                A FastAPI service serves a trained Random Forest. You provide a
                few KOI‑style inputs; we return probability and a clear
                confidence label.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-lg">
                Educational Resource
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Perfect for students and educators exploring astronomy,
                planetary science, and the search for potentially habitable
                worlds.
              </p>
            </div>
          </div>
        </section>

        {/* Data Source */}
        <section className="mb-16">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <h2 className="font-semibold text-2xl">Data Source</h2>
          </div>
          <p className="mb-4 text-muted-foreground leading-relaxed">
            All exoplanet data is sourced from the{" "}
            <a
              href="https://exoplanetarchive.ipac.caltech.edu/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              NASA Exoplanet Archive
            </a>
            , maintained by the California Institute of Technology under
            contract with NASA. The archive is the official repository for
            confirmed exoplanet discoveries and provides peer-reviewed,
            high-quality data.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We regularly update our database to include the latest discoveries
            and refined measurements as they become available from the
            scientific community.
          </p>
        </section>

        {/* Technology */}
        <section className="rounded-lg border border-border bg-muted/30 p-8">
          <h2 className="mb-4 font-semibold text-2xl">
            Built With Modern Technology
          </h2>
          <p className="mb-4 text-muted-foreground leading-relaxed">
            Beyond Blue is built with Next.js, React, and TypeScript, providing
            a fast, responsive, and accessible user experience. Our machine
            learning classifier uses scikit-learn for planet categorization.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            This project is open to feedback and contributions. We're constantly
            working to improve the platform and add new features for the
            exoplanet exploration community.
          </p>
        </section>
      </div>
    </main>
  );
}
