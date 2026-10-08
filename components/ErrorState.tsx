"use client";

import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
  onReset: () => void;
}

export function ErrorState({ error, onRetry, onReset }: ErrorStateProps) {
  return (
    <div
      className="container-narrow animate-fade-in"
      style={{
        paddingTop: "20px",
        paddingBottom: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "580px",
          margin: "0 auto",
          padding: "24px",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)",
          background: "var(--bg-surface)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "16px" }}>
          <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: "2px" }} />
          <div>
            <h3
              style={{
                fontSize: "0.95rem",
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: "4px",
              }}
            >
              Could not summarize webpage
            </h3>
            <p
              style={{
                fontSize: "0.88rem",
                color: "var(--text-secondary)",
                lineHeight: 1.5,
              }}
            >
              {error}
            </p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            justifyContent: "flex-end",
            paddingTop: "14px",
            borderTop: "1px solid var(--border)",
          }}
        >
          <button
            onClick={onReset}
            className="btn btn-ghost"
            style={{ fontSize: "0.85rem" }}
          >
            Try another URL
          </button>

          <button
            onClick={onRetry}
            className="btn btn-secondary"
            style={{ fontSize: "0.85rem" }}
          >
            <RefreshCw size={13} />
            <span>Retry</span>
          </button>
        </div>
      </div>
    </div>
  );
}
