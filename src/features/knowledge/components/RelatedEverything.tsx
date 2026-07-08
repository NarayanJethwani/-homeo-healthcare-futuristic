import React from "react";
import Link from "next/link";
import { Link2, Stethoscope, HelpCircle, Activity, Heart, Calendar } from "lucide-react";
import { getRelatedEntities } from "../graph/knowledgeGraph";
import { getEntityUrl } from "../index";

interface RelatedEverythingProps {
  entityId: string;
}

export default function RelatedEverything({ entityId }: RelatedEverythingProps) {
  const related = getRelatedEntities(entityId);

  if (related.length === 0) {
    return (
      <div className="my-8 text-center py-6 px-4 border border-dashed border-neutral-500/10 rounded-2xl">
        <p className="text-sm text-neutral-500">No related topics found for this entity.</p>
      </div>
    );
  }

  // Group by entityType
  const grouped = related.reduce((acc, curr) => {
    const type = curr.entity.entityType;
    if (!acc[type]) acc[type] = [];
    acc[type].push(curr);
    return acc;
  }, {} as Record<string, typeof related>);

  // Helper to map icons to entityType
  const getIconForType = (type: string) => {
    switch (type) {
      case "disease": return <Stethoscope className="h-4 w-4" />;
      case "symptom": return <Activity className="h-4 w-4" />;
      case "remedy": return <Heart className="h-4 w-4" />;
      case "lab-test": return <Stethoscope className="h-4 w-4" />;
      case "faq": return <HelpCircle className="h-4 w-4" />;
      default: return <Link2 className="h-4 w-4" />;
    }
  };

  const getHeadingForType = (type: string) => {
    switch (type) {
      case "disease": return "Related Diseases";
      case "symptom": return "Related Symptoms";
      case "remedy": return "Considered Remedies";
      case "lab-test": return "Relevant Lab Tests";
      case "faq": return "FAQs";
      case "research": return "Research Summaries";
      case "case-study": return "Clinical Case Studies";
      default: return "Related Content";
    }
  };

  return (
    <div className="my-8 space-y-6">
      <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-2 mb-4">
        <Link2 className="h-5 w-5 text-teal-600 dark:text-teal-400" /> Interconnected Clinical Knowledge
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(grouped).map(([type, items]) => (
          <div
            key={type}
            className="p-5 border border-neutral-500/10 rounded-2xl bg-white/5 backdrop-blur-md"
          >
            <h4 className="font-semibold text-sm uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3 flex items-center gap-2">
              {getIconForType(type)} {getHeadingForType(type)}
            </h4>
            <div className="flex flex-wrap gap-2">
              {items.map(({ entity, relation }) => {
                const title = typeof entity.title === "string" ? entity.title : (entity.title?.en || "");
                const href = getEntityUrl(entity.entityType, entity.slug);
                return (
                  <Link
                    key={entity.id}
                    href={href}
                    className="inline-flex items-center gap-1 text-xs py-1.5 px-3 rounded-full border border-teal-500/20 bg-teal-500/5 hover:bg-teal-500/10 text-teal-700 dark:text-teal-400 transition-colors"
                  >
                    <span>{title}</span>
                    <span className="text-[10px] opacity-60">({relation})</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Appointment CTA Box */}
      <div className="rounded-2xl border border-teal-500/20 bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-teal-500/10 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h4 className="font-bold text-neutral-800 dark:text-neutral-200">
            Need Individualized Medical Advice?
          </h4>
          <p className="text-xs text-neutral-600 dark:text-neutral-300">
            Schedule a constitutional consult with Dr. Narayan Jethwani for a personalized treatment plan.
          </p>
        </div>
        <Link
          href="/#booking"
          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 px-5 rounded-full text-sm shadow-md transition-colors"
        >
          <Calendar className="h-4 w-4" /> Book Clinical Consultation
        </Link>
      </div>
    </div>
  );
}
