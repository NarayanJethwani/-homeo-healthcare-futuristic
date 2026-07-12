import assert from "assert";
import { RepertoryAccessPolicy } from "../../src/features/repertory/access/RepertoryAccessPolicy";
import {
  RepertorySource,
  RepertoryEdition,
  RepertoryAccessContext,
  RepertorySourceId,
  RepertoryEditionId
} from "../../src/features/repertory/types/repertoryTypes";

export function runAccessPolicyTests() {
  console.log("▶ Running Repertory Access Policy Tests...");
  const policy = new RepertoryAccessPolicy();

  const mockSource: RepertorySource = {
    id: "kent" as RepertorySourceId,
    displayName: "Kent's Repertory",
    shortName: "Kent",
    author: "J. T. Kent",
    originalLanguage: "en",
    sourceType: "classical"
  };

  const mockEdition = (rights: any, pubStatus: any): RepertoryEdition => ({
    id: "kent_1908" as RepertoryEditionId,
    sourceId: "kent" as RepertorySourceId,
    editionName: "Kent 1908",
    publicationYear: 1908,
    language: "en",
    rightsStatus: rights,
    publicationStatus: pubStatus,
    citationFormat: "Kent p. [Page]",
    corpusVersion: "v1.0.0"
  });

  const mockContext = (role: string, entitlements: string[], flags: string[]): RepertoryAccessContext => ({
    userId: "test-user",
    userRole: role,
    organizationEntitlements: entitlements.map(id => ({
      editionId: id as RepertoryEditionId,
      organizationId: "org-default",
      entitlementType: "licensed",
      status: "active"
    })),
    activeFeatureFlags: flags
  });

  // 1. Public Domain
  const publicEd = mockEdition("public_domain", "active");
  const ordinaryCtx = mockContext("practitioner", [], []);
  assert.strictEqual(policy.canReadContent(ordinaryCtx, publicEd).allowed, true);

  // 2. Licensed
  const licensedEd = mockEdition("licensed", "active");
  assert.strictEqual(policy.canReadContent(ordinaryCtx, licensedEd).allowed, false);
  assert.strictEqual(policy.canReadContent(ordinaryCtx, licensedEd).reason, "not_entitled");

  const entitledCtx = mockContext("practitioner", ["kent_1908"], []);
  assert.strictEqual(policy.canReadContent(entitledCtx, licensedEd).allowed, true);

  // 3. Internal
  const internalEd = mockEdition("internal", "active");
  assert.strictEqual(policy.canReadContent(ordinaryCtx, internalEd).allowed, false);
  assert.strictEqual(policy.canReadContent(ordinaryCtx, internalEd).reason, "internal_only");

  const adminCtx = mockContext("admin", [], []);
  assert.strictEqual(policy.canReadContent(adminCtx, internalEd).allowed, true);

  // 4. Experimental
  const experimentalEd = mockEdition("experimental", "active");
  assert.strictEqual(policy.canReadContent(ordinaryCtx, experimentalEd).allowed, false);
  assert.strictEqual(policy.canReadContent(ordinaryCtx, experimentalEd).reason, "feature_disabled");

  const flagCtx = mockContext("practitioner", [], ["repertory-experimental"]);
  assert.strictEqual(policy.canReadContent(flagCtx, experimentalEd).allowed, true);

  // 5. Restricted
  const restrictedEd = mockEdition("restricted", "active");
  assert.strictEqual(policy.canReadContent(ordinaryCtx, restrictedEd).allowed, false);
  assert.strictEqual(policy.canReadContent(ordinaryCtx, restrictedEd).reason, "restricted");

  // 6. Disabled
  const disabledEd = mockEdition("disabled", "active");
  assert.strictEqual(policy.canReadContent(ordinaryCtx, disabledEd).allowed, false);
  assert.strictEqual(policy.canReadContent(ordinaryCtx, disabledEd).reason, "disabled");

  console.log("✅ Repertory Access Policy Tests Passed");
}
