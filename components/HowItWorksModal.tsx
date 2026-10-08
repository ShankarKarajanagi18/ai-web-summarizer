"use client";

import React from "react";
import { X } from "lucide-react";

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowItWorksModal({ isOpen, onClose }: HowItWorksModalProps) {
  if (!isOpen) return null;

  const steps = [
    {
      title: "1. Safe URL Resolution",
      desc: "Validates protocol, resolves DNS, and enforces SSRF protection by blocking private IPv4, IPv6, and localhost addresses.",
    },
    {
      title: "2. Content Extraction",
      desc: "Cleans scripts, navigation, and ads using Cheerio. Automatically falls back to reader rendering for client-side JavaScript apps.",
    },
    {
      title: "3. Neural Synthesis",
      desc: "Processes extracted text with high-speed language models to produce an executive overview and structured key insights.",
    },
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0, 0, 0, 0.55)",
        }}
      />

      {/* Modal Dialog */}
      <div
        className="animate-fade-in"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "500px",
          background: "var(--bg-app)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "24px",
          zIndex: 61,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "18px",
          }}
        >
          <h3
            style={{
              fontSize: "1.05rem",
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            How it works
          </h3>

          <button
            onClick={onClose}
            className="btn-icon"
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {steps.map((st, i) => (
            <div key={i}>
              <h4
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  marginBottom: "4px",
                }}
              >
                {st.title}
              </h4>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.5,
                }}
              >
                {st.desc}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "20px",
            paddingTop: "16px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ fontSize: "0.85rem" }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
