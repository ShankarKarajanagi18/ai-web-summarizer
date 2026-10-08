"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { UrlInput } from "@/components/UrlInput";
import { FeaturesGrid } from "@/components/FeaturesGrid";
import { SummaryDashboard, SummaryResult } from "@/components/SummaryDashboard";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { HistoryDrawer, HistoryItem } from "@/components/HistoryDrawer";
import { HowItWorksModal } from "@/components/HowItWorksModal";
import { Toast } from "@/components/Toast";

const STORAGE_KEY = "summarai_history_v1";
const THEME_KEY = "summarai_theme";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SummaryResult | null>(null);

  // History state
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // How it works modal
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Theme state
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    try {
      const savedHist = localStorage.getItem(STORAGE_KEY);
      if (savedHist) {
        setHistory(JSON.parse(savedHist));
      }
    } catch {
      // Ignore localStorage errors
    }

    try {
      const savedTheme = localStorage.getItem(THEME_KEY) as "dark" | "light" | null;
      if (savedTheme === "light" || savedTheme === "dark") {
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
      } else {
        document.documentElement.setAttribute("data-theme", "dark");
      }
    } catch {
      // Ignore
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const saveToHistory = (newResult: SummaryResult) => {
    try {
      const newItem: HistoryItem = {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        result: newResult,
        timestamp: Date.now(),
      };

      setHistory((prev) => {
        const filtered = prev.filter((h) => h.result.url !== newResult.url);
        const updated = [newItem, ...filtered].slice(0, 30);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {}
        return updated;
      });
    } catch {}
  };

  const deleteHistoryItem = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast("Removed from history");
  };

  const clearAllHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    showToast("History cleared");
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setResult(item.result);
    setUrl(item.result.url);
    setError(null);
    setIsHistoryOpen(false);
  };

  async function handleSubmit(e?: FormEvent, overrideUrl?: string) {
    if (e) e.preventDefault();
    const targetUrl = (overrideUrl || url).trim();
    if (!targetUrl || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to summarize webpage.");
      }

      setResult(data);
      saveToHistory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const handleReset = () => {
    setResult(null);
    setError(null);
    setUrl("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-app)",
      }}
    >
      {/* Top Header */}
      <Navbar
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        onReset={handleReset}
      />

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Loading State */}
        {loading && <LoadingState url={url} />}

        {/* Error State */}
        {!loading && error && (
          <div style={{ paddingTop: "32px" }}>
            <UrlInput
              url={url}
              onChangeUrl={setUrl}
              onSubmit={handleSubmit}
              loading={loading}
              onClear={() => setUrl("")}
            />
            <ErrorState
              error={error}
              onRetry={() => handleSubmit()}
              onReset={handleReset}
            />
          </div>
        )}

        {/* Summary Dashboard Result View */}
        {!loading && !error && result && (
          <SummaryDashboard
            result={result}
            onReset={handleReset}
            onRegenerate={() => handleSubmit(undefined, result.url)}
            onShowToast={showToast}
          />
        )}

        {/* Home / Search View */}
        {!loading && !error && !result && (
          <div
            className="animate-fade-in"
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Hero />

            <UrlInput
              url={url}
              onChangeUrl={setUrl}
              onSubmit={handleSubmit}
              loading={loading}
              onClear={() => setUrl("")}
            />

            <FeaturesGrid />
          </div>
        )}
      </main>

      {/* Minimal Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "20px",
          textAlign: "center",
          fontSize: "0.82rem",
          color: "var(--text-muted)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <span>SummarAI</span>
        <span>•</span>
        <button
          onClick={() => setIsHowItWorksOpen(true)}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-secondary)",
            cursor: "pointer",
            fontSize: "inherit",
            textDecoration: "underline",
          }}
        >
          How it works
        </button>
      </footer>

      {/* Drawers & Modals */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={handleSelectHistory}
        onDelete={deleteHistoryItem}
        onClearAll={clearAllHistory}
      />

      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />

      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}
