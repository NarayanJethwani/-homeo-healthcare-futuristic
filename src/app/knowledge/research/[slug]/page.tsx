import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { RESEARCH } from "@/features/knowledge/content/research";
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
  return RESEARCH.map(research => ({
    slug: research.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const paper = RESEARCH.find(r => r.slug === slug);
  if (!paper) return {};
  return generateMedicalMetadata(paper);
}

export default async function ResearchDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const paper = RESEARCH.find(r => r.slug === slug);

  if (!paper || paper.editorialStatus !== "published") {
    notFound();
  }

  const schemaJson = generateMedicalWebPageSchema(paper);
  const title = typeof paper.title === "string" ? paper.title : (paper.title?.en || "");
  const summary = typeof paper.summary === "string" ? paper.summary : (paper.summary?.en || "");

  const crumbs = [
    { name: "Research Library", item: "https://homeo.healthcare/knowledge/research" },
    { name: title, item: paper.canonicalUrl },
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
        backLink="/knowledge/research"
        backText="Back to Research"
        headerBadges={
          <>
            <EvidenceBadge level={paper.evidenceLevel} />
            <LastReviewedBadge reviewedDate={paper.versionInfo.reviewed} />
          </>
        }
      >
        <Breadcrumbs crumbs={crumbs} />

        <ReviewedBy reviewer={paper.reviewer} reviewedDate={paper.versionInfo.reviewed} />

        <div className="mt-8 space-y-8 text-neutral-800 dark:text-neutral-300 leading-relaxed">
          {/* Study Design */}
          {paper.content?.studyDesign && (
            <section className="space-y-3 p-5 border border-neutral-500/10 rounded-2xl bg-white/5">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                Study Design
              </h3>
              <p className="text-sm">
                {paper.content.studyDesign.en}
              </p>
            </section>
          )}

          {/* Key Findings */}
          {paper.content?.keyFindings && (
            <section className="space-y-3 p-5 border border-teal-500/10 rounded-2xl bg-teal-500/5">
              <h3 className="text-lg font-bold text-teal-800 dark:text-teal-400">
                Key Findings
              </h3>
              <p className="text-sm">
                {paper.content.keyFindings.en}
              </p>
            </section>
          )}
        </div>

        {/* References */}
        {paper.content?.references && (
          <ReferencesList references={paper.content.references} />
        )}

        {/* AI Citation */}
        <AICitationBlock entity={paper} />

        {/* Related everything navigator */}
        <RelatedEverything entityId={paper.id} />

        {/* Global Medical Disclaimer */}
        <MedicalDisclaimer />
      </KnowledgePageLayout>
    </>
  );
}
