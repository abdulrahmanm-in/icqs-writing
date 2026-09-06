import { notFound } from "next/navigation";
import { FilteredArticleList } from "@/components/filtered-article-list";
import { getAllArticles, getCategories } from "@/lib/articles";

export const dynamicParams = false;
export async function generateStaticParams() { return (await getCategories()).map((category) => ({ category: category.slug })); }

export default async function CategoryPage({ params }: PageProps<"/category/[category]">) {
  const { category } = await params;
  const categories = await getCategories();
  const selected = categories.find((item) => item.slug === category);
  if (!selected) notFound();
  const articles = (await getAllArticles()).filter((article) => article.categorySlug === category);
  return <FilteredArticleList eyebrow="Category" heading={selected.name} articles={articles} />;
}
