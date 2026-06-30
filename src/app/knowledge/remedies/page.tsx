import React from "react";
import { Metadata } from "next";
import { REMEDIES } from "@/features/knowledge/content/remedies";
import KnowledgePageLayout from "@/features/knowledge/components/KnowledgePageLayout";
import EntityCard from "@/features/knowledge/components/EntityCard";

export const metadata: Metadata = {
  title: "Homeopathic Materia Medica | Homeo Healthcare",
  description: "Browse structured profiles for primary homeopathic remedies including Sulphur, Nux Vomica, and Lycopodium. Clinically reviewed.",
  alternates: {
    canonical: "https://homeo.healthcare/knowledge/remedies",
  },
};

export default function RemediesListPage() {
  const publishedRemedies = REMEDIES.filter(r => r.editorialStatus === "published");

  return (
    <KnowledgePageLayout
      title="Homeopathic Materia Medica"
      subtitle="Structured summaries of key remedies, exploring their botanical or mineral origins, clinical affinities, constitutional types, and guiding modalities."
      backLink="/knowledge"
      backText="Back to Knowledge Hub"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {publishedRemedies.map(remedy => (
          <EntityCard key={remedy.id} entity={remedy} />
        ))}
      </div>
    </KnowledgePageLayout>
  );
}
