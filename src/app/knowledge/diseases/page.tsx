import React from "react";
import { Metadata } from "next";
import { DISEASES } from "@/features/knowledge/content/diseases";
import KnowledgePageLayout from "@/features/knowledge/components/KnowledgePageLayout";
import CategorySearchList from "@/features/knowledge/components/CategorySearchList";

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
      <div className="pt-2">
        <CategorySearchList 
          entities={publishedDiseases} 
          placeholder="Search diseases and conditions by name, signs, or symptoms..."
          emptyMessage="No matching clinical guides found in the database. Try searching for symptoms (e.g. Acid Reflux) or tag categories."
        />
      </div>
    </KnowledgePageLayout>
  );
}
