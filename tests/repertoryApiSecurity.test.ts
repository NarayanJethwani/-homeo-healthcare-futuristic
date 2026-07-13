import assert from "assert";
import fs from "fs";
import path from "path";
import {
  consumeRepertoryRateLimit,
  MAX_REPERTORIZATION_BODY_BYTES,
  resetRepertoryRateLimitsForTests,
  validateRepertorizationPayload,
  validateRepertorySearchParams,
} from "../src/features/repertory/security/RepertoryApiSecurity";
import { buildRepertoryHealthReport } from "../src/features/repertory/observability/RepertoryHealthService";
import type { RepertoryPublishedCorpusManifest } from "../src/features/repertory/types";

function manifest(overrides: Partial<RepertoryPublishedCorpusManifest> = {}): RepertoryPublishedCorpusManifest {
  return {
    corpusVersion: "v1.0.0",
    generatedAt: "2026-07-13T00:00:00.000Z",
    generatedBy: "test",
    sourceIds: ["kent"],
    sourceVersions: { kent: "v1" },
    totalSources: 1,
    totalChapters: 1,
    totalRubrics: 10,
    totalRemedyEntries: 20,
    totalCanonicalConcepts: 10,
    unresolvedRemedyCount: 0,
    excludedRecordCount: 0,
    sourceChecksums: { kent: "sha256" },
    artifactChecksums: { "manifest.json": "sha256" },
    validationStatus: "passed",
    validationErrors: [],
    publicationStatus: "active",
    ...overrides,
  };
}

async function run() {
  const validSearch = validateRepertorySearchParams(new URLSearchParams("q=fever&page=1&pageSize=20"));
  assert.equal(validSearch.valid, true);
  if (validSearch.valid) assert.equal(validSearch.value.pageSize, 20);
  assert.equal(validateRepertorySearchParams(new URLSearchParams(`q=${"x".repeat(161)}`)).valid, false);
  assert.equal(validateRepertorySearchParams(new URLSearchParams("q=one+two+three+four+five+six")).valid, false);
  assert.equal(validateRepertorySearchParams(new URLSearchParams("page=0")).valid, false);
  assert.equal(validateRepertorySearchParams(new URLSearchParams("pageSize=51")).valid, false);

  const validPayload = validateRepertorizationPayload({
    patientId: "patient-1",
    selectedRubrics: [{ rubricId: "rubric-1", severity: 5, frequency: "frequent", impact: "moderate" }],
  });
  assert.equal(validPayload.valid, true);
  assert.equal(validateRepertorizationPayload({
    patientId: "patient-1",
    userId: "caller-controlled-user",
    selectedRubrics: [{ rubricId: "rubric-1" }],
  }).valid, false);
  assert.equal(validateRepertorizationPayload({
    patientId: "patient-1",
    selectedRubrics: [{ rubricId: "rubric-1", severity: 11 }],
  }).valid, false);
  assert.equal(MAX_REPERTORIZATION_BODY_BYTES, 65_536);

  resetRepertoryRateLimitsForTests();
  assert.equal(consumeRepertoryRateLimit("search", "user-1", { maxRequests: 2, windowMs: 1_000, now: 0 }).allowed, true);
  assert.equal(consumeRepertoryRateLimit("search", "user-1", { maxRequests: 2, windowMs: 1_000, now: 1 }).allowed, true);
  const blocked = consumeRepertoryRateLimit("search", "user-1", { maxRequests: 2, windowMs: 1_000, now: 2 });
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.retryAfterSeconds, 1);
  assert.equal(consumeRepertoryRateLimit("search", "user-1", { maxRequests: 2, windowMs: 1_000, now: 1_001 }).allowed, true);

  const healthy = buildRepertoryHealthReport({
    storageAdapter: "object-storage",
    activeVersion: "v1.0.0",
    manifest: manifest(),
    sampleIndex: { fever: ["rubric-1"] },
  });
  assert.equal(healthy.success, true);
  assert.equal(healthy.manifest?.artifactChecksumCount, 1);
  assert.equal(buildRepertoryHealthReport({
    storageAdapter: "local-readonly",
    activeVersion: "v1.0.0",
    manifest: manifest(),
    sampleIndex: {},
  }).success, false);
  assert.equal(buildRepertoryHealthReport({
    storageAdapter: "object-storage",
    activeVersion: "v1.0.1",
    manifest: manifest(),
    sampleIndex: {},
  }).success, false);

  const root = path.join(process.cwd(), "src", "app", "api", "repertory");
  const searchSource = fs.readFileSync(path.join(root, "search", "route.ts"), "utf8");
  const repertorizeSource = fs.readFileSync(path.join(root, "repertorize", "route.ts"), "utf8");
  for (const source of [searchSource, repertorizeSource]) {
    const authPosition = source.indexOf("await authorizeRepertoryRequest");
    const rateLimitPosition = source.indexOf("const rateLimit = consumeRepertoryRateLimit");
    assert.ok(authPosition >= 0 && rateLimitPosition > authPosition, "Authorization must precede rate limiting");
    assert.ok(!source.includes("repertoryDoctorEntitlementsEnabled"));
  }
  assert.ok(repertorizeSource.includes("const effectiveUserId = auth.session.uid"));
  assert.ok(!repertorizeSource.includes("authenticatedUserId || userId"));

  const healthSource = fs.readFileSync(
    path.join(process.cwd(), "src", "app", "api", "admin", "observability", "repertory-health", "route.ts"),
    "utf8"
  );
  assert.ok(healthSource.includes('authorizeRequest(request, "OBSERVABILITY_VIEW"'));
  assert.ok(healthSource.includes('loadLexicalShard("fever")'));
  assert.ok(healthSource.includes('"Cache-Control": "private, no-store"'));

  console.log("Repertory API security and health tests passed.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
