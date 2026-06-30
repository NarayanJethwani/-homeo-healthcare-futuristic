import React from "react";
import { Metadata } from "next";
import { LAB_TESTS } from "@/features/knowledge/content/lab-tests";
import KnowledgePageLayout from "@/features/knowledge/components/KnowledgePageLayout";
import EntityCard from "@/features/knowledge/components/EntityCard";

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {publishedLabTests.map(labTest => (
          <EntityCard key={labTest.id} entity={labTest} />
        ))}
      </div>
    </KnowledgePageLayout>
  );
}
