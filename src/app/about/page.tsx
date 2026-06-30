import React from "react";
import { Metadata } from "next";
import KnowledgePageLayout from "@/features/knowledge/components/KnowledgePageLayout";
import MedicalDisclaimer from "@/features/knowledge/components/MedicalDisclaimer";

export const metadata: Metadata = {
  title: "About Our Clinic & Treatment Philosophy | Homeo Healthcare",
  description: "Learn about Homeo Healthcare's mission, technology-assisted constitutional prescribing methods, and evidence-based clinical approaches. Dr. Narayan Jethwani.",
  alternates: {
    canonical: "https://homeo.healthcare/about",
  },
};

export default function AboutPage() {
  return (
    <KnowledgePageLayout
      title="About Homeo Healthcare"
      subtitle="Bridging classical constitutional homeopathy with modern diagnostic systems and scientific research."
      backLink="/"
      backText="Back to Home"
    >
      <div className="mt-8 space-y-8 text-neutral-800 dark:text-neutral-300 leading-relaxed">
        <section className="space-y-3">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Our Core Mission
          </h3>
          <p>
            At Homeo Healthcare, our objective is to provide personalized, root-cause therapeutics for chronic
            somatic and psychological conditions. Rather than suppressing individual symptoms, we evaluate
            the patient's constitutional state, medical history, life-stress factors, and physical markers.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Constitutional Repertorization
          </h3>
          <p>
            We leverage advanced analytical repertory software (integrating Kent's and Boericke's repertories) alongside
            clinical diagnostics to isolate the best-matching, highly diluted mineral, mineral-salt, or botanical
            remedies. This ensures precise, safe, and highly personalized therapeutics.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Evidence-Based Mappings
          </h3>
          <p>
            All our clinical pathways are aligned with ongoing clinical trials, published observational research,
            and standard peer-reviewed guidelines. We maintain transparency by outlining evidence classifications
            for every remedy selection.
          </p>
        </section>
      </div>

      <MedicalDisclaimer />
    </KnowledgePageLayout>
  );
}
