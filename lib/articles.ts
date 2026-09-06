import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";

const contentDirectory = path.join(process.cwd(), "content");

export type Article = {
  slug: string; title: string; description: string; date: string; updatedAt?: string;
  category: string; categorySlug: string; tags: string[]; readingTime: number; content: string;
};
export type ArticleSummary = Omit<Article, "content">;
type Frontmatter = { title?: unknown; description?: unknown; date?: unknown; updatedAt?: unknown; category?: unknown; tags?: unknown; published?: unknown };

function text(value: unknown, field: string, fileName: string) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${fileName}: frontmatter \"${field}\" must be a non-empty string.`);
  return value.trim();
}

export function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function formatArticle(fileName: string, source: string): Article | null {
  const { data, content } = matter(source);
  const frontmatter = data as Frontmatter;
  if (frontmatter.published === false) return null;
  const title = text(frontmatter.title, "title", fileName);
  const description = text(frontmatter.description, "description", fileName);
  const date = text(frontmatter.date, "date", fileName);
  const category = text(frontmatter.category, "category", fileName);
  const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags.map((tag) => text(tag, "tags", fileName)) : [];
  const updatedAt = frontmatter.updatedAt ? text(frontmatter.updatedAt, "updatedAt", fileName) : undefined;
  const slug = path.basename(fileName, path.extname(fileName));
  const readingTime = Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 220));
  return { slug, title, description, date, updatedAt, category, categorySlug: slugify(category), tags, readingTime, content };
}

async function getArticlesWithContent(): Promise<Article[]> {
  const files = await readdir(contentDirectory, { withFileTypes: true });
  const articleFiles = files.filter((file) => file.isFile() && /\.mdx?$/i.test(file.name));
  const articles = await Promise.all(articleFiles.map(async (file) => formatArticle(file.name, await readFile(path.join(contentDirectory, file.name), "utf8"))));
  return articles.filter((article): article is Article => article !== null).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getAllArticles(): Promise<ArticleSummary[]> {
  return (await getArticlesWithContent()).map((article) => {
    const { content, ...summary } = article;
    void content;
    return summary;
  });
}
export async function getArticleBySlug(slug: string): Promise<Article | undefined> { return (await getArticlesWithContent()).find((article) => article.slug === slug); }
export async function getCategories() { return Array.from(new Map((await getAllArticles()).map((article) => [article.categorySlug, article.category])).entries()).map(([slug, name]) => ({ slug, name })); }
export async function getTags() { return Array.from(new Set((await getAllArticles()).flatMap((article) => article.tags))).sort(); }
export async function renderMarkdown(content: string) { return (await remark().use(remarkRehype).use(rehypeSanitize).use(rehypeStringify).process(content)).toString(); }
export function formatDate(date: string) { return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(date)); }
