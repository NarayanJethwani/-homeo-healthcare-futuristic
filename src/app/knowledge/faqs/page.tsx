import React from "react";
import { Metadata } from "next";
import { FAQS } from "@/features/knowledge/content/faqs";
import KnowledgePageLayout from "@/features/knowledge/components/KnowledgePageLayout";
import FAQBlock from "@/features/knowledge/components/FAQBlock";
import MedicalDisclaimer from "@/features/knowledge/components/MedicalDisclaimer";
import ReviewedBy from "@/features/knowledge/components/ReviewedBy";

export const metadata: Metadata = {
  title: "Clinical FAQs | Homeo Healthcare",
  description: "Read frequently asked questions about homeopathic remedies, security profiles, dosage, and safety. Clinically reviewed.",
  alternates: {
    canonical: "https://homeo.healthcare/knowledge/faqs",
  },
};

export default function FaqsPage() {
  const reviewer = {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Clinical Instruction & Safety",
    institution: "Homeo Healthcare Clinic",
  };

  // Extract all localized faqs list items from the content collection
  const allFaqItems = FAQS.flatMap(entity => entity.content.faqsList || []);

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
