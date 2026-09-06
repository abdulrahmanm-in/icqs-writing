import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://blogs.icqs.fyi"),
  title: {
    default: "ICQS / Writing",
    template: "%s | ICQS / Writing",
  },
  description: "Technology, software, ideas, observations, and everything that catches my attention.",
  alternates: {
    types: {
      "application/rss+xml": "https://blogs.icqs.fyi/rss.xml",
    },
  },
  openGraph: {
    type: "website",
    siteName: "ICQS / Writing",
    title: "ICQS / Writing",
    description: "Technology, software, ideas, observations, and everything that catches my attention.",
  },
  twitter: { card: "summary" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const stored = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const theme = stored || (prefersDark ? 'dark' : 'light');
                document.documentElement.className = theme;
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
