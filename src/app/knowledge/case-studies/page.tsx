import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Stethoscope, ArrowUpRight } from "lucide-react";
import { CASE_STUDIES } from "@/features/knowledge/content/case-studies";
import KnowledgePageLayout from "@/features/knowledge/components/KnowledgePageLayout";
import ReviewedBy from "@/features/knowledge/components/ReviewedBy";
import MedicalDisclaimer from "@/features/knowledge/components/MedicalDisclaimer";

export const metadata: Metadata = {
  title: "Clinical Case Studies | Homeo Healthcare",
  description: "Read de-identified clinical case reports demonstrating homeopathic recovery timelines and constitutional symptom resolution. Clinically reviewed.",
  alternates: {
    canonical: "https://homeo.healthcare/knowledge/case-studies",
  },
};

export default function CaseStudiesListPage() {
  const reviewer = {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Clinical Case Audit",
    institution: "Homeo Healthcare Clinic",
  };

  const publishedCases = CASE_STUDIES.filter(c => c.editorialStatus === "published");

  return (
    <KnowledgePageLayout
      title="Clinical Case Reports"
      subtitle="Documented constitutional case studies showcasing patient intake, repertorial mapping, and follow-up responses."
      backLink="/knowledge"
      backText="Back to Knowledge Hub"
    >
      <ReviewedBy reviewer={reviewer} reviewedDate="2026-06-30T12:00:00Z" />

      <div className="mt-8 space-y-6">
        {publishedCases.map(report => {
          const title = typeof report.title === "string" ? report.title : (report.title?.en || "");
          const summary = typeof report.summary === "string" ? report.summary : (report.summary?.en || "");
          const intake = report.content?.caseIntake?.en || "";
          const followUp = report.content?.prescriptionAndFollowUp?.en || "";

          return (
            <div
              key={report.id}
              className="p-6 border border-neutral-500/10 rounded-2xl bg-white/5 backdrop-blur-md hover:border-teal-500/20 transition-all duration-300 space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold uppercase py-0.5 px-2.5 rounded-full border border-emerald-500/25">
                    Case Record
                  </span>
                  <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                    {title}
                  </h3>
                </div>
                <Stethoscope className="h-6 w-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              </div>

              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                {summary}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                <div className="p-3.5 bg-neutral-500/5 rounded-xl border border-neutral-500/5">
                  <span className="font-semibold block text-neutral-500 uppercase text-[9px] mb-1">Patient Intake Summary</span>
                  <span className="text-neutral-700 dark:text-neutral-300 line-clamp-3">{intake}</span>
                </div>
                <div className="p-3.5 bg-emerald-500/5 rounded-xl border border-emerald-500/5">
                  <span className="font-semibold block text-emerald-600 dark:text-emerald-400 uppercase text-[9px] mb-1">Prescription & Response</span>
                  <span className="text-neutral-700 dark:text-neutral-300 line-clamp-3">{followUp}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-500/5 flex items-center justify-between text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                <span>Audited on: {new Date(report.versionInfo.reviewed).toLocaleDateString()}</span>
                <Link
                  href={`/knowledge/case-studies/${report.slug}`}
                  className="inline-flex items-center gap-1 text-teal-600 dark:text-teal-400 hover:underline"
                >
                  View Case Timeline <ArrowUpRight className="h-4.5 w-4.5" />
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
