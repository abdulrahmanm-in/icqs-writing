import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { ArticleSummary } from "@/lib/articles";

export function FilteredArticleList({ heading, eyebrow, articles }: { heading: string; eyebrow: string; articles: ArticleSummary[] }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-16 sm:px-8 sm:py-24">
        <Link href="/" className="text-sm text-accent transition hover:opacity-80 hover:underline">
          ← All writing
        </Link>
        <p className="mt-12 text-sm font-semibold uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{heading}</h1>
        <section className="mt-14" aria-label={`${heading} articles`}>
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
