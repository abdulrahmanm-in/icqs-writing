import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";

export {
  formatDate,
  getAllArticles,
  getArticleBySlug,
  getArticles,
  getCategories,
  getTags,
  slugify,
  type Article,
  type ArticleSummary,
} from "@/lib/content-source";

export async function renderMarkdown(content: string) {
  return (await remark().use(remarkRehype).use(rehypeSanitize).use(rehypeStringify).process(content)).toString();
}
