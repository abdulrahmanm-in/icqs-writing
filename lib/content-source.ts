import "server-only";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const REVALIDATE_SECONDS = 300;
const defaultSource = process.env.NODE_ENV === "production" ? "github" : "local";
const source = process.env.BLOG_CONTENT_SOURCE ?? defaultSource;
const repository = process.env.GITHUB_CONTENT_REPOSITORY ?? "abdulrahmanm-in/icqs-writing-content";
const branch = process.env.GITHUB_CONTENT_BRANCH ?? "main";
const contentDirectory = path.join(process.cwd(), "content");

export type Article = { slug: string; title: string; description: string; date: string; updatedAt?: string; category: string; categorySlug: string; tags: string[]; readingTime: number; content: string };
export type ArticleSummary = Omit<Article, "content">;
type Frontmatter = { title?: unknown; description?: unknown; date?: unknown; updatedAt?: unknown; category?: unknown; tags?: unknown; published?: unknown };
type ContentFile = { name: string; content: string };
type GitHubTreeResponse = { tree?: Array<{ path?: string; type?: string }>; truncated?: boolean };

class ContentSourceError extends Error {
  constructor(message: string) { super(message); this.name = "ContentSourceError"; }
}

function text(value: unknown, field: string, fileName: string) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${fileName}: frontmatter \"${field}\" must be a non-empty string.`);
  return value.trim();
}

function dateValue(value: unknown, field: string, fileName: string) {
  const parsed = text(value, field, fileName);
  if (Number.isNaN(Date.parse(parsed))) throw new Error(`${fileName}: frontmatter \"${field}\" must be a valid date.`);
  return parsed;
}

export function slugify(value: string) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

function formatArticle(fileName: string, source: string): Article | null {
  const { data, content } = matter(source);
  const frontmatter = data as Frontmatter;
  if (frontmatter.published === false) return null;
  const title = text(frontmatter.title, "title", fileName);
  const description = text(frontmatter.description, "description", fileName);
  const date = dateValue(frontmatter.date, "date", fileName);
  const category = text(frontmatter.category, "category", fileName);
  const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags.map((tag) => text(tag, "tags", fileName)) : [];
  const updatedAt = frontmatter.updatedAt ? dateValue(frontmatter.updatedAt, "updatedAt", fileName) : undefined;
  const slug = path.basename(fileName, path.extname(fileName));
  const readingTime = Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 220));
  return { slug, title, description, date, updatedAt, category, categorySlug: slugify(category), tags, readingTime, content };
}

function githubHeaders() {
  const token = process.env.GITHUB_TOKEN;
  return { Accept: "application/vnd.github+json", "User-Agent": "icqs-writing", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

async function fetchGitHub(url: string) {
  const response = await fetch(url, { headers: githubHeaders(), cache: "force-cache", next: { revalidate: REVALIDATE_SECONDS, tags: ["blog-content"] } });
  if (!response.ok) throw new ContentSourceError(`GitHub content request failed (${response.status}).`);
  return response;
}

async function getGitHubContentFiles(): Promise<ContentFile[]> {
  const treeUrl = `https://api.github.com/repos/${repository}/git/trees/${encodeURIComponent(branch)}?recursive=1`;
  const tree = await (await fetchGitHub(treeUrl)).json() as GitHubTreeResponse;
  if (!Array.isArray(tree.tree)) throw new ContentSourceError("GitHub returned an invalid repository tree.");
  if (tree.truncated) throw new ContentSourceError("GitHub repository tree is too large to inspect safely.");
  const files = tree.tree.filter((entry) => entry.type === "blob" && typeof entry.path === "string" && !entry.path.includes("/") && /\.mdx?$/i.test(entry.path));
  return Promise.all(files.map(async ({ path: fileName }) => {
    const rawUrl = `https://raw.githubusercontent.com/${repository}/${encodeURIComponent(branch)}/${encodeURIComponent(fileName!)}`;
    return { name: fileName!, content: await (await fetchGitHub(rawUrl)).text() };
  }));
}

async function getLocalContentFiles(): Promise<ContentFile[]> {
  try {
    const files = await readdir(contentDirectory, { withFileTypes: true });
    return Promise.all(files.filter((file) => file.isFile() && /\.mdx?$/i.test(file.name)).map(async (file) => ({ name: file.name, content: await readFile(path.join(contentDirectory, file.name), "utf8") })));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function getContentFiles() {
  if (source === "local") return getLocalContentFiles();
  if (source === "github") return getGitHubContentFiles();
  throw new ContentSourceError(`Unsupported BLOG_CONTENT_SOURCE: ${source}.`);
}

export async function getArticles(): Promise<Article[]> {
  let files: ContentFile[];
  try {
    files = await getContentFiles();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown content-source error.";
    console.error(`Unable to load blog content: ${message}`);
    return [];
  }
  const articles = files.flatMap((file) => {
    try { const article = formatArticle(file.name, file.content); return article ? [article] : []; }
    catch (error) { console.error(`Skipping invalid blog article ${file.name}:`, error); return []; }
  });
  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getAllArticles(): Promise<ArticleSummary[]> {
  return (await getArticles()).map((article) => { const { content, ...summary } = article; void content; return summary; });
}
export async function getArticleBySlug(slug: string): Promise<Article | undefined> { return (await getArticles()).find((article) => article.slug === slug); }
export async function getCategories() { return Array.from(new Map((await getAllArticles()).map((article) => [article.categorySlug, article.category])).entries()).map(([slug, name]) => ({ slug, name })); }
export async function getTags() { return Array.from(new Set((await getAllArticles()).flatMap((article) => article.tags))).sort(); }
export function formatDate(date: string) { return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(date)); }
