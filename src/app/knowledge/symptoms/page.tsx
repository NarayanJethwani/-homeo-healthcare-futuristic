import React from "react";
import { Metadata } from "next";
import { SYMPTOMS } from "@/features/knowledge/content/symptoms";
import KnowledgePageLayout from "@/features/knowledge/components/KnowledgePageLayout";
import CategorySearchList from "@/features/knowledge/components/CategorySearchList";

export const metadata: Metadata = {
  title: "Clinical Symptoms Index | Homeo Healthcare",
  description: "Browse educational summaries of common symptoms such as heartburn, skin rashes, and headaches, and their correlation to homeopathic remedies.",
  alternates: {
    canonical: "https://homeo.healthcare/knowledge/symptoms",
  },
};

export default function SymptomsListPage() {
  const publishedSymptoms = SYMPTOMS.filter(s => s.editorialStatus === "published");

  return (
    <KnowledgePageLayout
      title="Clinical Symptoms Index"
      subtitle="Structured guides exploring the underlying pathophysiology of common symptoms and their constitutional homeopathic mappings."
      backLink="/knowledge"
      backText="Back to Knowledge Hub"
    >
      <div className="pt-2">
        <CategorySearchList 
          entities={publishedSymptoms} 
          placeholder="Search symptoms by name, sensation, or localization..."
          emptyMessage="No matching symptoms found in the clinical index. Try searching for broader terms like Pain, Headache, or Digestive."
        />
      </div>
    </KnowledgePageLayout>
  );
}
