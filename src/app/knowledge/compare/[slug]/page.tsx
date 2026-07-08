import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { COMPARISONS, getComparisonBySlug } from "@/features/knowledge/comparisons/comparisonRegistry";
import { getAllKnowledgeEntities } from "@/features/knowledge";
import KnowledgePageLayout from "@/features/knowledge/components/KnowledgePageLayout";
import Breadcrumbs from "@/features/knowledge/components/Breadcrumbs";
import MedicalDisclaimer from "@/features/knowledge/components/MedicalDisclaimer";
import { GitCompare, ArrowRight, ShieldCheck, Stethoscope } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return COMPARISONS.map(c => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const comp = getComparisonBySlug(slug);
  if (!comp) return {};

  return {
    title: `${comp.title} | Clinical Comparison | Homeo Healthcare`,
    description: `Comparative differential diagnosis analysis between ${comp.title.replace(" vs ", " and ")}. Clinically validated details.`,
    alternates: {
      canonical: `https://homeo.healthcare/knowledge/compare/${comp.slug}`,
    }
  };
}

export default async function ComparisonDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const comp = getComparisonBySlug(slug);

  if (!comp) {
    notFound();
  }

  const all = getAllKnowledgeEntities();
  const entity1 = all.find(e => e.id === comp.entity1Id);
  const entity2 = all.find(e => e.id === comp.entity2Id);

  const title1 = entity1 ? (typeof entity1.title === "string" ? entity1.title : entity1.title.en) : (comp.entity1Name || "Target A");
  const title2 = entity2 ? (typeof entity2.title === "string" ? entity2.title : entity2.title.en) : (comp.entity2Name || "Target B");

  const crumbs = [
    { name: "Knowledge Hub", item: "https://homeo.healthcare/knowledge" },
    { name: comp.title, item: `https://homeo.healthcare/knowledge/compare/${comp.slug}` },
  ];

  return (
    <KnowledgePageLayout
      title={comp.title}
      subtitle="Differential analysis and structured clinical comparative matrix."
      backLink="/knowledge"
      backText="Back to Knowledge Hub"
      headerBadges={
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-650 dark:text-indigo-400 font-mono">
          <GitCompare className="h-4 w-4" /> CLINICAL COMPARISON MATRIX
        </span>
      }
    >
      <Breadcrumbs crumbs={crumbs} />

      <div className="mt-8 space-y-10 text-neutral-850 dark:text-neutral-200 leading-relaxed">
        
        {/* Intro */}
        <section className="space-y-4">
          <p className="text-base text-neutral-700 dark:text-neutral-300">
            Below is a structured comparative analysis detailing key differences in indications, modalitics, clinical diagnostic scopes, or remedy affinities.
          </p>
        </section>

        {/* Structured Grid Table */}
        <div className="border border-neutral-200 dark:border-neutral-850 rounded-3xl overflow-hidden shadow-lg bg-white/5 backdrop-blur-md">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-neutral-100 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-850">
                <th className="p-4 font-extrabold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-[10px] w-1/4">Clinical Parameter</th>
                <th className="p-4 font-bold text-neutral-900 dark:text-neutral-50 text-xs">{title1}</th>
                <th className="p-4 font-bold text-neutral-900 dark:text-neutral-50 text-xs">{title2}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-850">
              {comp.differences.map((diff, idx) => (
                <tr key={idx} className="hover:bg-neutral-100/30 dark:hover:bg-neutral-900/30 transition-colors">
                  <td className="p-4 font-bold text-neutral-800 dark:text-neutral-300 text-xs">{diff.parameter}</td>
                  <td className="p-4 text-xs text-neutral-700 dark:text-neutral-400">{diff.val1}</td>
                  <td className="p-4 text-xs text-neutral-700 dark:text-neutral-400">{diff.val2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Link cards back to details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {entity1 && (
            <div className="p-5 border border-neutral-200 dark:border-neutral-850 rounded-2xl bg-white/5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400 tracking-wider">Entity Profile A</span>
                <h4 className="text-sm font-bold text-neutral-850 dark:text-neutral-200 mt-1">{title1}</h4>
              </div>
              <Link
                href={`/knowledge/${entity1.entityType === "remedy" ? "remedies" : entity1.entityType === "disease" ? "diseases" : entity1.entityType === "symptom" ? "symptoms" : "lab-tests"}/${entity1.slug}`}
                className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-bold mt-4 flex items-center gap-1"
              >
                View Full Clinical Profile <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}

          {entity2 && (
            <div className="p-5 border border-neutral-200 dark:border-neutral-850 rounded-2xl bg-white/5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400 tracking-wider">Entity Profile B</span>
                <h4 className="text-sm font-bold text-neutral-850 dark:text-neutral-200 mt-1">{title2}</h4>
              </div>
              <Link
                href={`/knowledge/${entity2.entityType === "remedy" ? "remedies" : entity2.entityType === "disease" ? "diseases" : entity2.entityType === "symptom" ? "symptoms" : "lab-tests"}/${entity2.slug}`}
                className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-bold mt-4 flex items-center gap-1"
              >
                View Full Clinical Profile <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Compliance disclaimer */}
        <MedicalDisclaimer />

      </div>
    </KnowledgePageLayout>
  );
}
