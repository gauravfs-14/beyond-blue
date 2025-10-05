export function Footer() {
  return (
    <footer className="border-t border-border/50">
      <div className="container mx-auto flex flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Beyond Blue. Data from NASA Exoplanet
          Archive.
        </div>
        <nav className="flex flex-wrap gap-4 text-sm text-muted-foreground/80">
          <a href="/about" className="hover:text-foreground">
            About
          </a>
          <a href="/explore" className="hover:text-foreground">
            Explore
          </a>
          <a href="/classify" className="hover:text-foreground">
            Classifier
          </a>
          <a
            href="https://exoplanetarchive.ipac.caltech.edu/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
          >
            NASA Archive
          </a>
        </nav>
      </div>
    </footer>
  );
}
