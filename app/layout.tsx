import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SummarAI — Turn long pages into useful summaries",
  description:
    "Paste a public webpage and get the key ideas, insights, and takeaways in seconds.",
  keywords: [
    "SummarAI",
    "web summarizer",
    "article summary",
    "developer tools",
    "productivity",
  ],
  openGraph: {
    title: "SummarAI — Turn long pages into useful summaries",
    description:
      "Paste a public webpage and get the key ideas, insights, and takeaways in seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
