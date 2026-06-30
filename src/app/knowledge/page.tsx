import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Stethoscope, HelpCircle, Activity, Heart, Beaker, FileText, ChevronRight } from "lucide-react";
import KnowledgePageLayout from "@/features/knowledge/components/KnowledgePageLayout";
import KnowledgeSearch from "@/features/knowledge/components/KnowledgeSearch";

export const metadata: Metadata = {
  title: "Clinical Knowledge Platform | Homeo Healthcare",
  description: "Explore the structured clinical database of symptoms, homeopathic remedies, lab tests, and diet/lifestyle guidelines. Clinically reviewed and cited.",
  alternates: {
    canonical: "https://homeo.healthcare/knowledge",
  },
};

export default function KnowledgeHubPage() {
  const quickLinks = [
    { name: "Diseases & Conditions", href: "/knowledge/diseases", icon: <Stethoscope className="h-4 w-4" /> },
    { name: "Clinical Symptoms", href: "/knowledge/symptoms", icon: <Activity className="h-4 w-4" /> },
    { name: "Homeopathic Remedies", href: "/knowledge/remedies", icon: <Heart className="h-4 w-4" /> },
    { name: "Lab Test Interpretation", href: "/knowledge/lab-tests", icon: <Beaker className="h-4 w-4" /> },
    { name: "Diet & Lifestyle Guide", href: "/knowledge/diet-lifestyle", icon: <FileText className="h-4 w-4" /> },
    { name: "Patient FAQs", href: "/knowledge/faqs", icon: <HelpCircle className="h-4 w-4" /> },
  ];

  return (
    <KnowledgePageLayout
      title="Clinical Knowledge Platform"
      subtitle="Structured educational resource mapping diseases, symptoms, homeopathic remedies, and diagnostic tests. Clinically reviewed by Dr. Jethwani."
      backLink="/"
      backText="Back to Home"
    >
      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {quickLinks.map((link, idx) => (
          <Link
            key={idx}
            href={link.href}
            className="flex items-center justify-between p-4 border border-neutral-500/10 rounded-2xl bg-white/5 hover:bg-white/10 hover:border-teal-500/20 text-sm font-semibold text-neutral-800 dark:text-neutral-200 transition-all duration-300 shadow-sm"
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

      {/* Interactive Search Engine Section */}
      <div className="pt-6 border-t border-neutral-500/5">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-6 text-center">
          Interactive Knowledge Discovery
        </h2>
        <KnowledgeSearch />
      </div>
    </KnowledgePageLayout>
  );
}
