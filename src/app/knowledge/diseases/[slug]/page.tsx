import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { DISEASES } from "@/features/knowledge/content/diseases";
import { generateMedicalMetadata } from "@/features/knowledge/metadata/medicalMetadata";
import { generateMedicalWebPageSchema } from "@/features/knowledge/schemas/jsonLdSchemas";
import KnowledgePageLayout from "@/features/knowledge/components/KnowledgePageLayout";
import EditorialConfidenceBadge from "@/features/knowledge/components/EditorialConfidenceBadge";
import LastReviewedBadge from "@/features/knowledge/components/LastReviewedBadge";
import EvidenceBadge from "@/features/knowledge/components/EvidenceBadge";
import MedicalDisclaimer from "@/features/knowledge/components/MedicalDisclaimer";
import ReferencesList from "@/features/knowledge/components/ReferencesList";
import AICitationBlock from "@/features/knowledge/components/AICitationBlock";
import RelatedEverything from "@/features/knowledge/components/RelatedEverything";
import Breadcrumbs from "@/features/knowledge/components/Breadcrumbs";
import CollapsibleSection from "@/features/knowledge/components/CollapsibleSection";
import AnalyticsTrigger from "@/features/knowledge/components/AnalyticsTrigger";
import TimelineHistory from "@/features/knowledge/components/TimelineHistory";
import PatientFriendlyText from "@/features/knowledge/components/PatientFriendlyText";
import LearningPathStepper from "@/features/knowledge/components/LearningPathStepper";
import KnowledgeGraphExplorer from "@/features/knowledge/components/KnowledgeGraphExplorer";
import ContextualCtaBanner from "@/features/knowledge/components/ContextualCtaBanner";
import QuickFactsCard from "@/features/knowledge/components/QuickFactsCard";
import ClinicalPearlBox from "@/features/knowledge/components/ClinicalPearlBox";
import EvidenceSummaryPanel from "@/features/knowledge/components/EvidenceSummaryPanel";
import VisualBodySystemCard from "@/features/knowledge/components/VisualBodySystemCard";
import DifferentialDiagnosisTable from "@/features/knowledge/components/DifferentialDiagnosisTable";
import HomeopathicPerspective from "@/features/knowledge/components/HomeopathicPerspective";
import RedFlagBox from "@/features/knowledge/components/RedFlagBox";
import MedicalIllustration from "@/features/knowledge/components/MedicalIllustration";
import InteractiveTimeline from "@/features/knowledge/components/InteractiveTimeline";
import { ShieldAlert, Info, ListChecks, Stethoscope, AlertTriangle, BookOpen, Activity } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return DISEASES.map(disease => ({
    slug: disease.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const disease = DISEASES.find(d => d.slug === slug);
  if (!disease) return {};
  return generateMedicalMetadata(disease);
}

export default async function DiseaseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const disease = DISEASES.find(d => d.slug === slug);

  if (!disease || disease.editorialStatus !== "published") {
    notFound();
  }

  const schemaJson = generateMedicalWebPageSchema(disease);
  const title = typeof disease.title === "string" ? disease.title : (disease.title?.en || "");
  const summary = typeof disease.summary === "string" ? disease.summary : (disease.summary?.en || "");
  const content = disease.content;

  const crumbs = [
    { name: "Diseases", item: "https://homeo.healthcare/knowledge/diseases" },
    { name: title, item: disease.canonicalUrl },
  ];

  const tocItems = [
    { id: "overview", label: "Overview & Definition" },
    { id: "etiology", label: "Causes & Risk Factors" },
    { id: "symptoms", label: "Clinical Presentation" },
    { id: "diagnosis", label: "Diagnostic Evaluation" },
    { id: "treatment", label: "Treatment Paradigms" },
    { id: "redflags", label: "Clinical Red Flags" },
    { id: "lifestyle", label: "Lifestyle Advice" }
  ];

  return (
    <>
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      <AnalyticsTrigger entityId={disease.id} slug={disease.slug} entityType={disease.entityType} />

      <KnowledgePageLayout
        title={title}
        subtitle={summary}
        backLink="/knowledge/diseases"
        backText="Back to Diseases"
        headerBadges={
          <>
            <EvidenceBadge level={disease.evidenceLevel} />
            <LastReviewedBadge reviewedDate={disease.versionInfo.reviewed} />
          </>
        }
        tocItems={tocItems}
        entityId={disease.id}
        entityType={disease.entityType}
      >
        <Breadcrumbs crumbs={crumbs} />

        <EditorialConfidenceBadge entity={disease} reviewedDate={disease.versionInfo.reviewed} />

        <div className="mt-4 space-y-4">
          <TimelineHistory versionInfo={disease.versionInfo} reviewer={disease.reviewer} />
          <LearningPathStepper currentId={disease.id} />
          <QuickFactsCard entity={disease} />
          <EvidenceSummaryPanel entity={disease} />
          <ClinicalPearlBox entity={disease} />
          <VisualBodySystemCard entity={disease} />
        </div>

        <div className="mt-8 space-y-10 text-neutral-850 dark:text-neutral-200 leading-relaxed">
          {/* Medical Illustration (Sprint 3) */}
          <MedicalIllustration slug={disease.slug} />

          {/* Interactive Progression Timeline (Sprint 3) */}
          <InteractiveTimeline entity={disease} />
          
          {/* Section: Overview & Definition */}
          <section id="overview" className="space-y-3 scroll-mt-24">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 border-b border-neutral-500/5 pb-2">
              <Info className="h-4.5 w-4.5 text-rose-500" /> Clinical Overview
            </h3>
            <PatientFriendlyText className="text-base text-neutral-700 dark:text-neutral-300" as="p">
              {content.overview}
            </PatientFriendlyText>
            <div className="p-4 border-l-4 border-rose-500/50 bg-rose-500/5 rounded-r-xl">
              <span className="text-[10px] uppercase font-bold text-rose-500 block mb-1">Clinical Definition</span>
              <PatientFriendlyText className="text-sm italic text-neutral-850 dark:text-neutral-205" as="p">
                {content.definition}
              </PatientFriendlyText>
            </div>
          </section>

          {/* Section: Etiology (Causes) and Risk Factors */}
          <section id="etiology" className="scroll-mt-24 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.causes && content.causes.length > 0 && (
                <div className="space-y-3 p-5 border border-neutral-500/10 rounded-2xl bg-white/5">
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 border-b border-neutral-500/5 pb-1">
                    Pathological Causes
                  </h4>
                  <ul className="list-disc list-inside space-y-1.5 text-xs text-neutral-750 dark:text-neutral-300">
                    {content.causes.map((cause: string, idx: number) => (
                      <li key={idx}>{cause}</li>
                    ))}
                  </ul>
                </div>
              )}

              {content.riskFactors && content.riskFactors.length > 0 && (
                <div className="space-y-3 p-5 border border-neutral-500/10 rounded-2xl bg-white/5">
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 border-b border-neutral-500/5 pb-1">
                    Risk Factors
                  </h4>
                  <ul className="list-disc list-inside space-y-1.5 text-xs text-neutral-750 dark:text-neutral-300">
                    {content.riskFactors.map((risk: string, idx: number) => (
                      <li key={idx}>{risk}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {/* Section: Symptoms */}
          {content.symptoms && content.symptoms.length > 0 && (
            <section id="symptoms" className="space-y-3 scroll-mt-24">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 border-b border-neutral-500/5 pb-2">
                <ListChecks className="h-4.5 w-4.5 text-rose-500" /> Clinical Symptom Presentation
              </h3>
              <ul className="list-disc list-inside space-y-2 pl-2 text-neutral-750 dark:text-neutral-300">
                {content.symptoms.map((sym: string, idx: number) => (
                  <li key={idx} className="pl-1"><span className="text-neutral-800 dark:text-neutral-200">{sym}</span></li>
                ))}
              </ul>
            </section>
          )}

          {/* Section: Diagnosis & Differential Diagnosis */}
          <section id="diagnosis" className="scroll-mt-24 space-y-6">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 border-b border-neutral-500/5 pb-2">
              <Stethoscope className="h-4.5 w-4.5 text-rose-500" /> Diagnostic Evaluation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Investigation Protocol</h4>
                <p className="text-sm text-neutral-750 dark:text-neutral-300">{content.diagnosis}</p>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Differential Diagnosis</h4>
                <p className="text-sm text-neutral-750 dark:text-neutral-300">{content.differentialDiagnosis}</p>
              </div>
            </div>

            {/* Investigation Panel: Lab Tests & Imaging */}
            <div className="p-5 border border-neutral-500/10 rounded-2xl bg-white/5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {content.labTests && content.labTests.length > 0 && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-2">Recommended Lab Parameters</span>
                    <ul className="list-disc list-inside space-y-1.5 text-xs text-neutral-750 dark:text-neutral-300">
                      {content.labTests.map((t: string, idx: number) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {content.imaging && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-2">Imaging & Radiography</span>
                    <p className="text-xs text-neutral-750 dark:text-neutral-300">{content.imaging}</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Section: Differential Diagnosis Table */}
          <DifferentialDiagnosisTable entity={disease} />

          {/* Section: Treatment Paradigms */}
          <section id="treatment" className="scroll-mt-24">
            <HomeopathicPerspective entity={disease} />
          </section>

          {/* Section: Red Flags / Alert Box */}
          <section id="redflags" className="scroll-mt-24">
            <RedFlagBox entity={disease} />
          </section>

          {/* Section: Lifestyle Advice */}
          {content.lifestyleAdvice && (
            <section id="lifestyle" className="space-y-3 scroll-mt-24">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 border-b border-neutral-500/5 pb-2">
                <Activity className="h-4.5 w-4.5 text-rose-500" /> Lifestyle & Diet Advice
              </h3>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">{content.lifestyleAdvice}</p>
            </section>
          )}
        </div>

        {/* Dynamic Knowledge Graph Explorer */}
        <div className="mt-8">
          <KnowledgeGraphExplorer currentId={disease.id} />
        </div>

        {/* References */}
        {content.references && (
          <div id="references" className="scroll-mt-24">
            <ReferencesList references={content.references} />
          </div>
        )}

        {/* AI Citation */}
        <AICitationBlock entity={disease} />

        {/* Related everything navigator */}
        <RelatedEverything entityId={disease.id} />

        <ContextualCtaBanner />

        {/* Global Medical Disclaimer */}
        <MedicalDisclaimer />
      </KnowledgePageLayout>
    </>
  );
}
