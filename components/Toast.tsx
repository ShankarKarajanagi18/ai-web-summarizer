"use client";

import React from "react";
import { Check } from "lucide-react";

interface ToastProps {
  message: string;
  onClose: () => void;
}

export function Toast({ message }: ToastProps) {
  return (
    <div
      className="animate-fade-in"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 100,
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        padding: "8px 14px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        color: "var(--text-primary)",
        fontSize: "0.84rem",
        fontWeight: 500,
      }}
    >
      <Check size={14} color="#10b981" />
      <span>{message}</span>
    </div>
  );
}
