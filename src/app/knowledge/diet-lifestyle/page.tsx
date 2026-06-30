import React from "react";
import { Metadata } from "next";
import KnowledgePageLayout from "@/features/knowledge/components/KnowledgePageLayout";
import MedicalDisclaimer from "@/features/knowledge/components/MedicalDisclaimer";
import ReviewedBy from "@/features/knowledge/components/ReviewedBy";
import ReferencesList from "@/features/knowledge/components/ReferencesList";

export const metadata: Metadata = {
  title: "Diet & Lifestyle Guidelines | Homeo Healthcare",
  description: "Educational guide detailing nutrition, sleep habits, and stress management practices that support constitutional homeopathic recovery.",
  alternates: {
    canonical: "https://homeo.healthcare/knowledge/diet-lifestyle",
  },
};

export default function DietLifestylePage() {
  const reviewer = {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Clinical Nutrition & Constitutional Care",
    institution: "Homeo Healthcare Clinic",
  };

  const references = [
    "Clinical Nutrition Handbook - World Health Organization Guidelines, 2022.",
    "Boger CM. Synoptic Key of the Materia Medica. 1915."
  ];

  return (
    <KnowledgePageLayout
      title="Diet & Lifestyle Guidelines"
      subtitle="Fostering optimal recovery through aligned lifestyle patterns, metabolic nutrition, and stress management."
      backLink="/knowledge"
      backText="Back to Knowledge Hub"
    >
      <ReviewedBy reviewer={reviewer} reviewedDate="2026-06-30T12:00:00Z" />

      <div className="mt-8 space-y-8 text-neutral-800 dark:text-neutral-300 leading-relaxed">
        <section className="space-y-3">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            1. Digestive Health & Gut-Brain Axis
          </h3>
          <p>
            For conditions like GERD or IBS, diet plays an immediate role. Maintain regular eating schedules
            to prevent prolonged periods of empty stomach acid accumulation. Emphasize warm, cooked, easily
            digestible foods (such as rice, steamed vegetables, and clear soups) while minimizing fatty foods,
            processed spices, and excess caffeine or alcohol which weaken the lower esophageal sphincter (LES).
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            2. Skin Barrier Support
          </h3>
          <p>
            Chronic skin inflammatory states (Eczema, Psoriasis) require consistent systemic hydration and
            avoidance of dietary triggers. Maintain high fluid intake (2-3 liters of warm water daily).
            Incorporate anti-inflammatory fatty acids (Omega-3s from flaxseeds or walnuts) and avoid high-sugar
            processed foods which trigger insulin spikes and subsequent skin inflammation.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            3. Stress & Neurological Balance
          </h3>
          <p>
            Migraines and anxiety states are heavily influenced by sleep hygiene and sensory overstimulation.
            Establish a consistent sleep schedule (sleeping and waking at the same hour daily). Reduce blue-light
            exposure from mobile and computer screens at least 1 hour before bed, and practice mindfulness or
            gentle breathing exercises to decrease sympathetic nervous system activity.
          </p>
        </section>
      </div>

      <ReferencesList references={references} />

      <MedicalDisclaimer />
    </KnowledgePageLayout>
  );
}
