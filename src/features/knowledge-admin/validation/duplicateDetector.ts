import { KmsKnowledgeEntity } from "../types";

/**
 * Normalizes a title string into lowercase alpha tokens.
 */
function getTokens(str: string): Set<string> {
  const normalized = str.toLowerCase().replace(/[^a-z0-9\s]/g, "");
  return new Set(normalized.split(/\s+/).filter(t => t.length > 2));
}

/**
 * Calculates Jaccard similarity index between two sets.
 */
function calculateJaccard(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 || setB.size === 0) return 0;
  
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  
  return intersection.size / union.size;
}

export interface DuplicateWarning {
  entityId: string;
  title: string;
  similarity: number; // 0 to 1
  reason: "title_similarity" | "slug_match" | "acronym_match";
}

/**
 * Scans the repository context to detect potential duplicate entries.
 */
export function detectDuplicateEntities(
  target: Omit<KmsKnowledgeEntity, "readabilityScore" | "seoGeoScores">,
  pool: KmsKnowledgeEntity[]
): DuplicateWarning[] {
  const warnings: DuplicateWarning[] = [];
  const targetTitle = target.title.en || "";
  const targetTokens = getTokens(targetTitle);
  const targetSlug = target.slug.toLowerCase().replace(/[^a-z0-9]/g, "");

  for (const item of pool) {
    if (item.id === target.id) continue; // Skip comparing self

    // Check 1: Exact slug overlap
    const itemSlug = item.slug.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (targetSlug === itemSlug || targetSlug.includes(itemSlug) || itemSlug.includes(targetSlug)) {
      warnings.push({
        entityId: item.id,
        title: item.title.en,
        similarity: 0.95,
        reason: "slug_match"
      });
      continue;
    }

    // Check 2: Token Jaccard overlap
    const itemTitle = item.title.en || "";
    const itemTokens = getTokens(itemTitle);
    const jaccard = calculateJaccard(targetTokens, itemTokens);

    if (jaccard > 0.4) {
      warnings.push({
        entityId: item.id,
        title: item.title.en,
        similarity: Math.round(jaccard * 100) / 100,
        reason: "title_similarity"
      });
      continue;
    }

    // Check 3: Simple Acronym check (e.g. GERD vs Gastro Esophageal Reflux Disease)
    const targetAcronym = targetTitle.split(/\s+/).map(w => w[0]).join("").toLowerCase();
    const itemAcronym = itemTitle.split(/\s+/).map(w => w[0]).join("").toLowerCase();
    if (targetAcronym.length > 2 && (targetAcronym === itemTitle.toLowerCase() || itemAcronym === targetTitle.toLowerCase())) {
      warnings.push({
        entityId: item.id,
        title: item.title.en,
        similarity: 0.85,
        reason: "acronym_match"
      });
    }
  }

  return warnings;
}
