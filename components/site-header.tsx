import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="text-base font-bold tracking-tight text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
          ICQS <span className="font-normal text-muted-foreground">/ Writing</span>
        </Link>
        <nav aria-label="Main navigation" className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link className="transition hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent" href="/">
            Writing
          </Link>
          <Link className="transition hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent" href="/about">
            About
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
