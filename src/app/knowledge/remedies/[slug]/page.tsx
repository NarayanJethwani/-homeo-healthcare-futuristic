import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { REMEDIES } from "@/features/knowledge/content/remedies";
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
  return REMEDIES.map(remedy => ({
    slug: remedy.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const remedy = REMEDIES.find(r => r.slug === slug);
  if (!remedy) return {};
  return generateMedicalMetadata(remedy);
}

export default async function RemedyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const remedy = REMEDIES.find(r => r.slug === slug);

  if (!remedy || remedy.editorialStatus !== "published") {
    notFound();
  }

  const schemaJson = generateMedicalWebPageSchema(remedy);
  const title = typeof remedy.title === "string" ? remedy.title : (remedy.title?.en || "");
  const summary = typeof remedy.summary === "string" ? remedy.summary : (remedy.summary?.en || "");

  const crumbs = [
    { name: "Remedies", item: "https://homeo.healthcare/knowledge/remedies" },
    { name: title, item: remedy.canonicalUrl },
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
        backLink="/knowledge/remedies"
        backText="Back to Remedies"
        headerBadges={
          <>
            <EvidenceBadge level={remedy.evidenceLevel} />
            <LastReviewedBadge reviewedDate={remedy.versionInfo.reviewed} />
          </>
        }
      >
        <Breadcrumbs crumbs={crumbs} />

        <ReviewedBy reviewer={remedy.reviewer} reviewedDate={remedy.versionInfo.reviewed} />

        <div className="mt-8 space-y-8 text-neutral-800 dark:text-neutral-300 leading-relaxed">
          {/* Section: What it means */}
          {remedy.content?.whatItMeans && (
            <section className="space-y-3">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                Remedy Source & Description
              </h3>
              <p>{typeof remedy.content.whatItMeans === "string" ? remedy.content.whatItMeans : (remedy.content.whatItMeans?.en || "")}</p>
            </section>
          )}

          {/* Section: Homeopathic perspective */}
          {remedy.content?.homeopathicPerspective && (
            <section className="space-y-3">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                Homeopathic Constitutional Profile
              </h3>
              <p>{typeof remedy.content.homeopathicPerspective === "string" ? remedy.content.homeopathicPerspective : (remedy.content.homeopathicPerspective?.en || "")}</p>
            </section>
          )}

          {/* Section: Possible homeopathic remedy considerations */}
          {remedy.content?.remedyConsiderations && (
            <section className="space-y-3">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                Therapeutic Considerations
              </h3>
              <p className="text-sm bg-teal-500/5 border border-teal-500/15 p-4 rounded-xl">
                {typeof remedy.content.remedyConsiderations === "string" ? remedy.content.remedyConsiderations : (remedy.content.remedyConsiderations?.en || "")}
              </p>
            </section>
          )}

          {/* Section: Lifestyle and diet guidance */}
          {remedy.content?.lifestyleDietGuidance && (
            <section className="space-y-3">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                Constitutional Care Advice
              </h3>
              <p>{typeof remedy.content.lifestyleDietGuidance === "string" ? remedy.content.lifestyleDietGuidance : (remedy.content.lifestyleDietGuidance?.en || "")}</p>
            </section>
          )}

          {/* Section: Warnings */}
          <section className="p-5 border border-rose-500/20 bg-rose-500/5 rounded-2xl space-y-2">
            <h4 className="font-bold text-rose-800 dark:text-rose-400">
              Safety Information
            </h4>
            <p className="text-sm">
              Homeopathic remedy sections are designed for clinician reference. Potency and dosing require consultation with a qualified physician. Self-prescribing is not advised.
            </p>
          </section>
        </div>

        {/* References */}
        {remedy.content?.references && (
          <ReferencesList references={remedy.content.references} />
        )}

        {/* AI Citation */}
        <AICitationBlock entity={remedy} />

        {/* Related everything navigator */}
        <RelatedEverything entityId={remedy.id} />

        {/* Global Medical Disclaimer */}
        <MedicalDisclaimer />
      </KnowledgePageLayout>
    </>
  );
}
