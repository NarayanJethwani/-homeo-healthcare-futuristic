import React from "react";
import { Metadata } from "next";
import { DISEASES } from "@/features/knowledge/content/diseases";
import KnowledgePageLayout from "@/features/knowledge/components/KnowledgePageLayout";
import EntityCard from "@/features/knowledge/components/EntityCard";

export const metadata: Metadata = {
  title: "Clinical Condition Guides | Homeo Healthcare",
  description: "Browse educational profiles for common chronic diseases including GERD, Eczema, Migraine, and IBS. Clinically reviewed.",
  alternates: {
    canonical: "https://homeo.healthcare/knowledge/diseases",
  },
};

export default function DiseasesListPage() {
  const publishedDiseases = DISEASES.filter(d => d.editorialStatus === "published");

  return (
    <KnowledgePageLayout
      title="Clinical Condition Guides"
      subtitle="Structured educational profiles mapping pathophysiology, signs, conventional options, and homeopathic considerations."
      backLink="/knowledge"
      backText="Back to Knowledge Hub"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {publishedDiseases.map(disease => (
          <EntityCard key={disease.id} entity={disease} />
        ))}
      </div>
    </KnowledgePageLayout>
  );
}
