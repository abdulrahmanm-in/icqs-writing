import Link from "next/link";
import { formatDate, slugify, type ArticleSummary } from "@/lib/articles";

export function ArticleCard({ article }: { article: ArticleSummary }) {
  return (
    <article className="group border-b border-line py-8 first:pt-0 transition">
      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
        <Link href={`/category/${article.categorySlug}`} className="font-medium text-accent hover:opacity-80 underline transition">
          {article.category}
        </Link>
        <span className="text-muted-foreground opacity-60" aria-hidden="true">·</span>
        <time dateTime={article.date}>{formatDate(article.date)}</time>
        <span className="text-muted-foreground opacity-60" aria-hidden="true">·</span>
        <span>{article.readingTime} min read</span>
      </div>
      <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        <Link href={`/articles/${article.slug}`} className="transition group-hover:text-accent group-hover:opacity-80">
          {article.title}
        </Link>
      </h2>
      <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">{article.description}</p>
      {article.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tag/${slugify(tag)}`}
              className="rounded-full border border-line bg-surface px-2.5 py-1 text-xs font-medium text-muted-foreground transition hover:border-accent hover:bg-surface-hover hover:text-foreground"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
