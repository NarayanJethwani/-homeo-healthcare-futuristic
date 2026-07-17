import React from "react";
import { Clock } from "lucide-react";
import { formatMedicalDate } from "../utils/dateFormatter";

interface LastReviewedBadgeProps {
  reviewedDate: string;
}

export default function LastReviewedBadge({ reviewedDate }: LastReviewedBadgeProps) {
  const formattedDate = formatMedicalDate(reviewedDate);

  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium bg-neutral-500/10 border border-neutral-500/20 py-0.5 px-2.5 rounded-full">
      <Clock className="h-3 w-3" />
      <span>Reviewed: {formattedDate}</span>
    </span>
  );
}
