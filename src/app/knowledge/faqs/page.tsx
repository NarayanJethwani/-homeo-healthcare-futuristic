import React from "react";
import { Metadata } from "next";
import { FAQS } from "@/features/knowledge/content/faqs";
import KnowledgePageLayout from "@/features/knowledge/components/KnowledgePageLayout";
import FAQBlock from "@/features/knowledge/components/FAQBlock";
import MedicalDisclaimer from "@/features/knowledge/components/MedicalDisclaimer";
import ReviewedBy from "@/features/knowledge/components/ReviewedBy";
import { loadActiveControlledPublicationOverride } from "@/features/knowledge/governance/activeControlledPublication";
import { evaluatePublicationEligibility } from "@/features/knowledge/governance/publicationGuard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Clinical FAQs | Homeo Healthcare",
  description: "Read frequently asked questions about homeopathic remedies, security profiles, dosage, and safety. Clinically reviewed.",
  alternates: {
    canonical: "https://homeo.healthcare/knowledge/faqs",
  },
};

export default async function FaqsPage() {
  const reviewer = {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Clinical Instruction & Safety",
    institution: "Homeo Healthcare Clinic",
  };

  const controlledOverride =
    await loadActiveControlledPublicationOverride("FAQ-safety");
  const allFaqItems = FAQS.filter((entity) => {
    const eligibility = evaluatePublicationEligibility(
      entity,
      entity.id === controlledOverride?.entityId
        ? controlledOverride
        : null
    );
    return eligibility.publicationStatus === "published";
  }).flatMap((entity) => entity.content.faqsList || []);

  return (
    <KnowledgePageLayout
      title="Clinical FAQs"
      subtitle="Clear, honest, and clinically reviewed answers to common questions about homeopathic therapeutics, dilution safety, and integration."
      backLink="/knowledge"
      backText="Back to Knowledge Hub"
    >
      <ReviewedBy reviewer={reviewer} reviewedDate="2026-06-30T12:00:00Z" />

      <div className="mt-8">
        <FAQBlock faqs={allFaqItems} />
      </div>

      <MedicalDisclaimer />
    </KnowledgePageLayout>
  );
}
