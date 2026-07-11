import { RemedyAliasRecord } from "./localSearchTypes";
import { normalizeSearchQuery } from "./textNormalization";

export const REMEDY_ALIASES_REGISTRY: RemedyAliasRecord[] = [
  {
    id: "alias-aconite-1",
    canonicalRemedyId: "aconitum-napellus",
    aliasText: "Aconite",
    normalizedAlias: normalizeSearchQuery("Aconite"),
    aliasType: "common-name",
    verificationStatus: "verified",
    reviewedBy: "clinical-editor-uid-991",
    reviewedAt: "2026-07-11T12:00:00Z"
  },
  {
    id: "alias-acon-2",
    canonicalRemedyId: "aconitum-napellus",
    aliasText: "Acon.",
    normalizedAlias: normalizeSearchQuery("Acon."),
    aliasType: "abbreviation",
    verificationStatus: "verified",
    reviewedBy: "clinical-editor-uid-991",
    reviewedAt: "2026-07-11T12:00:00Z"
  },
  {
    id: "alias-bell-1",
    canonicalRemedyId: "belladonna",
    aliasText: "Bell.",
    normalizedAlias: normalizeSearchQuery("Bell."),
    aliasType: "abbreviation",
    verificationStatus: "verified",
    reviewedBy: "clinical-editor-uid-991",
    reviewedAt: "2026-07-11T12:00:00Z"
  },
  {
    id: "alias-bryonia-alba-1",
    canonicalRemedyId: "bryonia",
    aliasText: "Bryonia Alba",
    normalizedAlias: normalizeSearchQuery("Bryonia Alba"),
    aliasType: "synonym",
    verificationStatus: "verified",
    reviewedBy: "clinical-editor-uid-991",
    reviewedAt: "2026-07-11T12:00:00Z"
  },
  {
    id: "alias-bry-2",
    canonicalRemedyId: "bryonia",
    aliasText: "Bry.",
    normalizedAlias: normalizeSearchQuery("Bry."),
    aliasType: "abbreviation",
    verificationStatus: "verified",
    reviewedBy: "clinical-editor-uid-991",
    reviewedAt: "2026-07-11T12:00:00Z"
  },
  {
    id: "alias-acon-unverified",
    canonicalRemedyId: "aconitum-napellus",
    aliasText: "Monkshood",
    normalizedAlias: normalizeSearchQuery("Monkshood"),
    aliasType: "common-name",
    verificationStatus: "unverified"
  },
  {
    id: "alias-bell-deprecated",
    canonicalRemedyId: "belladonna",
    aliasText: "Deadly Nightshade",
    normalizedAlias: normalizeSearchQuery("Deadly Nightshade"),
    aliasType: "common-name",
    verificationStatus: "verified",
    deprecatedAt: "2026-07-11T12:00:00Z"
  }
];

// Helper to validate registry integrity at runtime or build time (reject collisions)
export function validateAliasRegistry(): boolean {
  const seenAliases = new Map<string, string>(); // normalizedAlias -> canonicalRemedyId
  for (const record of REMEDY_ALIASES_REGISTRY) {
    if (record.verificationStatus !== "verified" || record.deprecatedAt) {
      continue;
    }
    const existing = seenAliases.get(record.normalizedAlias);
    if (existing && existing !== record.canonicalRemedyId) {
      // Collision detected (same alias maps to different canonical remedies!)
      return false;
    }
    seenAliases.set(record.normalizedAlias, record.canonicalRemedyId);
  }
  return true;
}
