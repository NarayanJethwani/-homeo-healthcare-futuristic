import assert from "assert";
import fs from "fs";
import path from "path";
import { SulphurRemedy } from "../src/features/knowledge/content/remedies/sulphur";
import { NuxVomicaRemedy } from "../src/features/knowledge/content/remedies/nux-vomica";
import {
  SULPHUR_NUX_VOMICA_GRAPH_PROPOSALS,
  buildSulphurNuxVomicaAuthorizationPacket,
} from "../src/features/knowledge/expansion/sulphurNuxVomicaFlagshipPackage";

export function runSulphurNuxVomicaFlagshipPackageTest(): void {
  // 1. Verify entity versions and review status
  assert.strictEqual(SulphurRemedy.versionInfo?.version, "1.1.0");
  assert.strictEqual(SulphurRemedy.reviewStatus, "owner-authorized-source-bound");
  assert.strictEqual(NuxVomicaRemedy.versionInfo?.version, "1.1.0");
  assert.strictEqual(NuxVomicaRemedy.reviewStatus, "owner-authorized-source-bound");

  // 2. Verify passage-level claim citations
  assert.ok(Array.isArray(SulphurRemedy.claimCitations));
  assert.strictEqual(SulphurRemedy.claimCitations?.length, 5);
  assert.ok(Array.isArray(NuxVomicaRemedy.claimCitations));
  assert.strictEqual(NuxVomicaRemedy.claimCitations?.length, 5);

  // 3. Verify emergency red flags
  assert.ok(Array.isArray(SulphurRemedy.redFlags));
  assert.ok(SulphurRemedy.redFlags!.length >= 1);
  assert.ok(Array.isArray(NuxVomicaRemedy.redFlags));
  assert.ok(NuxVomicaRemedy.redFlags!.length >= 1);

  // 4. Verify 10 graph edge proposals
  assert.strictEqual(SULPHUR_NUX_VOMICA_GRAPH_PROPOSALS.length, 10);
  for (const prop of SULPHUR_NUX_VOMICA_GRAPH_PROPOSALS) {
    assert.strictEqual(prop.status, "draft");
    assert.strictEqual(prop.publicationEligible, false);
    assert.strictEqual(prop.ragEligible, false);
    assert.ok(prop.citationIds.length > 0);
  }

  // 5. Generate and verify authorization packet
  const packet = buildSulphurNuxVomicaAuthorizationPacket();
  assert.strictEqual(packet.packageId, "KEP-M2-SULPHUR-NUX-VOMICA");
  assert.strictEqual(packet.invariants.productionRagActivation, false);
  assert.strictEqual(packet.invariants.publicationEligible, false);
  assert.strictEqual(packet.invariants.draftOnly, true);
  assert.strictEqual(packet.invariants.allClaimsCitationMapped, true);
  assert.strictEqual(packet.invariants.prohibitedCureClaimsCount, 0);
  assert.strictEqual(packet.invariants.unsafeTreatmentReplacementClaimsCount, 0);

  // Save authorization packet to reports/
  const reportsDir = path.resolve(__dirname, "../reports");
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(reportsDir, "knowledge-m2-sulphur-nux-vomica-authorization.json"),
    JSON.stringify(packet, null, 2),
    "utf8"
  );

  console.log(
    "✅ Sulphur + Nux Vomica source-bound content, claim provenance, strychnine safety warnings, governed graph proposals, and authorization packet verified."
  );
}

if (require.main === module) {
  runSulphurNuxVomicaFlagshipPackageTest();
}
