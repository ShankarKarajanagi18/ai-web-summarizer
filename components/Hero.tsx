"use client";

import React from "react";

export function Hero() {
  return (
    <section
      style={{
        textAlign: "center",
        maxWidth: "680px",
        margin: "0 auto 28px",
        padding: "48px 16px 0",
      }}
    >
      <h1
        style={{
          fontSize: "clamp(2rem, 4vw, 2.75rem)",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          lineHeight: 1.15,
          color: "var(--text-primary)",
          marginBottom: "14px",
        }}
      >
        Turn long pages into useful summaries.
      </h1>

      <p
        style={{
          fontSize: "1.05rem",
          color: "var(--text-secondary)",
          lineHeight: 1.5,
          maxWidth: "520px",
          margin: "0 auto",
        }}
      >
        Paste a public webpage and get the key ideas, insights, and takeaways in
        seconds.
      </p>
    </section>
  );
}
