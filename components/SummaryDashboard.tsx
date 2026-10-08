"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Copy,
  Check,
  Share2,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

export interface SummaryResult {
  title: string;
  url: string;
  summary: string;
  charactersAnalyzed: number;
}

interface SummaryDashboardProps {
  result: SummaryResult;
  onReset: () => void;
  onRegenerate: () => void;
  onShowToast: (msg: string) => void;
}

function parseSummary(summary: string) {
  const lines = summary.split("\n").map((l) => l.trim()).filter(Boolean);
  const paragraphs: string[] = [];
  const takeaways: string[] = [];

  for (const line of lines) {
    if (/^[-*•]\s+/.test(line)) {
      takeaways.push(line.replace(/^[-*•]\s+/, ""));
    } else if (/^\d+[\.\)]\s+/.test(line)) {
      takeaways.push(line.replace(/^\d+[\.\)]\s+/, ""));
    } else {
      paragraphs.push(line);
    }
  }

  if (takeaways.length === 0 && paragraphs.length > 1) {
    return {
      overview: [paragraphs[0]],
      takeaways: paragraphs.slice(1),
    };
  }

  return {
    overview: paragraphs.length > 0 ? paragraphs : ["Summary generated."],
    takeaways,
  };
}

const cleanMarkdown = (s: string) =>
  s
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`(.*?)`/g, "$1");

export function SummaryDashboard({
  result,
  onReset,
  onRegenerate,
  onShowToast,
}: SummaryDashboardProps) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  let domain = "";
  try {
    domain = new URL(result.url).hostname.replace(/^www\./, "");
  } catch {
    domain = result.url;
  }

  const { overview, takeaways } = parseSummary(result.summary);

  // Statistics
  const origWords = Math.max(1, Math.round(result.charactersAnalyzed / 5.5));
  const summaryWords = result.summary.trim().split(/\s+/).filter(Boolean).length;
  const timeSavedMin = Math.max(
    1,
    Math.round(Math.max(0, origWords - summaryWords) / 200)
  );

  const handleCopy = () => {
    const formatted = `# ${result.title || "Summary"}\nSource: ${
      result.url
    }\n\n## Executive Summary\n${overview.join(
      "\n\n"
    )}\n\n## Key Takeaways\n${takeaways.map((t, i) => `${i + 1}. ${t}`).join("\n")}`;

    navigator.clipboard.writeText(formatted);
    setCopied(true);
    onShowToast("Summary copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: result.title || "Web Summary",
          text: `Summary of ${result.title}:\n${overview[0] || ""}`,
          url: result.url,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(result.url);
      setShared(true);
      onShowToast("URL copied to clipboard");
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <article
      className="container-narrow animate-fade-in"
      style={{
        paddingTop: "24px",
        paddingBottom: "80px",
      }}
    >
      {/* Top Action Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "28px",
          paddingBottom: "14px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <button
          onClick={onReset}
          className="btn btn-ghost"
          style={{ padding: "6px 8px", fontSize: "0.85rem" }}
        >
          <ArrowLeft size={15} />
          <span>Back to search</span>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={handleCopy}
            className="btn btn-secondary"
            style={{ fontSize: "0.82rem", padding: "6px 12px" }}
          >
            {copied ? (
              <>
                <Check size={14} color="#10b981" />
                <span style={{ color: "#10b981" }}>Copied</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handleShare}
            className="btn btn-secondary"
            style={{ fontSize: "0.82rem", padding: "6px 12px" }}
          >
            {shared ? (
              <>
                <Check size={14} color="#10b981" />
                <span style={{ color: "#10b981" }}>Shared</span>
              </>
            ) : (
              <>
                <Share2 size={14} />
                <span>Share</span>
              </>
            )}
          </button>

          <button
            onClick={onRegenerate}
            className="btn btn-ghost"
            style={{ fontSize: "0.82rem", padding: "6px 10px" }}
            title="Regenerate summary"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Header Section: Title, Domain, Meta */}
      <header style={{ marginBottom: "32px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "0.84rem",
            color: "var(--text-muted)",
            marginBottom: "10px",
          }}
        >
          <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>
            {domain}
          </span>
          <span>•</span>
          <span>~{origWords.toLocaleString()} words original</span>
          <span>•</span>
          <span style={{ color: "var(--accent)" }}>~{timeSavedMin} min saved</span>
        </div>

        <h1
          style={{
            fontSize: "clamp(1.75rem, 3.5vw, 2.3rem)",
            fontWeight: 700,
            lineHeight: 1.25,
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
            marginBottom: "12px",
          }}
        >
          {result.title || "Webpage Summary"}
        </h1>

        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            fontSize: "0.84rem",
            color: "var(--text-muted)",
            textDecoration: "none",
            wordBreak: "break-all",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--text-primary)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--text-muted)")
          }
        >
          <span style={{ textDecoration: "underline", textUnderlineOffset: "3px" }}>
            {result.url}
          </span>
          <ExternalLink size={12} style={{ flexShrink: 0 }} />
        </a>
      </header>

      {/* Main Summary Section */}
      <section style={{ marginBottom: "36px" }}>
        <h2
          style={{
            fontSize: "0.92rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--text-muted)",
            marginBottom: "14px",
          }}
        >
          Summary
        </h2>

        <div
          style={{
            fontSize: "1.06rem",
            lineHeight: 1.75,
            color: "var(--text-primary)",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          {overview.map((p, idx) => (
            <p key={idx}>{cleanMarkdown(p)}</p>
          ))}
        </div>
      </section>

      {/* Divider */}
      <hr
        style={{
          border: "none",
          borderTop: "1px solid var(--border)",
          margin: "36px 0",
        }}
      />

      {/* Key Takeaways Section */}
      {takeaways.length > 0 && (
        <section style={{ marginBottom: "40px" }}>
          <h2
            style={{
              fontSize: "0.92rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--text-muted)",
              marginBottom: "16px",
            }}
          >
            Key Insights
          </h2>

          <ul
            style={{
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              padding: 0,
            }}
          >
            {takeaways.map((item, idx) => (
              <li
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  fontSize: "1rem",
                  lineHeight: 1.6,
                  color: "var(--text-secondary)",
                }}
              >
                <span
                  className="font-mono"
                  style={{
                    color: "var(--accent)",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    marginTop: "2px",
                    flexShrink: 0,
                  }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span style={{ color: "var(--text-primary)" }}>
                  {cleanMarkdown(item)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Source Footer */}
      <footer
        style={{
          paddingTop: "24px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "0.82rem",
          color: "var(--text-muted)",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <span>
          Extracted {result.charactersAnalyzed.toLocaleString()} characters
        </span>

        <button
          onClick={handleCopy}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-secondary)",
            cursor: "pointer",
            fontSize: "inherit",
            textDecoration: "underline",
          }}
        >
          Copy markdown
        </button>
      </footer>
    </article>
  );
}
