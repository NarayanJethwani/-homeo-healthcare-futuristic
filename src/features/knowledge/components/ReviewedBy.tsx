import React from "react";
import { CheckCircle2, Calendar } from "lucide-react";
import { Reviewer } from "../types";

interface ReviewedByProps {
  reviewer: Reviewer;
  reviewedDate: string;
}

export default function ReviewedBy({ reviewer, reviewedDate }: ReviewedByProps) {
  const formattedDate = new Date(reviewedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-wrap items-center gap-4 py-4 px-6 rounded-xl border border-teal-500/10 bg-teal-500/5 text-teal-800 dark:text-teal-400">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
        <span className="text-xs uppercase tracking-wider font-semibold">Clinically Verified</span>
      </div>
      <div className="h-4 w-px bg-teal-500/20 hidden sm:block"></div>
      <div className="text-sm">
        Reviewed by <strong className="font-semibold">{reviewer.name}, {reviewer.credentials}</strong>
        <span className="text-xs opacity-80 block sm:inline sm:ml-2">({reviewer.specialty})</span>
      </div>
      <div className="h-4 w-px bg-teal-500/20 hidden sm:block"></div>
      <div className="flex items-center gap-1.5 text-xs opacity-80">
        <Calendar className="h-3.5 w-3.5" />
        <span>Reviewed on {formattedDate}</span>
      </div>
    </div>
  );
}
