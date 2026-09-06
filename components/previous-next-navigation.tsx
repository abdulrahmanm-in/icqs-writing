import Link from "next/link";
import type { ArticleSummary } from "@/lib/articles";

interface PreviousNextNavigationProps {
  articles: ArticleSummary[];
  currentSlug: string;
}

export function PreviousNextNavigation({ articles, currentSlug }: PreviousNextNavigationProps) {
  const currentIndex = articles.findIndex((a) => a.slug === currentSlug);
  if (currentIndex === -1) return null;

  const prev = currentIndex > 0 ? articles[currentIndex - 1] : null;
  const next = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;

  if (!prev && !next) return null;

  return (
    <div className="mt-20 border-t border-line pt-14">
      <div className="grid gap-8 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/articles/${prev.slug}`}
            className="group flex flex-col gap-2 rounded-lg border border-line bg-surface p-5 transition hover:border-accent hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">← Previous</span>
            <span className="font-medium text-foreground group-hover:text-accent transition">
              {prev.title}
            </span>
            <span className="text-xs text-muted-foreground">{prev.category}</span>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/articles/${next.slug}`}
            className="group flex flex-col gap-2 rounded-lg border border-line bg-surface p-5 text-right transition hover:border-accent hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:text-left"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">Next →</span>
            <span className="font-medium text-foreground group-hover:text-accent transition">
              {next.title}
            </span>
            <span className="text-xs text-muted-foreground">{next.category}</span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
