import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { REMEDIES } from "@/features/knowledge/content/remedies";
import { generateMedicalMetadata } from "@/features/knowledge/metadata/medicalMetadata";
import { generateMedicalWebPageSchema } from "@/features/knowledge/schemas/jsonLdSchemas";
import KnowledgePageLayout from "@/features/knowledge/components/KnowledgePageLayout";
import EditorialConfidenceBadge from "@/features/knowledge/components/EditorialConfidenceBadge";
import LastReviewedBadge from "@/features/knowledge/components/LastReviewedBadge";
import EvidenceBadge from "@/features/knowledge/components/EvidenceBadge";
import MedicalDisclaimer from "@/features/knowledge/components/MedicalDisclaimer";
import ReferencesList from "@/features/knowledge/components/ReferencesList";
import AICitationBlock from "@/features/knowledge/components/AICitationBlock";
import RelatedEverything from "@/features/knowledge/components/RelatedEverything";
import Breadcrumbs from "@/features/knowledge/components/Breadcrumbs";
import CollapsibleSection from "@/features/knowledge/components/CollapsibleSection";
import AnalyticsTrigger from "@/features/knowledge/components/AnalyticsTrigger";
import TimelineHistory from "@/features/knowledge/components/TimelineHistory";
import PatientFriendlyText from "@/features/knowledge/components/PatientFriendlyText";
import LearningPathStepper from "@/features/knowledge/components/LearningPathStepper";
import KnowledgeGraphExplorer from "@/features/knowledge/components/KnowledgeGraphExplorer";
import ContextualCtaBanner from "@/features/knowledge/components/ContextualCtaBanner";
import QuickFactsCard from "@/features/knowledge/components/QuickFactsCard";
import ClinicalPearlBox from "@/features/knowledge/components/ClinicalPearlBox";
import EvidenceSummaryPanel from "@/features/knowledge/components/EvidenceSummaryPanel";
import VisualBodySystemCard from "@/features/knowledge/components/VisualBodySystemCard";
import DifferentialDiagnosisTable from "@/features/knowledge/components/DifferentialDiagnosisTable";
import HomeopathicPerspective from "@/features/knowledge/components/HomeopathicPerspective";
import RedFlagBox from "@/features/knowledge/components/RedFlagBox";
import MedicalIllustration from "@/features/knowledge/components/MedicalIllustration";
import { ShieldAlert, Info, ListChecks, Heart, Beaker, HelpCircle, Activity } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return REMEDIES.map(remedy => ({
    slug: remedy.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const remedy = REMEDIES.find(r => r.slug === slug);
  if (!remedy) return {};
  return generateMedicalMetadata(remedy);
}

import { evaluatePublicationEligibility } from "@/features/knowledge/governance/publicationGuard";

export default async function RemedyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const remedy = REMEDIES.find(r => r.slug === slug);

  if (!remedy) {
    notFound();
  }

  const eligibility = evaluatePublicationEligibility(remedy);
  if (eligibility.publicationStatus === "draft" || eligibility.publicationStatus === "archived") {
    notFound();
  }

  const title = typeof remedy.title === "string" ? remedy.title : (remedy.title?.en || "");
  const summary = typeof remedy.summary === "string" ? remedy.summary : (remedy.summary?.en || "");
  const content = remedy.content;
  const schemaJson = generateMedicalWebPageSchema(remedy);

  const crumbs = [
    { name: "Remedies", item: "https://homeo.healthcare/knowledge/remedies" },
    { name: title, item: remedy.canonicalUrl },
  ];

  if (eligibility.publicationStatus === "withdrawn") {
    return (
      <KnowledgePageLayout
        title={title}
        subtitle={summary}
        backLink="/knowledge/remedies"
        backText="Back to Remedies"
        headerBadges={<span className="text-xs bg-rose-500/10 text-rose-400 px-2.5 py-1 rounded-md font-bold border border-rose-500/20">Under Clinical Review</span>}
        entityId={remedy.id}
        entityType={remedy.entityType}
      >
        <Breadcrumbs crumbs={crumbs} />
        <EditorialConfidenceBadge entity={remedy} reviewedDate={remedy.versionInfo.reviewed} />
        <div className="p-8 my-8 border border-amber-500/20 bg-amber-500/5 rounded-2xl text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-amber-500/10 rounded-full text-amber-500">
            <ShieldAlert className="h-8 w-8 text-amber-400" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Content Under Clinical Review</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xl mx-auto leading-relaxed">
            This clinical remedy entry is currently undergoing independent clinical review to ensure source taxonomy, safety boundaries, and evidence alignment. Body content is temporarily unavailable.
          </p>
        </div>
        <MedicalDisclaimer />
      </KnowledgePageLayout>
    );
  }

  const tocItems = [
    { id: "overview", label: "Overview & Source" },
    { id: "keynotes", label: "Guiding Keynotes" },
    { id: "symptoms", label: "Symptom Affinities" },
    { id: "modalities", label: "Modalities (Better/Worse)" },
    { id: "constitution", label: "Constitution & Affinity" },
    { id: "safety", label: "Safety & Instructions" }
  ];

  return (
    <>
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson).replace(/</g, "\\u003c") }}
      />

      <AnalyticsTrigger entityId={remedy.id} slug={remedy.slug} entityType={remedy.entityType} />

      <KnowledgePageLayout
        title={title}
        subtitle={summary}
        backLink="/knowledge/remedies"
        backText="Back to Remedies"
        headerBadges={
          <>
            <EvidenceBadge level={remedy.evidenceLevel} />
            <LastReviewedBadge reviewedDate={remedy.versionInfo.reviewed} />
          </>
        }
        tocItems={tocItems}
        entityId={remedy.id}
        entityType={remedy.entityType}
      >
        <Breadcrumbs crumbs={crumbs} />

        <EditorialConfidenceBadge entity={remedy} reviewedDate={remedy.versionInfo.reviewed} />

        <div className="mt-4 space-y-4">
          <TimelineHistory versionInfo={remedy.versionInfo} reviewer={remedy.reviewer} />
          <LearningPathStepper currentId={remedy.id} />
          <QuickFactsCard entity={remedy} />
          <EvidenceSummaryPanel entity={remedy} />
          <ClinicalPearlBox entity={remedy} />
          <VisualBodySystemCard entity={remedy} />
        </div>

        <div className="mt-8 space-y-10 text-neutral-850 dark:text-neutral-200 leading-relaxed">
          {/* Medical Illustration (Sprint 3) */}
          <MedicalIllustration slug={remedy.slug} />
          
          {/* Section: Overview & Source */}
          <section id="overview" className="space-y-4 scroll-mt-24">
            {/* Quick Clinical Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 border border-neutral-500/10 rounded-2xl bg-white/5 backdrop-blur-md">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Latin Name</span>
                <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 italic">{content.latinName}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Common Name</span>
                <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{content.commonName}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Kingdom</span>
                <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{content.kingdom}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Remedy Type</span>
                <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{content.remedyType}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 border-b border-neutral-500/5 pb-2">
                <Info className="h-4.5 w-4.5 text-teal-500" /> Clinical Description
              </h3>
              <PatientFriendlyText className="text-base text-neutral-700 dark:text-neutral-300" as="p">
                {content.description}
              </PatientFriendlyText>
            </div>
          </section>

          {/* Section: Keynotes */}
          {content.keynotes && content.keynotes.length > 0 && (
            <section id="keynotes" className="space-y-3 scroll-mt-24">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 border-b border-neutral-500/5 pb-2">
                <ListChecks className="h-4.5 w-4.5 text-teal-500" /> Guiding Keynotes
              </h3>
              <ul className="list-disc list-inside space-y-2 pl-2 text-neutral-700 dark:text-neutral-300">
                {content.keynotes.map((note: string, idx: number) => (
                  <li key={idx} className="pl-1"><span className="text-neutral-800 dark:text-neutral-200">{note}</span></li>
                ))}
              </ul>
            </section>
          )}

          {/* Section: Symptom Affinities (Mental vs Physical) */}
          <section id="symptoms" className="scroll-mt-24">
            <CollapsibleSection
              title="Symptom Affinities & Key Indications"
              icon={<Activity className="h-4.5 w-4.5 text-teal-500" />}
              defaultExpanded={true}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {content.mentalSymptoms && content.mentalSymptoms.length > 0 && (
                  <div className="space-y-3 p-4 border border-neutral-500/5 rounded-xl bg-neutral-500/5">
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 border-b border-neutral-500/5 pb-1">
                      Mental-Emotional Symptoms
                    </h4>
                    <ul className="list-disc list-inside space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                      {content.mentalSymptoms.map((sym: string, idx: number) => (
                        <li key={idx}>{sym}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {content.physicalSymptoms && content.physicalSymptoms.length > 0 && (
                  <div className="space-y-3 p-4 border border-neutral-500/5 rounded-xl bg-neutral-500/5">
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 border-b border-neutral-500/5 pb-1">
                      Physical / Particular Indicators
                    </h4>
                    <ul className="list-disc list-inside space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                      {content.physicalSymptoms.map((sym: string, idx: number) => (
                        <li key={idx}>{sym}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CollapsibleSection>
          </section>

          {/* Section: Modalities (Worse / Better) */}
          <section id="modalities" className="scroll-mt-24 space-y-3">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 border-b border-neutral-500/5 pb-2">
              <Activity className="h-4.5 w-4.5 text-teal-500" /> Modalities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 border border-neutral-500/10 rounded-2xl bg-white/5">
              <div>
                <h4 className="font-bold text-rose-600 dark:text-rose-400 text-sm uppercase tracking-wider mb-3">Aggravation (Worse)</h4>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-neutral-750 dark:text-neutral-300">
                  {content.modalitiesWorse.map((worse: string, idx: number) => (
                    <li key={idx}>{worse}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-emerald-600 dark:text-emerald-400 text-sm uppercase tracking-wider mb-3">Amelioration (Better)</h4>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-neutral-750 dark:text-neutral-300">
                  {content.modalitiesBetter.map((better: string, idx: number) => (
                    <li key={idx}>{better}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Section: Constitution & Affinity */}
          <section id="constitution" className="scroll-mt-24 space-y-6">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 border-b border-neutral-500/5 pb-2">
              <Heart className="h-4.5 w-4.5 text-teal-500" /> Constitutional Mappings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.generalities && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Generalities</h4>
                  <p className="text-sm text-neutral-750 dark:text-neutral-300">{content.generalities}</p>
                </div>
              )}
              {content.constitution && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Constitutional Type</h4>
                  <p className="text-sm text-neutral-750 dark:text-neutral-300">{content.constitution}</p>
                </div>
              )}
            </div>

            {/* Clinical / Organ/Miasmatic Affinities */}
            <div className="space-y-4 pt-4 border-t border-neutral-500/5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Therapeutic Affinities</h4>
              <div className="flex flex-wrap gap-4 text-xs">
                <div className="px-4 py-2 border border-neutral-500/10 rounded-xl bg-white/5">
                  <span className="font-bold block text-[10px] text-neutral-400 uppercase mb-1">Organ Affinity</span>
                  <div className="flex flex-wrap gap-1.5">
                    {content.organAffinity.map((org: string) => (
                      <span key={org} className="bg-teal-500/10 text-teal-700 dark:text-teal-400 px-2 py-0.5 rounded-full font-semibold">{org}</span>
                    ))}
                  </div>
                </div>
                <div className="px-4 py-2 border border-neutral-500/10 rounded-xl bg-white/5">
                  <span className="font-bold block text-[10px] text-neutral-400 uppercase mb-1">Miasmatic Affinity</span>
                  <div className="flex flex-wrap gap-1.5">
                    {content.miasmaticAffinity.map((mias: string) => (
                      <span key={mias} className="bg-purple-500/10 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-full font-semibold">{mias}</span>
                    ))}
                  </div>
                </div>
                <div className="px-4 py-2 border border-neutral-500/10 rounded-xl bg-white/5">
                  <span className="font-bold block text-[10px] text-neutral-400 uppercase mb-1">Common Potencies</span>
                  <div className="flex flex-wrap gap-1.5">
                    {content.potencies.map((pot: string) => (
                      <span key={pot} className="bg-blue-500/10 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full font-mono">{pot}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Differential Diagnosis Table */}
          <DifferentialDiagnosisTable entity={remedy} />

          {/* Section: Homeopathic Perspective */}
          <HomeopathicPerspective entity={remedy} />

          {/* Section: Safety */}
          {content.safetyNotes && (
            <section id="safety" className="p-5 border border-rose-500/20 bg-rose-500/5 rounded-2xl flex gap-3 scroll-mt-24">
              <ShieldAlert className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-rose-800 dark:text-rose-400 text-sm">
                  Clinical Safety & Potency Guidance
                </h4>
                <p className="text-xs text-rose-950/80 dark:text-rose-300 mt-1">
                  {content.safetyNotes}
                </p>
              </div>
            </section>
          )}
        </div>

        {/* Dynamic Knowledge Graph Explorer */}
        <div className="mt-8">
          <KnowledgeGraphExplorer currentId={remedy.id} />
        </div>

        {/* References */}
        {content.references && (
          <div id="references" className="scroll-mt-24">
            <ReferencesList references={content.references} />
          </div>
        )}

        {/* AI Citation */}
        <AICitationBlock entity={remedy} />

        {/* Related everything navigator */}
        <RelatedEverything entityId={remedy.id} />

        <ContextualCtaBanner />

        {/* Global Medical Disclaimer */}
        <MedicalDisclaimer />
      </KnowledgePageLayout>
    </>
  );
}
