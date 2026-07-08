import React from "react";
import { Metadata } from "next";
import { LAB_TESTS } from "@/features/knowledge/content/lab-tests";
import KnowledgePageLayout from "@/features/knowledge/components/KnowledgePageLayout";
import CategorySearchList from "@/features/knowledge/components/CategorySearchList";

export const metadata: Metadata = {
  title: "Clinical Lab Test Interpretation | Homeo Healthcare",
  description: "Browse guides on interpreting key diagnostic tests including CBC and TSH, and their relevance to homeopathic clinical mapping. Clinically reviewed.",
  alternates: {
    canonical: "https://homeo.healthcare/knowledge/lab-tests",
  },
};

export default function LabTestsListPage() {
  const publishedLabTests = LAB_TESTS.filter(l => l.editorialStatus === "published");

  return (
    <KnowledgePageLayout
      title="Clinical Lab Test Interpretation"
      subtitle="Structured guides detailing standard reference values, pathogenetic mappings, and their role in constitutional evaluation."
      backLink="/knowledge"
      backText="Back to Knowledge Hub"
    >
      <div className="pt-2">
        <CategorySearchList 
          entities={publishedLabTests} 
          placeholder="Search lab tests by name, biomarker, or clinical purpose..."
          emptyMessage="No matching lab test guides found. Try searching for common biomarkers (e.g. TSH, Hemoglobin, CBC)."
        />
      </div>
    </KnowledgePageLayout>
  );
}
