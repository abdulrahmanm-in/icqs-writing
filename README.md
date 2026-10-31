# ICQS / Writing

The source for [writing.icqs.fyi](https://writing.icqs.fyi): a calm, Markdown-first developer blog built with Next.js.

The application and published articles live in separate repositories by design. This repository owns the site; [`icqs-writing-content`](https://github.com/abdulrahmanm-in/icqs-writing-content) owns the writing.

## Stack

- Next.js App Router, React, and TypeScript
- Tailwind CSS
- Markdown with YAML frontmatter
- Vercel deployment and Cloudflare DNS
- GitHub as the production content source

## What is included

- Responsive homepage and latest-article list
- Dynamic article, category, and tag routes
- Light and dark themes
- Markdown rendering with sanitization
- Per-article SEO metadata and JSON-LD
- RSS feed, sitemap, robots file, and custom 404 page

## Content architecture

Production content comes from the root of:

```text
https://github.com/abdulrahmanm-in/icqs-writing-content
branch: main
```

`lib/content-source.ts` is the only layer that knows how content is loaded. On the server, it:

1. Uses GitHub's recursive repository-tree API to discover root-level `.md` and `.mdx` files.
2. Fetches their contents through GitHub's raw-content endpoint.
3. Parses and validates frontmatter, then excludes unpublished or invalid files.
4. Caches GitHub responses through Next.js for five minutes.

The browser never fetches GitHub directly, and no GitHub credentials are exposed to client-side code.

### Publishing an article

Add a Markdown file directly at the root of `icqs-writing-content`. Do not create category directories.

```md
---
title: "A clear article title"
description: "A concise summary for readers and search engines."
date: "2026-09-06"
updatedAt: "2026-09-07" # optional
category: "Engineering"
tags:
  - Next.js
  - Architecture
published: true
---

Article body in Markdown.
```

The filename becomes the slug. For example, `building-a-blog.md` becomes `/building-a-blog`.

After a commit reaches `main`, the article is normally visible within five minutes, after the existing Next.js cache revalidates. No site redeploy, webhook, database, or CMS is required. New article/category/tag routes resolve on demand; they are not restricted by `generateStaticParams`.

### Content rules

Required frontmatter fields are `title`, `description`, `date`, and `category`. `tags` is optional and must be a list of strings. Set `published: false` to exclude an article from every public surface.

Malformed Markdown or frontmatter is skipped rather than taking down the site. A missing article resolves to the 404 page. If GitHub is temporarily unavailable, the site continues serving its cached result when one exists; an uncached failure safely produces an empty article set rather than exposing an error to visitors.

## Local development

### Prerequisites

- Node.js 20 or newer
- npm

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

By default, development uses flat Markdown files in the local `content/` directory. This is useful for working without a network connection.

To test the production GitHub source locally, create `.env.local` from `.env.example`:

```env
BLOG_CONTENT_SOURCE=github
GITHUB_CONTENT_REPOSITORY=abdulrahmanm-in/icqs-writing-content
GITHUB_CONTENT_BRANCH=main
```

Restart the development server after changing environment variables.

`GITHUB_TOKEN` is optional because the content repository is public. Add it only when GitHub API rate limits become a concern. It must remain server-only: never commit it and never use a `NEXT_PUBLIC_` prefix.

## Environment variables

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `BLOG_CONTENT_SOURCE` | No | `github` in production, `local` in development | Selects the content source. |
| `GITHUB_CONTENT_REPOSITORY` | No | `abdulrahmanm-in/icqs-writing-content` | GitHub owner/repository. |
| `GITHUB_CONTENT_BRANCH` | No | `main` | Content repository branch. |
| `GITHUB_TOKEN` | No | — | Server-only token for higher GitHub API limits. |

## Commands

```bash
npm run dev     # Start the development server
npm run lint    # Run ESLint
npm run build   # Create a production build
npm run start   # Serve a completed production build
```

Before opening a pull request or deploying, run:

```bash
npm run lint
npm run build
```

## Deployment

Deploy this repository to Vercel. Configure the custom domain `writing.icqs.fyi` through Vercel and Cloudflare DNS.

The GitHub source variables are optional in Vercel because the production defaults already target the ICQS content repository. Adding them explicitly to both Production and Preview environments is still recommended for clear, auditable configuration.

## Project structure

```text
app/                    Routes, metadata, sitemap, RSS, and page layouts
components/             Reusable presentation and theme components
content/                Optional local Markdown for development
hooks/                  Client-side behavior for rendered content
lib/content-source.ts   Server-only local/GitHub article source
lib/articles.ts         Article API and Markdown rendering
public/favicon.ico      Site favicon
```

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
