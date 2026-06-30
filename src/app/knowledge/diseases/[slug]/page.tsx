import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { DISEASES } from "@/features/knowledge/content/diseases";
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

  const crumbs = [
    { name: "Diseases", item: "https://homeo.healthcare/knowledge/diseases" },
    { name: title, item: disease.canonicalUrl },
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
        backLink="/knowledge/diseases"
        backText="Back to Diseases"
        headerBadges={
          <>
            <EvidenceBadge level={disease.evidenceLevel} />
            <LastReviewedBadge reviewedDate={disease.versionInfo.reviewed} />
          </>
        }
      >
        <Breadcrumbs crumbs={crumbs} />

        <ReviewedBy reviewer={disease.reviewer} reviewedDate={disease.versionInfo.reviewed} />

        <div className="mt-8 space-y-8 text-neutral-800 dark:text-neutral-300 leading-relaxed">
          {/* Section: What it means */}
          {disease.content?.whatItMeans && (
            <section className="space-y-3">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                What it means
              </h3>
              <p>{typeof disease.content.whatItMeans === "string" ? disease.content.whatItMeans : (disease.content.whatItMeans?.en || "")}</p>
            </section>
          )}

          {/* Section: Common Symptoms */}
          {disease.content?.commonSymptoms && disease.content.commonSymptoms.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                Common Symptoms
              </h3>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                {disease.content.commonSymptoms.map((sym: any, idx: number) => (
                  <li key={idx}>
                    {typeof sym === "string" ? sym : (sym.en || "")}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Section: When to consult doctor */}
          {disease.content?.whenToConsultDoctor && (
            <section className="p-5 border border-rose-500/20 bg-rose-500/5 rounded-2xl space-y-2">
              <h4 className="font-bold text-rose-800 dark:text-rose-400">
                When to consult a doctor (Red Flags)
              </h4>
              <p className="text-sm">
                {typeof disease.content.whenToConsultDoctor === "string" ? disease.content.whenToConsultDoctor : (disease.content.whenToConsultDoctor?.en || "")}
              </p>
            </section>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {/* Section: Conventional medical perspective */}
            {disease.content?.conventionalPerspective && (
              <section className="space-y-3 p-5 border border-neutral-500/10 rounded-2xl bg-white/5">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  Conventional Perspective
                </h3>
                <p className="text-sm">
                  {typeof disease.content.conventionalPerspective === "string" ? disease.content.conventionalPerspective : (disease.content.conventionalPerspective?.en || "")}
                </p>
              </section>
            )}

            {/* Section: Homeopathic perspective */}
            {disease.content?.homeopathicPerspective && (
              <section className="space-y-3 p-5 border border-neutral-500/10 rounded-2xl bg-white/5">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  Homeopathic Perspective
                </h3>
                <p className="text-sm">
                  {typeof disease.content.homeopathicPerspective === "string" ? disease.content.homeopathicPerspective : (disease.content.homeopathicPerspective?.en || "")}
                </p>
              </section>
            )}
          </div>

          {/* Section: Possible homeopathic remedy considerations */}
          {disease.content?.remedyConsiderations && (
            <section className="space-y-3">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                Possible Homeopathic Remedy Considerations
              </h3>
              <p className="text-sm bg-teal-500/5 border border-teal-500/15 p-4 rounded-xl">
                {typeof disease.content.remedyConsiderations === "string" ? disease.content.remedyConsiderations : (disease.content.remedyConsiderations?.en || "")}
              </p>
            </section>
          )}

          {/* Section: Lifestyle and diet guidance */}
          {disease.content?.lifestyleDietGuidance && (
            <section className="space-y-3">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                Lifestyle and Diet Guidance
              </h3>
              <p>{typeof disease.content.lifestyleDietGuidance === "string" ? disease.content.lifestyleDietGuidance : (disease.content.lifestyleDietGuidance?.en || "")}</p>
            </section>
          )}
        </div>

        {/* References */}
        {disease.content?.references && (
          <ReferencesList references={disease.content.references} />
        )}

        {/* AI Citation */}
        <AICitationBlock entity={disease} />

        {/* Related everything navigator */}
        <RelatedEverything entityId={disease.id} />

        {/* Global Medical Disclaimer */}
        <MedicalDisclaimer />
      </KnowledgePageLayout>
    </>
  );
}
