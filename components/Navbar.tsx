"use client";

import React from "react";
import { Sun, Moon, ArrowUpRight } from "lucide-react";

interface NavbarProps {
  historyCount: number;
  onOpenHistory: () => void;
  onOpenHowItWorks: () => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onReset: () => void;
}

export function Navbar({
  historyCount,
  onOpenHistory,
  onOpenHowItWorks,
  theme,
  onToggleTheme,
  onReset,
}: NavbarProps) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        width: "100%",
        height: "54px",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg-app)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        className="container-wide"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {/* Left: Brand + Nav items */}
        <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          {/* Brand */}
          <button
            onClick={onReset}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
              color: "var(--text-primary)",
            }}
            aria-label="SummarAI Home"
          >
            <span
              style={{
                fontSize: "1.05rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "var(--text-primary)",
              }}
            >
              SummarAI
            </span>
          </button>

          {/* Nav links */}
          <nav style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button
              onClick={onOpenHowItWorks}
              className="btn btn-ghost"
              style={{ fontSize: "0.85rem", padding: "6px 10px" }}
            >
              How it works
            </button>

            <button
              onClick={onOpenHistory}
              className="btn btn-ghost"
              style={{
                fontSize: "0.85rem",
                padding: "6px 10px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>History</span>
              {historyCount > 0 && (
                <span
                  className="font-mono"
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--text-muted)",
                    background: "var(--bg-subtle)",
                    padding: "1px 5px",
                    borderRadius: "var(--radius-xs)",
                  }}
                >
                  {historyCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Right: GitHub & Theme Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
            style={{
              fontSize: "0.85rem",
              padding: "6px 10px",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span>GitHub</span>
            <ArrowUpRight size={13} color="var(--text-muted)" />
          </a>

          <div
            style={{
              width: "1px",
              height: "16px",
              background: "var(--border)",
            }}
          />

          <button
            onClick={onToggleTheme}
            className="btn-icon"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>
    </header>
  );
}
