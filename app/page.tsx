import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getAllArticles, getCategories, getTags, slugify } from "@/lib/articles";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function Home() {
  const [articles, categories, tags] = await Promise.all([getAllArticles(), getCategories(), getTags()]);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-12 sm:px-8 sm:py-16">
        <section className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent font-mono">ICQS / Writing</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">Things I&apos;m learning, building, and thinking about.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">Technology, software, ideas, observations, and everything that catches my attention.</p>
        </section>
        <div className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,1fr)_13rem]">
          <section aria-labelledby="latest">
            <h2 id="latest" className="mb-8 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">Latest writing</h2>
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </section>
          <aside className="space-y-9">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Categories</h2>
              <ul className="mt-3 space-y-2">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link href={`/category/${category.slug}`} className="text-sm text-muted-foreground hover:text-accent transition">
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Topics</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Link key={tag} href={`/tag/${slugify(tag)}`} className="text-sm text-muted-foreground hover:text-accent transition">
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
