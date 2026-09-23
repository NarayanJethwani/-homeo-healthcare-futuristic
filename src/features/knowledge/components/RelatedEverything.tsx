"use client";

import React from "react";
import Link from "next/link";
import { Link2, Stethoscope, HelpCircle, Activity, Heart, GitCompare, FileText } from "lucide-react";
import { getRelatedEntities } from "../graph/knowledgeGraph";
import { getEntityUrl } from "../index";
import { COMPARISONS } from "../comparisons/comparisonRegistry";

interface RelatedEverythingProps {
  entityId: string;
}

export default function RelatedEverything({ entityId }: RelatedEverythingProps) {
  const related = getRelatedEntities(entityId);
  // Older relationship imports can contain the same connection more than once.
  // Keep a single, useful link per topic so readers are not asked to process
  // duplicate chips and React retains stable keys.
  const uniqueRelated = related.filter(
    (item, index, items) => items.findIndex((candidate) => candidate.entity.id === item.entity.id) === index
  );

  // Find related comparisons from registry
  const relatedComparisons = COMPARISONS.filter(
    c => c.entity1Id === entityId || c.entity2Id === entityId
  );

  // Group by entityType
  const grouped = uniqueRelated.reduce((acc, curr) => {
    const type = curr.entity.entityType;
    if (!acc[type]) acc[type] = [];
    acc[type].push(curr);
    return acc;
  }, {} as Record<string, typeof uniqueRelated>);

  // Check if we have any data to render
  const hasRelated = uniqueRelated.length > 0 || relatedComparisons.length > 0;

  if (!hasRelated) {
    return (
      <div className="my-8 text-center py-6 px-4 border border-dashed border-neutral-500/10 rounded-2xl">
        <p className="text-sm text-neutral-500">No clinical connections registered for this topic.</p>
      </div>
    );
  }

  // Icons helper
  const getIconForType = (type: string) => {
    switch (type) {
      case "disease": return <Stethoscope className="h-4 w-4" />;
      case "symptom": return <Activity className="h-4 w-4" />;
      case "remedy": return <Heart className="h-4 w-4" />;
      case "lab-test": return <Stethoscope className="h-4 w-4" />;
      case "faq": return <HelpCircle className="h-4 w-4" />;
      case "research": return <FileText className="h-4 w-4" />;
      case "case-study": return <FileText className="h-4 w-4" />;
      default: return <Link2 className="h-4 w-4" />;
    }
  };

  const getHeadingForType = (type: string) => {
    switch (type) {
      case "disease": return "Related Diseases";
      case "symptom": return "Related Symptoms";
      case "remedy": return "Related Remedies";
      case "lab-test": return "Related Investigations";
      case "faq": return "Related FAQs";
      case "research": return "Related Protocols & Research";
      case "case-study": return "Clinical Case Studies";
      default: return "Related Nodes";
    }
  };

  return (
    <div className="my-8 space-y-6">
      <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-2 mb-4">
        <Link2 className="h-5 w-5 text-teal-600 dark:text-teal-400" /> Clinical Connections
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Render Graph relationships grouped by type */}
        {Object.entries(grouped).map(([type, items]) => (
          <div
            key={type}
            className="p-5 border border-neutral-250 dark:border-neutral-850 rounded-2xl bg-white/5 backdrop-blur-md"
          >
            <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-450 mb-3 flex items-center gap-2">
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
                    <span className="text-[9px] opacity-60">({relation})</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Render Related Comparisons */}
        {relatedComparisons.length > 0 && (
          <div className="p-5 border border-neutral-250 dark:border-neutral-850 rounded-2xl bg-white/5 backdrop-blur-md">
            <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-450 mb-3 flex items-center gap-2">
              <GitCompare className="h-4 w-4 text-indigo-500" /> Related Comparisons
            </h4>
            <div className="flex flex-wrap gap-2">
              {relatedComparisons.map((comp) => (
                <Link
                  key={comp.slug}
                  href={`/knowledge/compare/${comp.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs py-1.5 px-3 rounded-full border border-indigo-500/25 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-755 dark:text-indigo-400 transition-colors"
                >
                  <GitCompare className="h-3 w-3 shrink-0" />
                  <span>{comp.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
