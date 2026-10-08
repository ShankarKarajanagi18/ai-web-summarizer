"use client";

import React, { useEffect, useState } from "react";

interface LoadingStateProps {
  url: string;
}

const STAGES = [
  "Connecting to webpage...",
  "Extracting main content and structure...",
  "Synthesizing summary...",
];

export function LoadingState({ url }: LoadingStateProps) {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStageIndex((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  let domain = "";
  try {
    domain = new URL(url).hostname;
  } catch {
    domain = url;
  }

  return (
    <div
      className="container-narrow animate-fade-in"
      style={{
        paddingTop: "60px",
        paddingBottom: "80px",
        textAlign: "center",
      }}
    >
      <div
        className="surface-card"
        style={{
          maxWidth: "480px",
          margin: "0 auto",
          padding: "36px 28px",
          textAlign: "center",
        }}
      >
        <div
          className="animate-spin"
          style={{
            width: "24px",
            height: "24px",
            border: "2px solid var(--border)",
            borderTopColor: "var(--accent)",
            borderRadius: "50%",
            margin: "0 auto 18px",
          }}
        />

        <div
          style={{
            fontSize: "0.95rem",
            fontWeight: 500,
            color: "var(--text-primary)",
            marginBottom: "6px",
          }}
        >
          {STAGES[stageIndex]}
        </div>

        <div
          className="font-mono"
          style={{
            fontSize: "0.8rem",
            color: "var(--text-muted)",
          }}
        >
          {domain}
        </div>
      </div>
    </div>
  );
}
