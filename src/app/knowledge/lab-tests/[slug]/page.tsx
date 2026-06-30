import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { LAB_TESTS } from "@/features/knowledge/content/lab-tests";
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

  const crumbs = [
    { name: "Lab Tests", item: "https://homeo.healthcare/knowledge/lab-tests" },
    { name: title, item: labTest.canonicalUrl },
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
        backLink="/knowledge/lab-tests"
        backText="Back to Lab Tests"
        headerBadges={
          <>
            <EvidenceBadge level={labTest.evidenceLevel} />
            <LastReviewedBadge reviewedDate={labTest.versionInfo.reviewed} />
          </>
        }
      >
        <Breadcrumbs crumbs={crumbs} />

        <ReviewedBy reviewer={labTest.reviewer} reviewedDate={labTest.versionInfo.reviewed} />

        <div className="mt-8 space-y-8 text-neutral-800 dark:text-neutral-300 leading-relaxed">
          {/* Section: What it means */}
          {labTest.content?.whatItMeans && (
            <section className="space-y-3">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                Test Description & Meaning
              </h3>
              <p>{typeof labTest.content.whatItMeans === "string" ? labTest.content.whatItMeans : (labTest.content.whatItMeans?.en || "")}</p>
            </section>
          )}

          {/* Section: Homeopathic perspective */}
          {labTest.content?.homeopathicPerspective && (
            <section className="space-y-3">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                Homeopathic Alignment & Clinical Significance
              </h3>
              <p>{typeof labTest.content.homeopathicPerspective === "string" ? labTest.content.homeopathicPerspective : (labTest.content.homeopathicPerspective?.en || "")}</p>
            </section>
          )}

          {/* Section: Possible homeopathic remedy considerations */}
          {labTest.content?.remedyConsiderations && (
            <section className="space-y-3">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                Constitutional Remedy Considerations
              </h3>
              <p className="text-sm bg-teal-500/5 border border-teal-500/15 p-4 rounded-xl">
                {typeof labTest.content.remedyConsiderations === "string" ? labTest.content.remedyConsiderations : (labTest.content.remedyConsiderations?.en || "")}
              </p>
            </section>
          )}

          {/* Section: Lifestyle and diet guidance */}
          {labTest.content?.lifestyleDietGuidance && (
            <section className="space-y-3">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                Lifestyle Support
              </h3>
              <p>{typeof labTest.content.lifestyleDietGuidance === "string" ? labTest.content.lifestyleDietGuidance : (labTest.content.lifestyleDietGuidance?.en || "")}</p>
            </section>
          )}

          {/* Section: Warnings */}
          <section className="p-5 border border-rose-500/20 bg-rose-500/5 rounded-2xl space-y-2">
            <h4 className="font-bold text-rose-800 dark:text-rose-400">
              Guidance Warning
            </h4>
            <p className="text-sm">
              Standard laboratory reference ranges vary based on the testing facility. Significant deviations require immediate clinician review to rule out severe medical pathology.
            </p>
          </section>
        </div>

        {/* References */}
        {labTest.content?.references && (
          <ReferencesList references={labTest.content.references} />
        )}

        {/* AI Citation */}
        <AICitationBlock entity={labTest} />

        {/* Related everything navigator */}
        <RelatedEverything entityId={labTest.id} />

        {/* Global Medical Disclaimer */}
        <MedicalDisclaimer />
      </KnowledgePageLayout>
    </>
  );
}
