export const siteConfig = {
  name: "ICQS Blog",
  description: "Notes on building dependable software, systems, and tools.",
  url: "https://writing.icqs.fyi",
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}
