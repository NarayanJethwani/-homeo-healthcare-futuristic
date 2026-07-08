import React from "react";
import Link from "next/link";
import { ArrowUpRight, Stethoscope, HelpCircle, Activity, Heart, FileText, Beaker } from "lucide-react";
import { KnowledgeEntity, Locale } from "../types";
import { getEntityUrl } from "../index";

interface EntityCardProps {
  entity: KnowledgeEntity;
  locale?: Locale;
}

export default function EntityCard({ entity, locale = "en" }: EntityCardProps) {
  const title = typeof entity.title === "string" ? entity.title : (entity.title?.[locale] || entity.title?.["en"] || "");
  const summary = typeof entity.summary === "string" ? entity.summary : (entity.summary?.[locale] || entity.summary?.["en"] || "");

  // Map icon based on entity type
  const getIcon = () => {
    switch (entity.entityType) {
      case "disease":
        return <Stethoscope className="h-5 w-5 text-rose-500" />;
      case "symptom":
        return <Activity className="h-5 w-5 text-amber-500" />;
      case "remedy":
        return <Heart className="h-5 w-5 text-emerald-500" />;
      case "lab-test":
        return <Beaker className="h-5 w-5 text-blue-500" />;
      case "faq":
        return <HelpCircle className="h-5 w-5 text-teal-500" />;
      default:
        return <FileText className="h-5 w-5 text-purple-500" />;
    }
  };

  const getBadgeColor = () => {
    switch (entity.entityType) {
      case "disease": return "bg-rose-500/10 text-rose-600 dark:text-rose-400";
      case "symptom": return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
      case "remedy": return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
      case "lab-test": return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      case "faq": return "bg-teal-500/10 text-teal-600 dark:text-teal-400";
      default: return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
    }
  };

  const href = getEntityUrl(entity.entityType, entity.slug);

  return (
    <Link
      href={href}
      className="group relative rounded-2xl border border-neutral-500/10 bg-white/5 backdrop-blur-md p-6 hover:bg-neutral-500/5 hover:border-teal-500/20 transition-all duration-300 flex flex-col justify-between h-full text-left no-underline cursor-pointer"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="p-2.5 rounded-xl bg-white/10 dark:bg-white/5 border border-white/10">
            {getIcon()}
          </div>
          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${getBadgeColor()}`}>
            {entity.entityType === "lab-test" ? "Lab Test" : entity.entityType === "case-study" ? "Case Study" : entity.entityType}
          </span>
        </div>

        <h4 className="text-lg font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-200 line-clamp-1">
          {title}
        </h4>

        <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 line-clamp-3">
          {summary}
        </p>

        {entity.tags && entity.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {entity.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="text-[10px] bg-neutral-500/5 text-neutral-500 px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-neutral-500/5 flex items-center justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300">
        <span className="opacity-65">Audience: {entity.audience}</span>
        <span className="inline-flex items-center gap-1 text-teal-600 dark:text-teal-400 group-hover:translate-x-0.5 transition-transform duration-200">
          View Details <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
