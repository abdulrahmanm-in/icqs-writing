import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ArticleContentRenderer } from "@/components/article-content-renderer";
import { AuthorSection } from "@/components/author-section";
import { PreviousNextNavigation } from "@/components/previous-next-navigation";
import { formatDate, getAllArticles, getArticleBySlug, renderMarkdown, slugify } from "@/lib/articles";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps<"/articles/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  const url = `/articles/${article.slug}`;
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: article.title,
      description: article.description,
      publishedTime: article.date,
      modifiedTime: article.updatedAt,
      tags: article.tags,
    },
    twitter: { card: "summary", title: article.title, description: article.description },
  };
}

export default async function ArticlePage({ params }: PageProps<"/articles/[slug]">) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const allArticles = await getAllArticles();
  const html = await renderMarkdown(article.content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.updatedAt ?? article.date,
    mainEntityOfPage: absoluteUrl(`/articles/${article.slug}`),
    url: absoluteUrl(`/articles/${article.slug}`),
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
    keywords: article.tags,
  };

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-[48rem] flex-1 px-5 py-16 sm:px-8 sm:py-24">
        {/* Back link */}
        <Link href="/" className="text-sm text-accent transition hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
          ← All writing
        </Link>

        {/* Article header */}
        <article>
          <header className="mt-16">
            {/* Category and metadata */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <Link href={`/category/${article.categorySlug}`} className="font-medium text-accent hover:opacity-80 transition">
                {article.category}
              </Link>
              <span className="text-muted-foreground opacity-60">·</span>
              <time dateTime={article.date} className="text-muted-foreground">
                {formatDate(article.date)}
              </time>
              <span className="text-muted-foreground opacity-60">·</span>
              <span className="text-muted-foreground">{article.readingTime} min read</span>
              {article.updatedAt && (
                <>
                  <span className="text-muted-foreground opacity-60">·</span>
                  <span className="text-muted-foreground">Updated {formatDate(article.updatedAt)}</span>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="mt-7 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{article.title}</h1>

            {/* Description */}
            <p className="mt-7 max-w-[42rem] text-lg leading-8 text-muted-foreground">{article.description}</p>
          </header>

          {/* Content */}
          <div className="mt-14 border-t border-line pt-14">
            <ArticleContentRenderer html={html} />
          </div>

          {/* Tags at the bottom */}
          {article.tags.length > 0 && (
            <div className="mt-16 border-t border-line pt-10">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tag/${slugify(tag)}`}
                    className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-muted-foreground transition hover:border-accent hover:bg-surface-hover hover:text-foreground"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Author section */}
          <AuthorSection />

          {/* Previous/Next navigation */}
          <PreviousNextNavigation articles={allArticles} currentSlug={article.slug} />
        </article>
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <SiteFooter />
    </>
  );
}
