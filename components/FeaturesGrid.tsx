"use client";

import React from "react";
import { Zap, BookOpen, ExternalLink } from "lucide-react";

export function FeaturesGrid() {
  const features = [
    {
      icon: Zap,
      title: "Instant summaries",
      description: "Extract the main ideas without reading the entire page.",
    },
    {
      icon: BookOpen,
      title: "Key insights",
      description: "Surface important facts, bullet points, and conclusions automatically.",
    },
    {
      icon: ExternalLink,
      title: "Source-aware",
      description: "Keep original context, word statistics, and source references visible.",
    },
  ];

  return (
    <section
      style={{
        maxWidth: "760px",
        margin: "16px auto 64px",
        width: "100%",
        padding: "0 16px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "14px",
        }}
      >
        {features.map((feat, i) => {
          const Icon = feat.icon;
          return (
            <div
              key={i}
              className="surface-card"
              style={{
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--bg-subtle)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-secondary)",
                }}
              >
                <Icon size={16} />
              </div>

              <div>
                <h3
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: "4px",
                  }}
                >
                  {feat.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.5,
                  }}
                >
                  {feat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
