import { getAllArticles } from "@/lib/articles";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const revalidate = 300;

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[character] ?? character);
}

export async function GET() {
  const articles = await getAllArticles();
  const items = articles.map((article) => `<item><title>${escapeXml(article.title)}</title><link>${absoluteUrl(`/${article.slug}`)}</link><guid isPermaLink="true">${absoluteUrl(`/${article.slug}`)}</guid><description>${escapeXml(article.description)}</description><pubDate>${new Date(article.date).toUTCString()}</pubDate></item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${siteConfig.name}</title><link>${siteConfig.url}</link><description>${escapeXml(siteConfig.description)}</description><language>en</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=0, s-maxage=3600" } });
}
