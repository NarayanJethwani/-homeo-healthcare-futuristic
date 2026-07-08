"use client";

import React from "react";
import Link from "next/link";
import { usePatientMode, simplifyMedicalJargon } from "../context/PatientModeContext";
import { GraduationCap, ShieldAlert, ArrowRight } from "lucide-react";

interface PatientFriendlyTextProps {
  children: string;
  className?: string;
  as?: "p" | "span" | "div" | "li";
}

export default function PatientFriendlyText({ children, className, as = "p" }: PatientFriendlyTextProps) {
  const { audienceMode } = usePatientMode();
  const Tag = as;

  // 1. Patient Mode text rendering (simplifies medical jargon)
  if (audienceMode === "patient") {
    const textToRender = simplifyMedicalJargon(children);
    return <Tag className={className}>{textToRender}</Tag>;
  }

  // 2. Student Mode text rendering (adds academic highlights)
  if (audienceMode === "student") {
    return (
      <div className="space-y-2">
        <Tag className={className}>{children}</Tag>
        <div className="p-3 border border-indigo-500/20 bg-indigo-500/5 rounded-xl flex items-start gap-2 text-[11px] text-indigo-750 dark:text-indigo-300">
          <GraduationCap className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase tracking-wider text-[9px] block mb-0.5">Student Academic Focus</span>
            <span>Verify this definition with Hahnemannian principles and Allen's Keynotes.</span>
          </div>
        </div>
      </div>
    );
  }

  // 3. Practitioner Mode text rendering (adds secured Clinical OS links)
  return (
    <div className="space-y-2">
      <Tag className={className}>{children}</Tag>
      <div className="p-3 border border-emerald-500/20 bg-emerald-500/5 rounded-xl flex items-center justify-between text-[11px] text-emerald-850 dark:text-emerald-350">
        <span className="flex items-center gap-1.5 font-medium">
          <ShieldAlert className="h-3.5 w-3.5 text-emerald-500" />
          Advanced clinical data restricted. Mapped in secure workspace.
        </span>
        <a
          href="/admin/login"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5 shrink-0"
        >
          Open Clinical OS <ArrowRight className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
