import React from "react";
import { KmsKnowledgeEntity } from "../types";
import { runQualityGateChecks } from "../validation/qualityGates";
import { Activity, ShieldAlert, BookOpen, AlertTriangle, FileCheck, CheckCircle } from "lucide-react";

interface DashboardHealthCardProps {
  entities: KmsKnowledgeEntity[];
}

export default function DashboardHealthCard({ entities }: DashboardHealthCardProps) {
  // Aggregate stats
  const total = entities.length;
  const published = entities.filter(e => e.editorialStatus === "published").length;
  const drafts = entities.filter(e => e.editorialStatus === "draft").length;
  const underReview = entities.filter(e => e.editorialStatus === "medical-review" || e.editorialStatus === "legal-review").length;

  // Audit health metrics
  let totalScore = 0;
  let brokenLinksCount = 0;
  let missingReferencesCount = 0;
  let missingReviewerCount = 0;
  let expiredReviewsCount = 0;
  let reviewsDueThisWeekCount = 0;

  const now = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(now.getDate() + 7);

  entities.forEach(e => {
    const check = runQualityGateChecks(e, entities);
    totalScore += check.score;

    const broken = check.issues.filter(i => i.rule === "BROKEN_RELATION").length;
    brokenLinksCount += broken;

    if (check.issues.some(i => i.rule === "REFERENCES")) {
      missingReferencesCount++;
    }
    if (check.issues.some(i => i.rule === "REVIEWER")) {
      missingReviewerCount++;
    }

    if (e.nextReviewDate) {
      const reviewDate = new Date(e.nextReviewDate);
      if (reviewDate < now) {
        expiredReviewsCount++;
      } else if (reviewDate <= nextWeek) {
        reviewsDueThisWeekCount++;
      }
    }
  });

  const avgHealthScore = total > 0 ? Math.round(totalScore / total) : 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* 1. Health gauge visual widget */}
      <div className="md:col-span-1 p-5 rounded-2xl border border-neutral-850 bg-neutral-905/60 backdrop-blur-xl flex flex-col justify-between items-center text-center">
        <div className="w-full flex justify-between items-center pb-2 border-b border-neutral-850">
          <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Knowledge Platform Health
          </h4>
          <Activity className="h-4 w-4 text-cyan-400 animate-pulse" />
        </div>

        <div className="py-6 flex flex-col items-center">
          <div className="relative h-28 w-28 rounded-full border-4 border-neutral-800 flex items-center justify-center">
            {/* Health glow border indicator */}
            <span className={`absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-500 animate-spin`} style={{ animationDuration: "3s" }} />
            <div className="text-center">
              <span className="text-3xl font-extrabold text-neutral-100 font-mono">
                {avgHealthScore}%
              </span>
              <span className="text-[9px] text-neutral-500 block uppercase font-semibold">
                Audit Pass Rate
              </span>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-neutral-500 leading-normal">
          Measures metadata accuracy, citation links, disclaimers, and prohibited claim blocks.
        </p>
      </div>

      {/* 2. Platform aggregates stats */}
      <div className="p-5 rounded-2xl border border-neutral-850 bg-neutral-905/60 backdrop-blur-xl space-y-4">
        <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider pb-2 border-b border-neutral-850">
          Editorial State Distribution
        </h4>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-900">
            <span className="text-[10px] text-neutral-500 block uppercase">Total Nodes</span>
            <span className="text-lg font-bold font-mono text-neutral-100">{total}</span>
          </div>
          <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
            <span className="text-[10px] text-emerald-500 block uppercase">Published</span>
            <span className="text-lg font-bold font-mono text-emerald-400">{published}</span>
          </div>
          <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/10">
            <span className="text-[10px] text-amber-500 block uppercase">In Review</span>
            <span className="text-lg font-bold font-mono text-amber-400">{underReview}</span>
          </div>
          <div className="p-3 bg-slate-500/5 rounded-xl border border-neutral-900">
            <span className="text-[10px] text-neutral-450 block uppercase">Drafts</span>
            <span className="text-lg font-bold font-mono text-neutral-350">{drafts}</span>
          </div>
        </div>
      </div>

      {/* 3. Issue trackers & review warnings */}
      <div className="p-5 rounded-2xl border border-neutral-850 bg-neutral-905/60 backdrop-blur-xl space-y-3 text-xs text-neutral-300">
        <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider pb-2 border-b border-neutral-850">
          Urgent Action Registry
        </h4>
        
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1 text-rose-400">
              <ShieldAlert className="h-4 w-4" /> Broken Relations
            </span>
            <span className={`font-mono font-bold px-2 py-0.5 rounded ${
              brokenLinksCount > 0 ? "bg-rose-500/20 text-rose-400" : "bg-neutral-950 text-neutral-500"
            }`}>
              {brokenLinksCount}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1 text-amber-400">
              <AlertTriangle className="h-4 w-4" /> Overdue Peer Reviews
            </span>
            <span className={`font-mono font-bold px-2 py-0.5 rounded ${
              expiredReviewsCount > 0 ? "bg-amber-500/20 text-amber-400" : "bg-neutral-950 text-neutral-500"
            }`}>
              {expiredReviewsCount}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1 text-cyan-400">
              <BookOpen className="h-4 w-4" /> Reviews Due This Week
            </span>
            <span className={`font-mono font-bold px-2 py-0.5 rounded ${
              reviewsDueThisWeekCount > 0 ? "bg-cyan-500/20 text-cyan-400" : "bg-neutral-950 text-neutral-500"
            }`}>
              {reviewsDueThisWeekCount}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1 text-neutral-400">
              <CheckCircle className="h-4 w-4 text-neutral-500" /> Missing Citations
            </span>
            <span className="font-mono font-bold text-neutral-550 bg-neutral-950 px-2 py-0.5 rounded">
              {missingReferencesCount}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
