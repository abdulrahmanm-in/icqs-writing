import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-5 py-24 sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">404</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">That page does not exist.</h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">The address may be outdated, or the article may have moved.</p>
        <Link href="/" className="mt-8 w-fit rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-background transition hover:opacity-90">
          Back to writing
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
