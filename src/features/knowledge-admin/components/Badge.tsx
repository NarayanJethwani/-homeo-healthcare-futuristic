import React from "react";
import { EditorialStatus, EditorialRole } from "../types";
import { EvidenceLevel } from "@/features/knowledge/types";

interface BadgeProps {
  label: string;
  variant?: "success" | "warning" | "error" | "info" | "neutral";
  className?: string;
}

export function Badge({ label, variant = "neutral", className = "" }: BadgeProps) {
  const baseStyle = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-300";
  const variants = {
    success: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_2px_8px_rgba(16,185,129,0.1)]",
    warning: "bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-[0_2px_8px_rgba(245,158,11,0.1)]",
    error: "bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-[0_2px_8px_rgba(244,63,94,0.1)]",
    info: "bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 shadow-[0_2px_8px_rgba(6,182,212,0.1)]",
    neutral: "bg-slate-500/10 text-slate-400 border border-slate-500/20"
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`}>
      {label}
    </span>
  );
}

export function EditorialStatusBadge({ status }: { status: EditorialStatus }) {
  const map: Record<EditorialStatus, { label: string; variant: "success" | "warning" | "error" | "info" | "neutral" }> = {
    draft: { label: "Draft", variant: "neutral" },
    "medical-review": { label: "Medical Review", variant: "warning" },
    "legal-review": { label: "Legal Review", variant: "info" },
    published: { label: "Published", variant: "success" },
    archived: { label: "Archived", variant: "error" }
  };
  const item = map[status] || { label: status, variant: "neutral" };
  return <Badge label={item.label} variant={item.variant} />;
}

export function EvidenceBadge({ level }: { level: EvidenceLevel }) {
  const map: Record<EvidenceLevel, { label: string; variant: "success" | "warning" | "error" | "info" | "neutral" }> = {
    "Level-A": { label: "RCT (A)", variant: "success" },
    "Level-B": { label: "Cohort (B)", variant: "info" },
    "Level-C": { label: "Case (C)", variant: "warning" },
    "Traditional-Literature": { label: "Traditional", variant: "neutral" },
    "Expert-Opinion": { label: "Expert", variant: "info" },
    "Clinical-Experience": { label: "Experience", variant: "neutral" },
    "Clinical-Evidence": { label: "Clinical Evidence", variant: "success" },
    "Classical-Homeopathic-Literature": { label: "Classical Lit", variant: "neutral" },
    "Emerging-Research": { label: "Emerging", variant: "info" },
    "Consensus-Guidance": { label: "Consensus", variant: "warning" }
  };
  const item = map[level] || { label: level, variant: "neutral" };
  return <Badge label={item.label} variant={item.variant} />;
}

export function RoleBadge({ role }: { role: EditorialRole }) {
  const map: Record<EditorialRole, { label: string; variant: "success" | "warning" | "error" | "info" | "neutral" }> = {
    Administrator: { label: "Admin", variant: "error" },
    MedicalEditor: { label: "Editor", variant: "warning" },
    Reviewer: { label: "Reviewer", variant: "info" },
    Contributor: { label: "Contributor", variant: "success" },
    Viewer: { label: "Viewer", variant: "neutral" }
  };
  const item = map[role] || { label: role, variant: "neutral" };
  return <Badge label={item.label} variant={item.variant} />;
}
