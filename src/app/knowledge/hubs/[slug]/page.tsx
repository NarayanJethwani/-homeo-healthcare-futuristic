import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { CURATED_COLLECTIONS, getEntitiesForCollection } from "@/features/knowledge/collections/collectionsRegistry";
import KnowledgePageLayout from "@/features/knowledge/components/KnowledgePageLayout";
import Breadcrumbs from "@/features/knowledge/components/Breadcrumbs";
import { Flame, Sparkles, Baby, Wind, Smile, ShieldAlert, Brain, Accessibility, Activity, ArrowRight, BookOpen, Stethoscope, Heart, Beaker } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CURATED_COLLECTIONS.map(col => ({
    slug: col.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const col = CURATED_COLLECTIONS.find(c => c.slug === slug);
  if (!col) return {};

  return {
    title: `${col.name} Hub | Homeo Healthcare`,
    description: col.description,
    alternates: {
      canonical: `https://homeo.healthcare/knowledge/hubs/${col.slug}`,
    }
  };
}

const IconLookup: Record<string, any> = {
  Flame,
  Sparkles,
  Baby,
  Wind,
  Smile,
  ShieldAlert,
  Brain,
  Accessibility,
  Activity
};

export default async function HubPageDetail({ params }: PageProps) {
  const { slug } = await params;
  const col = CURATED_COLLECTIONS.find(c => c.slug === slug);

  if (!col) {
    notFound();
  }

  const members = getEntitiesForCollection(col.id);

  const diseases = members.filter(e => e.entityType === "disease");
  const remedies = members.filter(e => e.entityType === "remedy");
  const symptoms = members.filter(e => e.entityType === "symptom");
  const labTests = members.filter(e => e.entityType === "lab-test");

  const IconComponent = IconLookup[col.iconName] || BookOpen;

  const crumbs = [
    { name: "Knowledge Hub", item: "https://homeo.healthcare/knowledge" },
    { name: col.name, item: `https://homeo.healthcare/knowledge/hubs/${col.slug}` },
  ];

  return (
    <KnowledgePageLayout
      title={col.name}
      subtitle={col.description}
      backLink="/knowledge"
      backText="Back to Knowledge Hub"
      headerBadges={
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs font-bold text-teal-650 dark:text-teal-400 font-mono">
          <IconComponent className="h-4 w-4" /> CURATED SPECIALTY CLUSTER
        </span>
      }
    >
      <Breadcrumbs crumbs={crumbs} />

      <div className="mt-8 space-y-10 text-neutral-850 dark:text-neutral-200 leading-relaxed">
        
        {/* Intro */}
        <section className="space-y-4">
          <p className="text-base text-neutral-700 dark:text-neutral-300">
            This collection indexes clinical guidelines, guiding symptoms, remedies, and diagnostic pathways managed within the {col.name} topic cluster.
          </p>
        </section>

        {/* Dynamic categories map */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          
          {/* Diseases section */}
          {diseases.length > 0 && (
            <div className="p-6 border border-neutral-200 dark:border-neutral-850 rounded-3xl bg-white/5 backdrop-blur-md space-y-3.5 shadow-sm">
              <h3 className="text-base font-extrabold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2">
                <Stethoscope className="h-4.5 w-4.5 text-rose-500" /> Condition Overviews ({diseases.length})
              </h3>
              <div className="space-y-2">
                {diseases.map(e => (
                  <Link
                    key={e.id}
                    href={`/knowledge/diseases/${e.slug}`}
                    className="block p-3 rounded-2xl bg-neutral-100/40 dark:bg-neutral-950/40 hover:bg-rose-500/5 hover:border-rose-500/20 border border-transparent transition-all group"
                  >
                    <h4 className="text-xs font-bold text-neutral-850 dark:text-neutral-200 group-hover:text-rose-500 transition-colors">
                      {typeof e.title === "string" ? e.title : e.title.en}
                    </h4>
                    <p className="text-[10px] text-neutral-500 mt-1 leading-relaxed line-clamp-2">
                      {typeof e.summary === "string" ? e.summary : e.summary.en}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Symptoms section */}
          {symptoms.length > 0 && (
            <div className="p-6 border border-neutral-200 dark:border-neutral-850 rounded-3xl bg-white/5 backdrop-blur-md space-y-3.5 shadow-sm">
              <h3 className="text-base font-extrabold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2">
                <Activity className="h-4.5 w-4.5 text-amber-500" /> Associated Symptoms ({symptoms.length})
              </h3>
              <div className="space-y-2">
                {symptoms.map(e => (
                  <Link
                    key={e.id}
                    href={`/knowledge/symptoms/${e.slug}`}
                    className="block p-3 rounded-2xl bg-neutral-100/40 dark:bg-neutral-950/40 hover:bg-amber-500/5 hover:border-amber-500/20 border border-transparent transition-all group"
                  >
                    <h4 className="text-xs font-bold text-neutral-850 dark:text-neutral-200 group-hover:text-amber-600 transition-colors">
                      {typeof e.title === "string" ? e.title : e.title.en}
                    </h4>
                    <p className="text-[10px] text-neutral-500 mt-1 leading-relaxed line-clamp-2">
                      {typeof e.summary === "string" ? e.summary : e.summary.en}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Remedies section */}
          {remedies.length > 0 && (
            <div className="p-6 border border-neutral-200 dark:border-neutral-850 rounded-3xl bg-white/5 backdrop-blur-md space-y-3.5 shadow-sm">
              <h3 className="text-base font-extrabold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2">
                <Heart className="h-4.5 w-4.5 text-teal-500" /> Homeopathic Remedies ({remedies.length})
              </h3>
              <div className="space-y-2">
                {remedies.map(e => (
                  <Link
                    key={e.id}
                    href={`/knowledge/remedies/${e.slug}`}
                    className="block p-3 rounded-2xl bg-neutral-100/40 dark:bg-neutral-950/40 hover:bg-teal-500/5 hover:border-teal-500/20 border border-transparent transition-all group"
                  >
                    <h4 className="text-xs font-bold text-neutral-850 dark:text-neutral-200 group-hover:text-teal-500 transition-colors">
                      {typeof e.title === "string" ? e.title : e.title.en}
                    </h4>
                    <p className="text-[10px] text-neutral-500 mt-1 leading-relaxed line-clamp-2">
                      {typeof e.summary === "string" ? e.summary : e.summary.en}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Lab Tests section */}
          {labTests.length > 0 && (
            <div className="p-6 border border-neutral-200 dark:border-neutral-850 rounded-3xl bg-white/5 backdrop-blur-md space-y-3.5 shadow-sm">
              <h3 className="text-base font-extrabold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2">
                <Beaker className="h-4.5 w-4.5 text-blue-500" /> Lab Investigations ({labTests.length})
              </h3>
              <div className="space-y-2">
                {labTests.map(e => (
                  <Link
                    key={e.id}
                    href={`/knowledge/lab-tests/${e.slug}`}
                    className="block p-3 rounded-2xl bg-neutral-100/40 dark:bg-neutral-950/40 hover:bg-blue-500/5 hover:border-blue-500/20 border border-transparent transition-all group"
                  >
                    <h4 className="text-xs font-bold text-neutral-850 dark:text-neutral-200 group-hover:text-blue-500 transition-colors">
                      {typeof e.title === "string" ? e.title : e.title.en}
                    </h4>
                    <p className="text-[10px] text-neutral-500 mt-1 leading-relaxed line-clamp-2">
                      {typeof e.summary === "string" ? e.summary : e.summary.en}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </KnowledgePageLayout>
  );
}
