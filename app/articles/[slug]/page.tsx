import { redirect } from "next/navigation";

export const revalidate = 300;

export default async function ArticleRedirectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/${slug}`);
}
