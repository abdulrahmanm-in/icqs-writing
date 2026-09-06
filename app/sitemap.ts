import type { MetadataRoute } from "next";
import { getAllArticles, getCategories, getTags, slugify } from "@/lib/articles";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, categories, tags] = await Promise.all([getAllArticles(), getCategories(), getTags()]);
  return [
    { url: absoluteUrl(), changeFrequency: "weekly", priority: 1 },
    ...articles.map((article) => ({ url: absoluteUrl(`/articles/${article.slug}`), lastModified: article.updatedAt ?? article.date, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...categories.map((category) => ({ url: absoluteUrl(`/category/${category.slug}`), changeFrequency: "weekly" as const, priority: 0.6 })),
    ...tags.map((tag) => ({ url: absoluteUrl(`/tag/${slugify(tag)}`), changeFrequency: "weekly" as const, priority: 0.5 })),
  ];
}
