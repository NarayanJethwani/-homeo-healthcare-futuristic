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

  const crumbs = [
    { name: "Symptoms", item: "https://homeo.healthcare/knowledge/symptoms" },
    { name: title, item: symptom.canonicalUrl },
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
        backLink="/knowledge/symptoms"
        backText="Back to Symptoms"
        headerBadges={
          <>
            <EvidenceBadge level={symptom.evidenceLevel} />
            <LastReviewedBadge reviewedDate={symptom.versionInfo.reviewed} />
          </>
        }
      >
        <Breadcrumbs crumbs={crumbs} />

        <ReviewedBy reviewer={symptom.reviewer} reviewedDate={symptom.versionInfo.reviewed} />

        <div className="mt-8 space-y-8 text-neutral-800 dark:text-neutral-300 leading-relaxed">
          {/* Section: What it means */}
          {symptom.content?.whatItMeans && (
            <section className="space-y-3">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                Pathophysiology & Meaning
              </h3>
              <p>{typeof symptom.content.whatItMeans === "string" ? symptom.content.whatItMeans : (symptom.content.whatItMeans?.en || "")}</p>
            </section>
          )}

          {/* Section: When to consult doctor */}
          {symptom.content?.whenToConsultDoctor && (
            <section className="p-5 border border-rose-500/20 bg-rose-500/5 rounded-2xl space-y-2">
              <h4 className="font-bold text-rose-800 dark:text-rose-400">
                When to consult a doctor (Red Flags)
              </h4>
              <p className="text-sm">
                {typeof symptom.content.whenToConsultDoctor === "string" ? symptom.content.whenToConsultDoctor : (symptom.content.whenToConsultDoctor?.en || "")}
              </p>
            </section>
          )}

          {/* Section: Possible homeopathic remedy considerations */}
          {symptom.content?.remedyConsiderations && (
            <section className="space-y-3">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                Homeopathic Remedy Considerations
              </h3>
              <p className="text-sm bg-teal-500/5 border border-teal-500/15 p-4 rounded-xl">
                {typeof symptom.content.remedyConsiderations === "string" ? symptom.content.remedyConsiderations : (symptom.content.remedyConsiderations?.en || "")}
              </p>
            </section>
          )}

          {/* Section: Lifestyle and diet guidance */}
          {symptom.content?.lifestyleDietGuidance && (
            <section className="space-y-3">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                Lifestyle and Diet Support
              </h3>
              <p>{typeof symptom.content.lifestyleDietGuidance === "string" ? symptom.content.lifestyleDietGuidance : (symptom.content.lifestyleDietGuidance?.en || "")}</p>
            </section>
          )}
        </div>

        {/* References */}
        {symptom.content?.references && (
          <ReferencesList references={symptom.content.references} />
        )}

        {/* AI Citation */}
        <AICitationBlock entity={symptom} />

        {/* Related everything navigator */}
        <RelatedEverything entityId={symptom.id} />

        {/* Global Medical Disclaimer */}
        <MedicalDisclaimer />
      </KnowledgePageLayout>
    </>
  );
}
