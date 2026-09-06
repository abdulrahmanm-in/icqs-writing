import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "About",
  description: "About Abdul Rahman M and ICQS Writing.",
};

const webLinks = [
  ["Portfolio", "https://portfolio.icqs.fyi"],
  ["GitHub", "https://github.com"],
  ["LinkedIn", "https://linkedin.com"],
] as const;

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-[48rem] flex-1 px-5 py-16 sm:px-8 sm:py-24">
        <Link href="/" className="text-sm text-accent transition hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">&larr; All writing</Link>
        <article className="mt-16">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">About</h1>
          <section className="mt-10 max-w-[42rem] space-y-6 text-lg leading-8 text-muted-foreground">
            <p>Hi, I&apos;m <strong className="text-foreground">Abdul Rahman M</strong>.</p>
            <p>I&apos;m a software developer interested in technology, software, and the things people build with them.</p>
            <p>This is my corner of the internet for ideas I&apos;m learning, building, using, questioning, or simply finding interesting.</p>
          </section>
          <section className="mt-16 max-w-[42rem] border-t border-line pt-10">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">What I write about</h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">Software engineering, technology, product design, and the human choices around them. I believe good software is built with intention, clarity, and respect for the people who use it.</p>
          </section>
          <section className="mt-16 border-t border-line pt-10">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">Find me around the web</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {webLinks.map(([label, href]) => <a key={label} href={href} className="inline-flex items-center rounded-md border border-line bg-surface px-4 py-2 text-sm font-medium text-foreground transition hover:border-accent hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">{label}</a>)}
            </div>
          </section>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
