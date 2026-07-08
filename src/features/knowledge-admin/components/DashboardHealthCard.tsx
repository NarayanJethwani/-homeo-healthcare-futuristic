import React from "react";
import { KmsKnowledgeEntity } from "../types";
import { runEditorialAudit } from "../../knowledge/governance/editorialAuditor";
import { runSEOAudit } from "../../knowledge/governance/seoAuditor";
import { runAIReadinessAudit } from "../../knowledge/governance/aiReadinessAuditor";
import { getKnowledgeAnalyticsSummary } from "../../knowledge/analytics/knowledgeAnalytics";
import { KNOWLEDGE_RELATIONSHIPS } from "../../knowledge/graph/entityRelationships";
import { Activity, ShieldAlert, BookOpen, AlertTriangle, FileCheck, CheckCircle, BarChart3, Search, EyeOff, LayoutGrid, HeartHandshake, Cpu } from "lucide-react";

interface DashboardHealthCardProps {
  entities: KmsKnowledgeEntity[];
}

export default function DashboardHealthCard({ entities }: DashboardHealthCardProps) {
  // 1. Run live program audits
  const editorialReport = runEditorialAudit();
  const seoReport = runSEOAudit();
  const analytics = getKnowledgeAnalyticsSummary();

  const total = entities.length;
  const published = entities.filter(e => e.editorialStatus === "published").length;
  const drafts = entities.filter(e => e.editorialStatus === "draft").length;
  const underReview = entities.filter(e => e.editorialStatus === "medical-review" || e.editorialStatus === "legal-review").length;

  // Overdue and upcoming review dates calculations
  const now = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(now.getDate() + 7);

  let expiredReviewsCount = 0;
  let reviewsDueThisWeekCount = 0;

  entities.forEach(e => {
    if (e.nextReviewDate) {
      const reviewDate = new Date(e.nextReviewDate);
      if (reviewDate < now) {
        expiredReviewsCount++;
      } else if (reviewDate <= nextWeek) {
        reviewsDueThisWeekCount++;
      }
    }
  });

  // Calculate advanced scores
  // A. Content Completeness Score
  let completenessSum = 0;
  entities.forEach(e => {
    let fields = 0;
    if (e.summary && e.summary.en) fields++;
    if (e.content && (e.content as any).keynotes && (e.content as any).keynotes.length > 0) fields++;
    if (e.content && (e.content as any).description && (e.content as any).description.en) fields++;
    if (e.content && (e.content as any).references && (e.content as any).references.length > 0) fields++;
    completenessSum += (fields / 4) * 100;
  });
  const contentCompletenessScore = total > 0 ? Math.round(completenessSum / total) : 100;

  // B. SEO Score
  let seoSum = 0;
  entities.forEach(e => {
    let fields = 0;
    if (e.summary && e.summary.en.length > 30) fields++; // has solid summary
    if (e.slug) fields++;
    if (e.reviewer && e.reviewer.name) fields++;
    seoSum += (fields / 3) * 100;
  });
  const seoScore = total > 0 ? Math.round(seoSum / total) : 100;

  // C. Citation Score
  const citedCount = entities.filter(e => e.content && (e.content as any).references && (e.content as any).references.length > 0).length;
  const citationScore = total > 0 ? Math.round((citedCount / total) * 100) : 100;

  // D. Internal Linking Score
  // Calculate how many nodes have at least one incoming or outgoing relationship in KNOWLEDGE_RELATIONSHIPS
  const linkedEntityIds = new Set<string>();
  KNOWLEDGE_RELATIONSHIPS.forEach(rel => {
    linkedEntityIds.add(rel.source);
    linkedEntityIds.add(rel.target);
  });
  const linkedCount = entities.filter(e => linkedEntityIds.has(e.id)).length;
  const internalLinkingScore = total > 0 ? Math.round((linkedCount / total) * 100) : 100;

  // E. Entity Health Score
  const totalAuditIssues = editorialReport.totalIssuesCount + seoReport.totalIssuesCount;
  const totalExpectedChecks = (entities.length * 4) + (entities.length * 3);
  const entityHealthScore = totalExpectedChecks > 0 
    ? Math.max(0, Math.round(((totalExpectedChecks - totalAuditIssues) / totalExpectedChecks) * 100))
    : 100;

  // F. AI Readiness Score
  const aiReadinessReport = runAIReadinessAudit();
  const aiReadinessScore = aiReadinessReport.score;

  // G. Overall Platform Health Score
  const overallPlatformHealthScore = Math.round(
    (contentCompletenessScore + seoScore + citationScore + internalLinkingScore + entityHealthScore + aiReadinessScore) / 6
  );

  return (
    <div className="space-y-6">
      {/* 7 Grid Health Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
        
        {/* Overall Platform Health */}
        <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950 text-center space-y-1">
          <span className="text-[9px] uppercase tracking-wider font-bold text-neutral-450 block">Platform Health</span>
          <span className="text-2xl font-extrabold text-teal-400 font-mono block">{overallPlatformHealthScore}%</span>
          <span className="text-[8px] text-neutral-500 block">Overall Average</span>
        </div>

        {/* AI Readiness Score */}
        <div className="p-4 rounded-xl border border-neutral-850 bg-neutral-900/60 text-center space-y-1">
          <span className="text-[9px] uppercase tracking-wider font-bold text-neutral-400 block">AI Readiness</span>
          <span className="text-2xl font-extrabold text-cyan-400 font-mono block">{aiReadinessScore}%</span>
          <span className="text-[8px] text-neutral-500 block">Graph Schema validity</span>
        </div>

        {/* Content Completeness */}
        <div className="p-4 rounded-xl border border-neutral-850 bg-neutral-900/60 text-center space-y-1">
          <span className="text-[9px] uppercase tracking-wider font-bold text-neutral-400 block">Completeness</span>
          <span className="text-2xl font-extrabold text-indigo-400 font-mono block">{contentCompletenessScore}%</span>
          <span className="text-[8px] text-neutral-500 block">Rich Content coverage</span>
        </div>

        {/* SEO Score */}
        <div className="p-4 rounded-xl border border-neutral-850 bg-neutral-900/60 text-center space-y-1">
          <span className="text-[9px] uppercase tracking-wider font-bold text-neutral-450 block">SEO Authority</span>
          <span className="text-2xl font-extrabold text-amber-400 font-mono block">{seoScore}%</span>
          <span className="text-[8px] text-neutral-500 block">Metadata index</span>
        </div>

        {/* Citation Score */}
        <div className="p-4 rounded-xl border border-neutral-850 bg-neutral-900/60 text-center space-y-1">
          <span className="text-[9px] uppercase tracking-wider font-bold text-neutral-400 block">Citations</span>
          <span className="text-2xl font-extrabold text-blue-400 font-mono block">{citationScore}%</span>
          <span className="text-[8px] text-neutral-500 block">References linked</span>
        </div>

        {/* Internal Linking */}
        <div className="p-4 rounded-xl border border-neutral-850 bg-neutral-900/60 text-center space-y-1">
          <span className="text-[9px] uppercase tracking-wider font-bold text-neutral-400 block">Internal Links</span>
          <span className="text-2xl font-extrabold text-cyan-400 font-mono block">{internalLinkingScore}%</span>
          <span className="text-[8px] text-neutral-500 block">Graph adjacency</span>
        </div>

        {/* Entity Health */}
        <div className="p-4 rounded-xl border border-neutral-850 bg-neutral-900/60 text-center space-y-1">
          <span className="text-[9px] uppercase tracking-wider font-bold text-neutral-400 block">Entity Health</span>
          <span className="text-2xl font-extrabold text-rose-455 font-mono block">{entityHealthScore}%</span>
          <span className="text-[8px] text-neutral-500 block">Zero Issue audit</span>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 1. Health gauge visual widget */}
        <div className="md:col-span-1 p-5 rounded-2xl border border-neutral-850 bg-neutral-900/60 backdrop-blur-xl flex flex-col justify-between items-center text-center">
          <div className="w-full flex justify-between items-center pb-2 border-b border-neutral-850">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Clinical Quality Health
            </h4>
            <Activity className="h-4 w-4 text-cyan-400 animate-pulse" />
          </div>

          <div className="py-6 flex flex-col items-center">
            <div className="relative h-28 w-28 rounded-full border-4 border-neutral-800 flex items-center justify-center">
              {/* Health glow border indicator */}
              <span className={`absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-500 animate-spin`} style={{ animationDuration: "3s" }} />
              <div className="text-center">
                <span className="text-3xl font-extrabold text-neutral-100 font-mono">
                  {overallPlatformHealthScore}%
                </span>
                <span className="text-[9px] text-neutral-500 block uppercase font-semibold">
                  Publish Health Pass
                </span>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-neutral-500 leading-normal">
            Verifies medical reference lists, meta descriptions, disclaimers, and heading formats.
          </p>
        </div>

        {/* 2. Platform aggregates stats */}
        <div className="p-5 rounded-2xl border border-neutral-850 bg-neutral-900/60 backdrop-blur-xl space-y-4">
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
              <span className="text-[10px] text-neutral-455 block uppercase">Drafts</span>
              <span className="text-lg font-bold font-mono text-neutral-350">{drafts}</span>
            </div>
          </div>
        </div>

        {/* 3. Live Program Audit Metrics */}
        <div className="p-5 rounded-2xl border border-neutral-850 bg-neutral-900/60 backdrop-blur-xl space-y-3 text-xs text-neutral-300">
          <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider pb-2 border-b border-neutral-850">
            Clinical Quality Registry
          </h4>
          
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1 text-rose-400">
                <ShieldAlert className="h-4 w-4" /> Broken Link Paths
              </span>
              <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                editorialReport.brokenRelationships.length > 0 ? "bg-rose-500/20 text-rose-455" : "bg-neutral-950 text-neutral-500"
              }`}>
                {editorialReport.brokenRelationships.length}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1 text-amber-400">
                <AlertTriangle className="h-4 w-4" /> Review Overdue
              </span>
              <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                expiredReviewsCount > 0 ? "bg-amber-500/20 text-amber-450" : "bg-neutral-950 text-neutral-500"
              }`}>
                {expiredReviewsCount}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1 text-cyan-400">
                <BookOpen className="h-4 w-4" /> Reviews Due (7 Days)
              </span>
              <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                reviewsDueThisWeekCount > 0 ? "bg-cyan-500/20 text-cyan-400" : "bg-neutral-950 text-neutral-500"
              }`}>
                {reviewsDueThisWeekCount}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1 text-neutral-400">
                <CheckCircle className="h-4 w-4 text-neutral-500" /> Missing Metadata
              </span>
              <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                seoReport.missingDescriptionsCount > 0 ? "bg-amber-500/10 text-amber-400" : "bg-neutral-950 text-neutral-500"
              }`}>
                {seoReport.missingDescriptionsCount}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Search and Telemetry Analytics Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: View Telemetry */}
        <div className="p-5 rounded-2xl border border-neutral-850 bg-neutral-900/60 backdrop-blur-xl space-y-4">
          <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-neutral-850">
            <BarChart3 className="h-4 w-4 text-teal-400" /> Reading Telemetry & Views
          </h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-neutral-950/80 border border-neutral-900 rounded-xl">
              <span className="text-[10px] text-neutral-500 block uppercase mb-1">Total Page Views</span>
              <span className="text-xl font-bold font-mono text-teal-400">{analytics.totalViews || 0}</span>
            </div>
            <div className="p-3 bg-neutral-950/80 border border-neutral-900 rounded-xl">
              <span className="text-[10px] text-neutral-500 block uppercase mb-1">Total Queries Run</span>
              <span className="text-xl font-bold font-mono text-cyan-400">{analytics.totalSearches || 0}</span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider block">Most Visited Pages</span>
            {analytics.mostViewedEntities && analytics.mostViewedEntities.length > 0 ? (
              <div className="space-y-1.5">
                {analytics.mostViewedEntities.map(([id, count]) => {
                  const target = entities.find(e => e.id === id);
                  return (
                    <div key={id} className="flex justify-between items-center text-xs p-2 bg-neutral-950/40 rounded-lg border border-neutral-900">
                      <span className="font-semibold text-neutral-250">{target ? target.title.en : id}</span>
                      <span className="font-mono bg-teal-500/10 text-teal-400 border border-teal-500/25 px-2 py-0.5 rounded font-bold">{count} views</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-neutral-500 italic">No live page views logged yet.</p>
            )}
          </div>
        </div>

        {/* Right: Search Analytics */}
        <div className="p-5 rounded-2xl border border-neutral-850 bg-neutral-900/60 backdrop-blur-xl space-y-4">
          <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-neutral-850">
            <Search className="h-4 w-4 text-cyan-400" /> Search Failures & Analytics
          </h4>
          <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl flex justify-between items-center text-xs">
            <span className="flex items-center gap-1 text-rose-400">
              <EyeOff className="h-4 w-4" /> Zero-Result (Failed) Queries
            </span>
            <span className="font-bold font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded">
              {analytics.searchFailuresCount || 0}
            </span>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider block">Failed Search Log (Needs Content Alignment)</span>
            {analytics.recentFailedSearches && analytics.recentFailedSearches.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {analytics.recentFailedSearches.map((q, idx) => (
                  <span key={idx} className="text-[10px] font-semibold bg-neutral-950 text-rose-400 border border-rose-900/30 px-2.5 py-1 rounded-lg">
                    "{q}"
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-500 italic">Zero search failures logged.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
