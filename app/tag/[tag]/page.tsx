import { notFound } from "next/navigation";
import { FilteredArticleList } from "@/components/filtered-article-list";
import { getAllArticles, getTags, slugify } from "@/lib/articles";

export const revalidate = 300;

export default async function TagPage({ params }: PageProps<"/tag/[tag]">) {
  const { tag } = await params;
  const tags = await getTags();
  const selected = tags.find((item) => slugify(item) === tag);
  if (!selected) notFound();
  const articles = (await getAllArticles()).filter((article) => article.tags.some((item) => slugify(item) === tag));
  return <FilteredArticleList eyebrow="Topic" heading={`#${selected}`} articles={articles} />;
}
