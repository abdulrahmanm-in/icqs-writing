export function AuthorSection() {
  return (
    <div className="mt-20 border-t border-line pt-10">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-muted-foreground">About the author</h3>
        <div className="mt-4">
          <p className="font-medium text-foreground">Abdul Rahman M</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Software developer interested in technology, software, and things worth building.
          </p>
          <div className="mt-3 flex gap-4 text-sm">
            <a
              href="https://portfolio.icqs.fyi"
              className="text-accent transition hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Portfolio
            </a>
            <a
              href="https://github.com"
              className="text-accent transition hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com"
              className="text-accent transition hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
