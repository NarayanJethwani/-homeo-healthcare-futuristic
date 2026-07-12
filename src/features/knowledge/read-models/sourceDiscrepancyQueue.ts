import { KnowledgeSourceVersionReadModel } from "./sourceVersionReadModel";

export type SourceDiscrepancyQueueItem = {
  sourceVersionId: string;
  severity: "blocking" | "review";
  reasons: string[];
};

export function buildSourceDiscrepancyQueue(
  sources: readonly KnowledgeSourceVersionReadModel[],
): SourceDiscrepancyQueueItem[] {
  return sources
    .filter(source => source.exclusionReasons.length > 0)
    .map((source): SourceDiscrepancyQueueItem => ({
      sourceVersionId: source.sourceVersionId,
      severity: source.searchEligible ? "review" : "blocking",
      reasons: [...source.exclusionReasons].sort(),
    }))
    .sort((a, b) => {
      if (a.severity !== b.severity) return a.severity === "blocking" ? -1 : 1;
      return a.sourceVersionId.localeCompare(b.sourceVersionId, "en");
    });
}
