"use client";

import { FormEvent, useState } from "react";

type Result = {
  title: string;
  url: string;
  summary: string;
  charactersAnalyzed: number;
};

function renderSummary(summary: string) {
  const lines = summary.split("\n").map((l) => l.trim()).filter(Boolean);
  const paragraphs: string[] = [];
  const bullets: string[] = [];

  for (const line of lines) {
    if (/^[-*•]\s+/.test(line)) bullets.push(line.replace(/^[-*•]\s+/, ""));
    else paragraphs.push(line);
  }

  const clean = (s: string) => s.replace(/\*\*(.*?)\*\*/g, "$1");

  return (
    <>
      {paragraphs.map((p, i) => (
        <p key={i}>{clean(p)}</p>
      ))}
      {bullets.length > 0 && (
        <ul>
          {bullets.map((b, i) => (
            <li key={i}>{clean(b)}</li>
          ))}
        </ul>
      )}
    </>
  );
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!url.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <header>
        <h1>AI Web Summarizer</h1>
        <p className="subtitle">Paste a link. Get the gist in seconds.</p>
      </header>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          inputMode="url"
          placeholder="https://example.com/article"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
          aria-label="Webpage URL"
          autoFocus
        />
        <button type="submit" disabled={loading || !url.trim()}>
          {loading ? "Loading..." : "Summarize"}
        </button>
      </form>

      {loading && (
        <div className="status" role="status">
          <span className="spinner" aria-hidden="true" />
          Loading... scraping the page and writing your summary.
        </div>
      )}

      {error && (
        <div className="error" role="alert">
          {error}
        </div>
      )}

      {result && (
        <section className="card">
          <h2>{result.title || "Summary"}</h2>
          <a href={result.url} target="_blank" rel="noopener noreferrer" className="source">
            {result.url}
          </a>
          <div className="summary">{renderSummary(result.summary)}</div>
          <p className="meta">
            Based on ~{result.charactersAnalyzed.toLocaleString()} characters of page text
          </p>
        </section>
      )}
    </main>
  );
}
