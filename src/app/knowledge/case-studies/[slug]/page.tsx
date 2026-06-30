import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { CASE_STUDIES } from "@/features/knowledge/content/case-studies";
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

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CASE_STUDIES.map(cs => ({
    slug: cs.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cs = CASE_STUDIES.find(c => c.slug === slug);
  if (!cs) return {};
  return generateMedicalMetadata(cs);
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const cs = CASE_STUDIES.find(c => c.slug === slug);

  if (!cs || cs.editorialStatus !== "published") {
    notFound();
  }

  const schemaJson = generateMedicalWebPageSchema(cs);
  const title = typeof cs.title === "string" ? cs.title : (cs.title?.en || "");
  const summary = typeof cs.summary === "string" ? cs.summary : (cs.summary?.en || "");

  const crumbs = [
    { name: "Case Reports", item: "https://homeo.healthcare/knowledge/case-studies" },
    { name: title, item: cs.canonicalUrl },
  ];

  return (
    <>
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      <KnowledgePageLayout
        title={title}
        subtitle={summary}
        backLink="/knowledge/case-studies"
        backText="Back to Case Reports"
        headerBadges={
          <>
            <EvidenceBadge level={cs.evidenceLevel} />
            <LastReviewedBadge reviewedDate={cs.versionInfo.reviewed} />
          </>
        }
      >
        <Breadcrumbs crumbs={crumbs} />

        <ReviewedBy reviewer={cs.reviewer} reviewedDate={cs.versionInfo.reviewed} />

        <div className="mt-8 space-y-8 text-neutral-800 dark:text-neutral-300 leading-relaxed">
          {/* Case Intake */}
          {cs.content?.caseIntake && (
            <section className="space-y-3 p-5 border border-neutral-500/10 rounded-2xl bg-white/5">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                Patient Intake
              </h3>
              <p className="text-sm">
                {cs.content.caseIntake.en}
              </p>
            </section>
          )}

          {/* Repertorization */}
          {cs.content?.repertorization && (
            <section className="space-y-3 p-5 border border-neutral-500/10 rounded-2xl bg-white/5">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                Repertorial Analysis
              </h3>
              <p className="text-sm">
                {cs.content.repertorization.en}
              </p>
            </section>
          )}

          {/* Prescription & Follow-up */}
          {cs.content?.prescriptionAndFollowUp && (
            <section className="space-y-3 p-5 border border-emerald-500/10 rounded-2xl bg-emerald-500/5">
              <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-400">
                Prescription & Follow-up Timeline
              </h3>
              <p className="text-sm">
                {cs.content.prescriptionAndFollowUp.en}
              </p>
            </section>
          )}
        </div>

        {/* References */}
        {cs.content?.references && (
          <ReferencesList references={cs.content.references} />
        )}

        {/* AI Citation */}
        <AICitationBlock entity={cs} />

        {/* Related everything navigator */}
        <RelatedEverything entityId={cs.id} />

        {/* Global Medical Disclaimer */}
        <MedicalDisclaimer />
      </KnowledgePageLayout>
    </>
  );
}
