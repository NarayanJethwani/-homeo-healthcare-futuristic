import React from "react";
import { Award } from "lucide-react";
import { EvidenceLevel } from "../types";

interface EvidenceBadgeProps {
  level: EvidenceLevel;
}

export default function EvidenceBadge({ level }: EvidenceBadgeProps) {
  const getColors = () => {
    switch (level) {
      case "Level-A":
        return "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400";
      case "Level-B":
        return "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400";
      case "Level-C":
        return "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400";
      default:
        return "bg-purple-500/10 border-purple-500/20 text-purple-700 dark:text-purple-400";
    }
  };

  const getLabel = () => {
    switch (level) {
      case "Level-A": return "Level A Evidence (RCT / Sys Review)";
      case "Level-B": return "Level B Evidence (Cohort / Case-Control)";
      case "Level-C": return "Level C Evidence (Observational)";
      case "Expert-Opinion": return "Expert Medical Opinion";
      case "Traditional-Literature": return "Traditional Homeopathic Literature";
      case "Clinical-Experience": return "Clinical Experience Reports";
      default: return level;
    }
  };

  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold py-0.5 px-2.5 rounded-full border ${getColors()}`} title={getLabel()}>
      <Award className="h-3 w-3" />
      <span>{getLabel()}</span>
    </span>
  );
}
