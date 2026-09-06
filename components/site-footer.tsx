import React from "react";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-8 text-sm text-muted-foreground sm:px-8">
        <div>© {new Date().getFullYear()} ICQS. Things I&apos;m learning, building, and thinking about.</div>
        <a href="/rss.xml" className="font-medium text-accent transition hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" title="RSS Feed">
          RSS
        </a>
      </div>
    </footer>
  );
}
