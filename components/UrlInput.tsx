"use client";

import React, { FormEvent, useEffect, useState, useRef } from "react";
import { Link2, X } from "lucide-react";

interface UrlInputProps {
  url: string;
  onChangeUrl: (val: string) => void;
  onSubmit: (e?: FormEvent) => void;
  loading: boolean;
  onClear: () => void;
}

const EXAMPLES = [
  {
    label: "Tech article",
    url: "https://en.wikipedia.org/wiki/Artificial_intelligence",
  },
  {
    label: "Documentation",
    url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview",
  },
  {
    label: "News",
    url: "https://en.wikipedia.org/wiki/Web_scraping",
  },
  {
    label: "Portfolio",
    url: "https://shankar-portfolio-delta.vercel.app/",
  },
];

export function UrlInput({
  url,
  onChangeUrl,
  onSubmit,
  loading,
  onClear,
}: UrlInputProps) {
  const [isMac, setIsMac] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent));
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div
      style={{
        maxWidth: "680px",
        margin: "0 auto 36px",
        width: "100%",
        padding: "0 16px",
      }}
    >
      {/* Command Search Style Bar */}
      <form
        onSubmit={onSubmit}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)",
          padding: "6px 8px 6px 14px",
          height: "54px",
          transition: "border-color 0.15s ease",
        }}
        className="url-input-form"
      >
        <Link2 size={17} color="var(--text-muted)" style={{ flexShrink: 0 }} />

        <input
          ref={inputRef}
          type="url"
          inputMode="url"
          placeholder="Paste a webpage URL..."
          value={url}
          onChange={(e) => onChangeUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          aria-label="Webpage URL input"
          autoFocus
          style={{
            flex: 1,
            minWidth: 0,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "var(--text-primary)",
            fontSize: "0.95rem",
            fontFamily: "inherit",
          }}
        />

        {url.length > 0 && !loading && (
          <button
            type="button"
            onClick={onClear}
            className="btn-icon"
            style={{ padding: "4px" }}
            aria-label="Clear input"
            title="Clear"
          >
            <X size={15} />
          </button>
        )}

        <div
          className="kbd-hint"
          style={{
            fontSize: "0.72rem",
            color: "var(--text-muted)",
            background: "var(--bg-subtle)",
            padding: "3px 6px",
            borderRadius: "var(--radius-xs)",
            userSelect: "none",
          }}
        >
          {isMac ? "⌘↵" : "Ctrl↵"}
        </div>

        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="btn btn-primary"
          style={{
            height: "38px",
            padding: "0 18px",
            fontSize: "0.88rem",
            fontWeight: 500,
            borderRadius: "var(--radius-sm)",
          }}
        >
          {loading ? (
            <div
              className="animate-spin"
              style={{
                width: "14px",
                height: "14px",
                border: "2px solid rgba(255,255,255,0.3)",
                borderTopColor: "#fff",
                borderRadius: "50%",
              }}
            />
          ) : (
            "Summarize"
          )}
        </button>
      </form>

      {/* Examples row - visually quiet text links */}
      <div
        style={{
          marginTop: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          flexWrap: "wrap",
          fontSize: "0.84rem",
        }}
      >
        <span style={{ color: "var(--text-muted)" }}>Try an example:</span>
        {EXAMPLES.map((ex, i) => (
          <React.Fragment key={ex.label}>
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                onChangeUrl(ex.url);
                inputRef.current?.focus();
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-secondary)",
                cursor: "pointer",
                padding: "2px 0",
                fontSize: "inherit",
                fontFamily: "inherit",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
                textDecorationColor: "var(--border)",
                transition: "color 0.15s ease, text-decoration-color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--text-primary)";
                e.currentTarget.style.textDecorationColor = "var(--text-secondary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-secondary)";
                e.currentTarget.style.textDecorationColor = "var(--border)";
              }}
            >
              {ex.label}
            </button>
            {i < EXAMPLES.length - 1 && (
              <span style={{ color: "var(--border)" }}>•</span>
            )}
          </React.Fragment>
        ))}
      </div>

      <style jsx>{`
        .url-input-form:focus-within {
          border-color: var(--border-focus) !important;
        }

        @media (max-width: 580px) {
          .kbd-hint {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
