import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Stethoscope, Activity, Heart, Beaker, FileText, ChevronRight } from "lucide-react";
import KnowledgePageLayout from "@/features/knowledge/components/KnowledgePageLayout";
import KnowledgeSearch from "@/features/knowledge/components/KnowledgeSearch";
import CollectionsView from "@/features/knowledge/components/CollectionsView";

export const metadata: Metadata = {
  title: "Health Knowledge | Homeo Healthcare",
  description: "Understand a symptom, condition, test, remedy, or lifestyle topic in clear language, with clinical detail available when you need it.",
  alternates: {
    canonical: "https://homeo.healthcare/knowledge",
  },
};

export default function KnowledgeHubPage() {
  const quickLinks = [
    { name: "Conditions", href: "/knowledge/diseases", icon: <Stethoscope className="h-4 w-4" /> },
    { name: "Symptoms", href: "/knowledge/symptoms", icon: <Activity className="h-4 w-4" /> },
    { name: "Remedies", href: "/knowledge/remedies", icon: <Heart className="h-4 w-4" /> },
    { name: "Lab Tests", href: "/knowledge/lab-tests", icon: <Beaker className="h-4 w-4" /> },
    { name: "Lifestyle", href: "/knowledge/diet-lifestyle", icon: <FileText className="h-4 w-4" /> },
  ];

  return (
    <KnowledgePageLayout
      title="Understand your health question"
      subtitle="Search a symptom, condition, test, remedy, or everyday question. Start simple; explore clinical detail only when it is useful."
      backLink="/"
      backText="Back to Home"
    >
      <div className="py-2">
        <KnowledgeSearch />
      </div>

      <section className="mt-12 border-t border-neutral-500/5 pt-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-4">Explore by topic</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {quickLinks.map((link, idx) => (
          <Link
            key={idx}
            href={link.href}
            className="flex items-center justify-between p-3 border border-neutral-500/10 rounded-2xl bg-white/5 hover:bg-white/10 hover:border-teal-500/20 text-sm font-semibold text-neutral-800 dark:text-neutral-200 transition-all duration-300 shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                {link.icon}
              </span>
              <span>{link.name}</span>
            </div>
            <ChevronRight className="h-4 w-4 opacity-50" />
          </Link>
        ))}
      </div>
      </section>

      {/* Curated Clinical Collections Specialty Hubs */}
      <div className="pt-10 border-t border-neutral-500/5 mt-10">
        <CollectionsView />
      </div>
    </KnowledgePageLayout>
  );
}
