"use client";

import { useCodeBlockEnhancement } from "@/hooks/use-code-block-enhancement";

interface ArticleContentProps {
  html: string;
}

export function ArticleContentRenderer({ html }: ArticleContentProps) {
  useCodeBlockEnhancement();

  return <div className="article-content" dangerouslySetInnerHTML={{ __html: html }} />;
}
