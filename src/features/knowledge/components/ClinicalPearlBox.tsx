"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { KnowledgeEntity } from "../types";
import { getClinicalCategory, CATEGORY_COLORS } from "../graph/learningPathService";

interface ClinicalPearlBoxProps {
  entity: KnowledgeEntity;
}

export default function ClinicalPearlBox({ entity }: ClinicalPearlBoxProps) {
  const category = getClinicalCategory(entity);
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.general;

  // Resolve Clinical Pearl content
  let pearl = entity.clinicalPearl || "";

  // If no pearl exists in the static record, resolve a high-yield clinical fact as default
  if (!pearl) {
    if (entity.slug === "anti-tpo-antibodies") {
      pearl = "Positive Anti-TPO with normal TSH may precede clinical thyroid dysfunction by years. Close observation is highly indicated.";
    } else if (entity.slug === "tsh") {
      pearl = "TSH fluctuates diurnally, peaking overnight. A borderline elevation should always be confirmed with a early morning repeat specimen.";
    } else if (entity.slug === "hypothyroidism") {
      pearl = "Hypothyroidism can cause secondary hyperprolactinemia due to TRH cross-stimulation. Always screen thyroid status in cases of unexplained galactorrhea or oligomenorrhea.";
    } else if (entity.slug === "gastroesophageal-reflux-disease") {
      pearl = "Atypical GERD presentation can masquerade as chronic dry cough or adult-onset asthma due to micro-aspiration of gastric secretions.";
    } else if (entity.slug === "cbc") {
      pearl = "Isolated microcytosis without anemia is frequently the first indicator of thalassemia minor. Ferritin levels are crucial to rule out early iron deficiency.";
    } else if (entity.slug === "nux-vomica") {
      pearl = "Classical Materia Medica characterizes Nux Vomica as highly suited to patients showing hypersensitivity to all stimuli—noise, light, and smells.";
    } else if (entity.slug === "lycopodium") {
      pearl = "Lycopodium symptoms typically demonstrate a marked 4 PM to 8 PM aggravation and a right-to-left progression of somatic complaints.";
    }
  }

  // If still empty (general entities), do not render the block to avoid clutter
  if (!pearl) {
    return null;
  }

  return (
    <div className={`p-4 border-l-4 rounded-r-2xl border-teal-500 bg-teal-500/5 dark:bg-teal-500/10 space-y-2 relative overflow-hidden`}>
      <div className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400">
        <Sparkles className="h-4 w-4 shrink-0 animate-pulse" />
        <span className="text-[10px] uppercase font-extrabold tracking-widest">
          High-Yield Clinical Pearl
        </span>
      </div>
      <p className="text-xs italic text-neutral-800 dark:text-neutral-200 leading-relaxed">
        "{pearl}"
      </p>
    </div>
  );
}
