import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ArrowUpRight } from "lucide-react";
import { RESEARCH } from "@/features/knowledge/content/research";
import KnowledgePageLayout from "@/features/knowledge/components/KnowledgePageLayout";
import ReviewedBy from "@/features/knowledge/components/ReviewedBy";
import MedicalDisclaimer from "@/features/knowledge/components/MedicalDisclaimer";

export const metadata: Metadata = {
  title: "Clinical Research Library | Homeo Healthcare",
  description: "Browse summaries of clinical research papers, randomized controlled trials, and observational studies assessing homeopathy in clinical practice.",
  alternates: {
    canonical: "https://homeo.healthcare/knowledge/research",
  },
};

export default function ResearchListPage() {
  const reviewer = {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Clinical Research & Data Analytics",
    institution: "Homeo Healthcare Clinic",
  };

  const publishedResearch = RESEARCH.filter(r => r.editorialStatus === "published");

  return (
    <KnowledgePageLayout
      title="Clinical Research Library"
      subtitle="Summaries of medical research papers, trials, and epidemiological studies validating homeopathic therapeutics."
      backLink="/knowledge"
      backText="Back to Knowledge Hub"
    >
      <ReviewedBy reviewer={reviewer} reviewedDate="2026-06-30T12:00:00Z" />

      <div className="mt-8 space-y-6">
        {publishedResearch.map(paper => {
          const title = typeof paper.title === "string" ? paper.title : (paper.title?.en || "");
          const summary = typeof paper.summary === "string" ? paper.summary : (paper.summary?.en || "");
          const studyDesign = paper.content?.studyDesign?.en || "";
          const keyFindings = paper.content?.keyFindings?.en || "";

          return (
            <div
              key={paper.id}
              className="p-6 border border-neutral-500/10 rounded-2xl bg-white/5 backdrop-blur-md hover:border-teal-500/20 transition-all duration-300 space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold uppercase py-0.5 px-2.5 rounded-full border border-teal-500/25">
                    {paper.evidenceLevel}
                  </span>
                  <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                    {title}
                  </h3>
                </div>
                <BookOpen className="h-6 w-6 text-teal-600 dark:text-teal-400 flex-shrink-0" />
              </div>

              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                {summary}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                <div className="p-3.5 bg-neutral-500/5 rounded-xl border border-neutral-500/5">
                  <span className="font-semibold block text-neutral-500 uppercase text-[9px] mb-1">Study Design</span>
                  <span className="text-neutral-700 dark:text-neutral-300">{studyDesign}</span>
                </div>
                <div className="p-3.5 bg-teal-500/5 rounded-xl border border-teal-500/5">
                  <span className="font-semibold block text-teal-600 dark:text-teal-400 uppercase text-[9px] mb-1">Key Findings</span>
                  <span className="text-neutral-700 dark:text-neutral-300">{keyFindings}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-500/5 flex items-center justify-between text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                <span>Published on: {new Date(paper.versionInfo.created).toLocaleDateString()}</span>
                <Link
                  href={`/knowledge/research/${paper.slug}`}
                  className="inline-flex items-center gap-1 text-teal-600 dark:text-teal-400 hover:underline"
                >
                  View Full Summary <ArrowUpRight className="h-4.5 w-4.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <MedicalDisclaimer />
    </KnowledgePageLayout>
  );
}
