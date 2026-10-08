"use client";

import React, { useState } from "react";
import { X, Search, Trash2, ArrowRight } from "lucide-react";
import { SummaryResult } from "./SummaryDashboard";

export interface HistoryItem {
  id: string;
  result: SummaryResult;
  timestamp: number;
}

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function HistoryDrawer({
  isOpen,
  onClose,
  history,
  onSelect,
  onDelete,
  onClearAll,
}: HistoryDrawerProps) {
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  const filtered = history.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.result.title.toLowerCase().includes(q) ||
      item.result.url.toLowerCase().includes(q)
    );
  });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0, 0, 0, 0.45)",
        }}
      />

      {/* Drawer Container */}
      <div
        className="animate-fade-in"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "460px",
          height: "100%",
          background: "var(--bg-app)",
          borderLeft: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          zIndex: 51,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontWeight: 600, fontSize: "1rem", color: "var(--text-primary)" }}>
              History
            </span>
            <span
              className="font-mono"
              style={{
                fontSize: "0.75rem",
                color: "var(--text-muted)",
              }}
            >
              ({history.length})
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {history.length > 0 && (
              <button
                onClick={onClearAll}
                className="btn-ghost"
                style={{
                  fontSize: "0.78rem",
                  padding: "4px 8px",
                  borderRadius: "var(--radius-xs)",
                  color: "var(--text-muted)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Clear all
              </button>
            )}

            <button
              onClick={onClose}
              className="btn-icon"
              aria-label="Close history"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Search */}
        {history.length > 0 && (
          <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border)" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                padding: "6px 10px",
              }}
            >
              <Search size={14} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search history..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--text-primary)",
                  fontSize: "0.85rem",
                }}
              />
            </div>
          </div>
        )}

        {/* List items - Clean table / row style, not cards */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {history.length === 0 ? (
            <div
              style={{
                padding: "48px 24px",
                textAlign: "center",
                color: "var(--text-muted)",
                fontSize: "0.88rem",
              }}
            >
              No past summaries yet.
            </div>
          ) : filtered.length === 0 ? (
            <div
              style={{
                padding: "36px 20px",
                textAlign: "center",
                color: "var(--text-muted)",
                fontSize: "0.88rem",
              }}
            >
              No results found.
            </div>
          ) : (
            filtered.map((item) => {
              let domain = "";
              try {
                domain = new URL(item.result.url).hostname.replace(/^www\./, "");
              } catch {
                domain = item.result.url;
              }

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  style={{
                    padding: "14px 20px",
                    borderBottom: "1px solid var(--border)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "14px",
                    transition: "background 0.12s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--bg-surface)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        color: "var(--text-primary)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        marginBottom: "4px",
                      }}
                    >
                      {item.result.title || "Webpage Summary"}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "0.78rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      <span>{domain}</span>
                      <span>•</span>
                      <span>{formatDate(item.timestamp)}</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.id);
                      }}
                      className="btn-icon"
                      style={{ padding: "4px" }}
                      title="Delete"
                      aria-label="Delete"
                    >
                      <Trash2 size={13} />
                    </button>

                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--accent)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "2px",
                      }}
                    >
                      Open <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
