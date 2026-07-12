import React from "react";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import { KmsKnowledgeEntity } from "../types";
import { buildKnowledgeSourceVersionReadModel } from "../../knowledge/read-models/sourceVersionReadModel";
import { buildSourceDiscrepancyQueue } from "../../knowledge/read-models/sourceDiscrepancyQueue";

function entityToSourceVersion(entity: KmsKnowledgeEntity) {
  const rightsStatus = entity.content?.rightsStatus;
  const rightsApproved = rightsStatus === "public-domain" || rightsStatus === "licensed";
  return buildKnowledgeSourceVersionReadModel({
    sourceVersionId: entity.approvedVersionId || entity.versionInfo?.version || entity.id,
    rightsApproved,
    editorialApproved: entity.editorialStatus === "published" && entity.reviewStatus === "clinically-reviewed",
    reviewExpiresAt: entity.nextClinicalReview || entity.nextReviewDate || undefined,
    withdrawnAt: entity.editorialStatus === "archived" ? entity.lastUpdated : undefined,
    citationComplete: entity.citationHealth !== "critical",
    graphValidationPassed: (entity.graphCompleteness ?? 0) >= 100,
  });
}

export function SourceDiscrepancyPanel({ entities }: { entities: readonly KmsKnowledgeEntity[] }) {
  const queue = buildSourceDiscrepancyQueue(entities.map(entityToSourceVersion));
  if (queue.length === 0) {
    return <section aria-label="Source discrepancy queue" className="rounded-xl border border-emerald-800/40 bg-emerald-950/20 p-3 text-xs text-emerald-300">No source-version discrepancies detected.</section>;
  }

  return (
    <section aria-labelledby="source-discrepancy-title" className="rounded-2xl border border-amber-800/40 bg-amber-950/10 p-4">
      <div className="mb-3 flex items-center gap-2">
        <ShieldAlert className="h-4 w-4 text-amber-400" />
        <h2 id="source-discrepancy-title" className="text-sm font-bold text-amber-200">Source-version discrepancy queue</h2>
        <span className="text-xs text-amber-500">{queue.length} require review</span>
      </div>
      <ul className="space-y-2">
        {queue.slice(0, 20).map(item => (
          <li key={item.sourceVersionId} className="flex items-start gap-2 rounded-xl border border-neutral-800 bg-neutral-950/40 p-3 text-xs">
            <AlertTriangle className={`mt-0.5 h-3.5 w-3.5 ${item.severity === "blocking" ? "text-rose-400" : "text-amber-400"}`} />
            <div>
              <div className="font-mono text-neutral-300">{item.sourceVersionId}</div>
              <div className="mt-1 text-neutral-500">{item.reasons.join(" · ")}</div>
            </div>
          </li>
        ))}
      </ul>
      {queue.length > 20 && <p className="mt-3 text-xs text-neutral-500">Showing the first 20 discrepancies.</p>}
    </section>
  );
}

