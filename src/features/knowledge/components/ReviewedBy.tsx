import React from "react";
import { CheckCircle2, Calendar } from "lucide-react";
import { Reviewer } from "../types";
import { formatMedicalDateLong } from "../utils/dateFormatter";

interface ReviewedByProps {
  reviewer?: Reviewer | string;
  reviewedDate: string;
}

export default function ReviewedBy({ reviewer, reviewedDate }: ReviewedByProps) {
  const formattedDate = formatMedicalDateLong(reviewedDate);
  const reviewerName = typeof reviewer === "string" ? reviewer : (reviewer?.name || "Dr. Narayan Jethwani");
  const reviewerCredentials = typeof reviewer === "object" && reviewer?.credentials ? reviewer.credentials : "MD (Hom)";
  const reviewerSpecialty = typeof reviewer === "object" && reviewer?.specialty ? reviewer.specialty : "Clinical Reviewer";

  return (
    <div className="flex flex-wrap items-center gap-4 py-4 px-6 rounded-xl border border-teal-500/10 bg-teal-500/5 text-teal-800 dark:text-teal-400">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
        <span className="text-xs uppercase tracking-wider font-semibold">Clinically Verified</span>
      </div>
      <div className="h-4 w-px bg-teal-500/20 hidden sm:block"></div>
      <div className="text-sm">
        Reviewed by <strong className="font-semibold">{reviewerName}, {reviewerCredentials}</strong>
        <span className="text-xs opacity-80 block sm:inline sm:ml-2">({reviewerSpecialty})</span>
      </div>
      <div className="h-4 w-px bg-teal-500/20 hidden sm:block"></div>
      <div className="flex items-center gap-1.5 text-xs opacity-80">
        <Calendar className="h-3.5 w-3.5" />
        <span>Reviewed on {formattedDate}</span>
      </div>
    </div>
  );
}
