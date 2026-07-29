import assert from "node:assert/strict";
import {
  assessKnowledgeEntityForFastTrack,
  buildFastTrackSummary,
} from "../src/features/knowledge/governance/fastTrackPolicy";
import type { KmsKnowledgeEntity } from "../src/features/knowledge-admin/types";

function entity(
  overrides: Partial<KmsKnowledgeEntity> = {}
): KmsKnowledgeEntity {
  const now = "2026-07-29T00:00:00.000Z";
  return {
    id: "D-TEST-001",
    slug: "test",
    entityType: "disease",
    title: { en: "Test", hi: "", gu: "", mr: "", es: "", ar: "" },
    summary: { en: "Cited medical reference.", hi: "", gu: "", mr: "", es: "", ar: "" },
    relatedEntities: [],
    lastReviewed: now,
    lastUpdated: now,
    author: { name: "Author" },
    reviewer: {
      name: "Independent Reviewer",
      credentials: "MD",
      specialty: "Medicine",
    },
    lastClinicalReview: now,
    reviewStatus: "clinically-reviewed",
    legacyVerificationStatus: "verified-published",
    evidenceLevel: "Clinical-Evidence",
    tags: [],
    canonicalUrl: "https://homeo.healthcare/knowledge/diseases/test",
    editorialStatus: "published",
    editorialNotes: "",
    nextReviewDate: "2027-07-29T00:00:00.000Z",
    versionInfo: {
      version: "1.0.0",
      created: now,
      updated: now,
      reviewed: now,
      changelog: [],
    },
    content: { overview: "Reference overview.", references: ["CIT-0017"] },
    readabilityScore: {
      score: 90,
      readingLevel: "Patient Friendly",
      readingTimeMinutes: 1,
    },
    seoGeoScores: { seoScore: 90, geoScore: 90, aiReadinessScore: 90 },
    ...overrides,
  };
}

const reviewed = assessKnowledgeEntityForFastTrack(entity());
assert.equal(reviewed.lane, "background-monitoring");
assert.equal(reviewed.isNewOrUnverified, false);

const legacyPublished = assessKnowledgeEntityForFastTrack(
  entity({
    id: "D-LEGACY-001",
    author: { name: "Legacy Clinician" },
    reviewer: {
      name: "Legacy Clinician",
      credentials: "MD",
      specialty: "Medicine",
    },
  })
);
assert.equal(legacyPublished.lane, "background-monitoring");

const changedAfterReview = assessKnowledgeEntityForFastTrack(
  entity({
    id: "D-CHANGED-001",
    lastUpdated: "2026-07-30T00:00:00.000Z",
  })
);
assert.equal(changedAfterReview.lane, "human-review");

const newArticle = assessKnowledgeEntityForFastTrack(
  entity({
    id: "D-NEW-001",
    reviewStatus: "needs-review",
    legacyVerificationStatus: "review-required",
  })
);
assert.equal(newArticle.lane, "human-review");
assert.equal(newArticle.isNewOrUnverified, true);

const unsafe = assessKnowledgeEntityForFastTrack(
  entity({
    id: "D-UNSAFE-001",
    content: {
      overview: "This is a guaranteed cure with no side effects.",
      references: ["CIT-0017"],
    },
  })
);
assert.equal(unsafe.lane, "blocked");
assert.ok(
  unsafe.flags.some((flag) => flag.code === "PROHIBITED_MEDICAL_CLAIM")
);

const uncited = assessKnowledgeEntityForFastTrack(
  entity({ id: "D-UNCITED-001", content: { overview: "No citation." } })
);
assert.equal(uncited.lane, "human-review");
assert.ok(uncited.flags.some((flag) => flag.code === "CITATION_REQUIRED"));

const summary = buildFastTrackSummary([
  entity(),
  entity({
    id: "D-NEW-001",
    reviewStatus: "needs-review",
    legacyVerificationStatus: "review-required",
  }),
  entity({
    id: "D-UNSAFE-001",
    content: {
      overview: "This is a guaranteed cure with no side effects.",
      references: ["CIT-0017"],
    },
  }),
]);
assert.equal(summary.total, 3);

console.log("knowledgeFastTrackPolicy.test.ts: all assertions passed");
