import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { LAB_TESTS } from "@/features/knowledge/content/lab-tests";
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
import AnalyticsTrigger from "@/features/knowledge/components/AnalyticsTrigger";
import PatientFriendlyText from "@/features/knowledge/components/PatientFriendlyText";
import TimelineHistory from "@/features/knowledge/components/TimelineHistory";
import LearningPathStepper from "@/features/knowledge/components/LearningPathStepper";
import KnowledgeGraphExplorer from "@/features/knowledge/components/KnowledgeGraphExplorer";
import ContextualCtaBanner from "@/features/knowledge/components/ContextualCtaBanner";
import QuickFactsCard from "@/features/knowledge/components/QuickFactsCard";
import ClinicalPearlBox from "@/features/knowledge/components/ClinicalPearlBox";
import EvidenceSummaryPanel from "@/features/knowledge/components/EvidenceSummaryPanel";
import VisualBodySystemCard from "@/features/knowledge/components/VisualBodySystemCard";
import DifferentialDiagnosisTable from "@/features/knowledge/components/DifferentialDiagnosisTable";
import InterpretationAlgorithm from "@/features/knowledge/components/InterpretationAlgorithm";
import HomeopathicPerspective from "@/features/knowledge/components/HomeopathicPerspective";
import RedFlagBox from "@/features/knowledge/components/RedFlagBox";
import MedicalIllustration from "@/features/knowledge/components/MedicalIllustration";
import InteractiveTimeline from "@/features/knowledge/components/InteractiveTimeline";
import { Info, HelpCircle, Activity, ShieldAlert } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return LAB_TESTS.map(labTest => ({
    slug: labTest.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const labTest = LAB_TESTS.find(l => l.slug === slug);
  if (!labTest) return {};
  return generateMedicalMetadata(labTest);
}

export default async function LabTestDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const labTest = LAB_TESTS.find(l => l.slug === slug);

  if (!labTest || labTest.editorialStatus !== "published") {
    notFound();
  }

  const schemaJson = generateMedicalWebPageSchema(labTest);
  const title = typeof labTest.title === "string" ? labTest.title : (labTest.title?.en || "");
  const summary = typeof labTest.summary === "string" ? labTest.summary : (labTest.summary?.en || "");
  const content = labTest.content;

  const crumbs = [
    { name: "Lab Tests", item: "https://homeo.healthcare/knowledge/lab-tests" },
    { name: title, item: labTest.canonicalUrl },
  ];

  const tocItems = [
    { id: "overview", label: "Test Overview" },
    { id: "range", label: "Reference Ranges" },
    { id: "values", label: "High & Low Interpretation" },
    { id: "interpretation", label: "Clinical Interpretation" },
    { id: "warning", label: "Clinical Notices" }
  ];

  return (
    <>
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      <AnalyticsTrigger entityId={labTest.id} slug={labTest.slug} entityType={labTest.entityType} />

      <KnowledgePageLayout
        title={title}
        subtitle={summary}
        backLink="/knowledge/lab-tests"
        backText="Back to Lab Tests"
        headerBadges={
          <>
            <EvidenceBadge level={labTest.evidenceLevel} />
            <LastReviewedBadge reviewedDate={labTest.versionInfo.reviewed} />
          </>
        }
        tocItems={tocItems}
        entityId={labTest.id}
        entityType={labTest.entityType}
      >
        <Breadcrumbs crumbs={crumbs} />

        <EditorialConfidenceBadge entity={labTest} reviewedDate={labTest.versionInfo.reviewed} />

        <div className="mt-4 space-y-4">
          <TimelineHistory versionInfo={labTest.versionInfo} reviewer={labTest.reviewer} />
          <LearningPathStepper currentId={labTest.id} />
          <QuickFactsCard entity={labTest} />
          <EvidenceSummaryPanel entity={labTest} />
          <ClinicalPearlBox entity={labTest} />
          <VisualBodySystemCard entity={labTest} />
        </div>

        <div className="mt-8 space-y-8 text-neutral-850 dark:text-neutral-200 leading-relaxed">
          {/* Medical Illustration (Sprint 3) */}
          <MedicalIllustration slug={labTest.slug} />

          {/* Interactive Lab Workflow Timeline (Sprint 3) */}
          <InteractiveTimeline entity={labTest} />
          
          {/* Section: Overview */}
          <section id="overview" className="space-y-3 scroll-mt-24">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 border-b border-neutral-500/5 pb-2">
              <Info className="h-4.5 w-4.5 text-blue-500" /> Test Description & Overview
            </h3>
            <PatientFriendlyText className="text-base text-neutral-700 dark:text-neutral-300" as="p">
              {content.overview}
            </PatientFriendlyText>
          </section>

          {/* Section: Reference Range */}
          <section id="range" className="p-4 border border-blue-500/25 bg-blue-500/5 rounded-2xl scroll-mt-24">
            <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 block mb-1">Standard Reference Range</span>
            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 font-mono">{content.normalRange}</p>
          </section>

          {/* Section: High & Low Values Interpretation */}
          <section id="values" className="scroll-mt-24 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.highValues && content.highValues.length > 0 && (
                <div className="space-y-3 p-5 border border-rose-500/15 rounded-2xl bg-rose-500/5">
                  <h4 className="text-xs font-bold text-rose-800 dark:text-rose-455 uppercase tracking-wider mb-2">
                    Elevated (High) Values
                  </h4>
                  <ul className="list-disc list-inside space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                    {content.highValues.map((h: string, idx: number) => (
                      <li key={idx}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}

              {content.lowValues && content.lowValues.length > 0 && (
                <div className="space-y-3 p-5 border border-blue-500/15 rounded-2xl bg-blue-500/5">
                  <h4 className="text-xs font-bold text-blue-800 dark:text-blue-455 uppercase tracking-wider mb-2">
                    Decreased (Low) Values
                  </h4>
                  <ul className="list-disc list-inside space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                    {content.lowValues.map((l: string, idx: number) => (
                      <li key={idx}>{l}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {/* Section: Clinical Interpretation */}
          <section id="interpretation" className="space-y-3 border-t border-neutral-500/5 pt-6 scroll-mt-24">
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <Activity className="h-4.5 w-4.5 text-teal-600 dark:text-teal-400" /> Clinical Alignment & Significance
            </h3>
            {content.clinicalInterpretation ? (
              <p className="text-sm text-neutral-700 dark:text-neutral-300">{content.clinicalInterpretation}</p>
            ) : (
              <div className="p-5 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/50 text-neutral-500 dark:text-neutral-400 text-xs">
                <p>Clinical alignment and significance guidelines are pending editorial expansion and clinical review.</p>
                {/* TODO: Connect this to the editorial governance workflow for content expansion */}
              </div>
            )}
          </section>

          {/* Section: Interpretation Algorithm */}
          <InterpretationAlgorithm entity={labTest} />

          {/* Section: Differential Diagnosis Table */}
          <DifferentialDiagnosisTable entity={labTest} />

          {/* Section: Warnings */}
          <section id="warning" className="p-5 border border-rose-500/20 bg-rose-500/5 rounded-2xl flex gap-3 scroll-mt-24">
            <ShieldAlert className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-rose-800 dark:text-rose-400 text-sm">
                Diagnostic Guidance Notice
              </h4>
              <p className="text-xs text-rose-950/80 dark:text-rose-300 mt-1">
                Standard laboratory reference ranges vary based on the testing facility. Significant deviations require immediate clinician review to rule out severe medical pathology.
              </p>
            </div>
          </section>
        </div>

        {/* Dynamic Knowledge Graph Explorer */}
        <div className="mt-8">
          <KnowledgeGraphExplorer currentId={labTest.id} />
        </div>

        {/* References */}
        {content.references && (
          <div id="references" className="scroll-mt-24">
            <ReferencesList references={content.references} />
          </div>
        )}

        {/* AI Citation */}
        <AICitationBlock entity={labTest} />

        {/* Related everything navigator */}
        <RelatedEverything entityId={labTest.id} />

        <ContextualCtaBanner />

        {/* Global Medical Disclaimer */}
        <MedicalDisclaimer />
      </KnowledgePageLayout>
    </>
  );
}
