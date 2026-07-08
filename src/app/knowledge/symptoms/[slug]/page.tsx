import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { SYMPTOMS } from "@/features/knowledge/content/symptoms";
import { generateMedicalMetadata } from "@/features/knowledge/metadata/medicalMetadata";
import { generateMedicalWebPageSchema } from "@/features/knowledge/schemas/jsonLdSchemas";
import KnowledgePageLayout from "@/features/knowledge/components/KnowledgePageLayout";
import ReviewedBy from "@/features/knowledge/components/ReviewedBy";
import LastReviewedBadge from "@/features/knowledge/components/LastReviewedBadge";
import EvidenceBadge from "@/features/knowledge/components/EvidenceBadge";
import MedicalDisclaimer from "@/features/knowledge/components/MedicalDisclaimer";
import ReferencesList from "@/features/knowledge/components/ReferencesList";
import AICitationBlock from "@/features/knowledge/components/AICitationBlock";
import RelatedEverything from "@/features/knowledge/components/RelatedEverything";
import Breadcrumbs from "@/features/knowledge/components/Breadcrumbs";
import AnalyticsTrigger from "@/features/knowledge/components/AnalyticsTrigger";
import PatientFriendlyText from "@/features/knowledge/components/PatientFriendlyText";
import TimelineHistory from "@/features/knowledge/components/TimelineHistory";
import LearningPathStepper from "@/features/knowledge/components/LearningPathStepper";
import KnowledgeGraphExplorer from "@/features/knowledge/components/KnowledgeGraphExplorer";
import ContextualCtaBanner from "@/features/knowledge/components/ContextualCtaBanner";
import { Info, HelpCircle, AlertTriangle, BookOpen } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return SYMPTOMS.map(symptom => ({
    slug: symptom.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const symptom = SYMPTOMS.find(s => s.slug === slug);
  if (!symptom) return {};
  return generateMedicalMetadata(symptom);
}

export default async function SymptomDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const symptom = SYMPTOMS.find(s => s.slug === slug);

  if (!symptom || symptom.editorialStatus !== "published") {
    notFound();
  }

  const schemaJson = generateMedicalWebPageSchema(symptom);
  const title = typeof symptom.title === "string" ? symptom.title : (symptom.title?.en || "");
  const summary = typeof symptom.summary === "string" ? symptom.summary : (symptom.summary?.en || "");
  const content = symptom.content;

  const crumbs = [
    { name: "Symptoms", item: "https://homeo.healthcare/knowledge/symptoms" },
    { name: title, item: symptom.canonicalUrl },
  ];

  const tocItems = [
    { id: "definition", label: "Definition & Meaning" },
    { id: "causes", label: "Common Causes" },
    { id: "differentials", label: "Differential Diagnosis" },
    { id: "redflags", label: "Clinical Red Flags" },
    { id: "lifestyle", label: "Lifestyle & Diet" }
  ];

  return (
    <>
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      <AnalyticsTrigger entityId={symptom.id} slug={symptom.slug} entityType={symptom.entityType} />

      <KnowledgePageLayout
        title={title}
        subtitle={summary}
        backLink="/knowledge/symptoms"
        backText="Back to Symptoms"
        headerBadges={
          <>
            <EvidenceBadge level={symptom.evidenceLevel} />
            <LastReviewedBadge reviewedDate={symptom.versionInfo.reviewed} />
          </>
        }
        tocItems={tocItems}
        entityId={symptom.id}
        entityType={symptom.entityType}
      >
        <Breadcrumbs crumbs={crumbs} />

        <ReviewedBy reviewer={symptom.reviewer} reviewedDate={symptom.versionInfo.reviewed} />

        <div className="mt-4 space-y-4">
          <TimelineHistory versionInfo={symptom.versionInfo} reviewer={symptom.reviewer} />
          <LearningPathStepper currentId={symptom.id} />
        </div>

        <div className="mt-8 space-y-8 text-neutral-850 dark:text-neutral-200 leading-relaxed">
          
          {/* Section: Definition & Meaning */}
          <section id="definition" className="space-y-3 scroll-mt-24">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 border-b border-neutral-500/5 pb-2">
              <Info className="h-4.5 w-4.5 text-amber-500" /> Definition
            </h3>
            <PatientFriendlyText className="text-base text-neutral-700 dark:text-neutral-300" as="p">
              {content.definition}
            </PatientFriendlyText>
            <div className="p-4 border-l-4 border-amber-500/50 bg-amber-500/5 rounded-r-xl">
              <span className="text-[10px] uppercase font-bold text-amber-500 block mb-1">Clinical Meaning</span>
              <PatientFriendlyText className="text-sm italic text-neutral-800 dark:text-neutral-200" as="p">
                {content.clinicalMeaning}
              </PatientFriendlyText>
            </div>
          </section>

          {/* Section: Common Causes */}
          {content.commonCauses && content.commonCauses.length > 0 && (
            <section id="causes" className="space-y-3 scroll-mt-24">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 border-b border-neutral-500/5 pb-2">
                <HelpCircle className="h-4.5 w-4.5 text-amber-500" /> Common Causes
              </h3>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-neutral-700 dark:text-neutral-300">
                {content.commonCauses.map((cause: string, idx: number) => (
                  <li key={idx} className="pl-1"><span className="text-neutral-805 dark:text-neutral-250">{cause}</span></li>
                ))}
              </ul>
            </section>
          )}

          {/* Section: Differential Diagnosis */}
          {content.differentialDiagnosis && (
            <section id="differentials" className="space-y-3 scroll-mt-24">
              <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Differential Diagnosis</h4>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">{content.differentialDiagnosis}</p>
            </section>
          )}

          {/* Section: Red Flags */}
          {content.redFlags && content.redFlags.length > 0 && (
            <section id="redflags" className="p-5 border border-rose-500/20 bg-rose-500/5 rounded-2xl flex gap-3 scroll-mt-24">
              <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-rose-800 dark:text-rose-450 text-sm">
                  Clinical Red Flags (When to Seek Urgent Care)
                </h4>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-rose-950/80 dark:text-rose-250/90 mt-2">
                  {content.redFlags.map((flag: string, idx: number) => (
                    <li key={idx}>{flag}</li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Section: Lifestyle and diet guidance */}
          {content.lifestyleAdvice && (
            <section id="lifestyle" className="space-y-3 border-t border-neutral-500/5 pt-6 scroll-mt-24">
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <BookOpen className="h-4.5 w-4.5 text-teal-600 dark:text-teal-400" /> Lifestyle & Diet Support
              </h3>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">{content.lifestyleAdvice}</p>
            </section>
          )}
        </div>

        {/* Dynamic Knowledge Graph Explorer */}
        <div className="mt-8">
          <KnowledgeGraphExplorer currentId={symptom.id} />
        </div>

        {/* References */}
        {content.references && (
          <div id="references" className="scroll-mt-24">
            <ReferencesList references={content.references} />
          </div>
        )}

        {/* AI Citation */}
        <AICitationBlock entity={symptom} />

        {/* Related everything navigator */}
        <RelatedEverything entityId={symptom.id} />

        <ContextualCtaBanner />

        {/* Global Medical Disclaimer */}
        <MedicalDisclaimer />
      </KnowledgePageLayout>
    </>
  );
}
