import assert from "assert";
import fs from "fs";
import path from "path";
import { CbcLabTest } from "../src/features/knowledge/content/lab-tests/cbc";
import { TshLabTest } from "../src/features/knowledge/content/lab-tests/tsh";
import {
  buildCBCTSHAuthorizationPacket,
  CBC_TSH_RELATIONSHIP_PROPOSALS,
} from "../src/features/knowledge/expansion/cbcTshFlagshipPackage";

export function runCBCTSHFlagshipPackageTest(): void {
  // 1. Verify entity versions
  assert.strictEqual(CbcLabTest.versionInfo.version, "1.1.0");
  assert.strictEqual(TshLabTest.versionInfo.version, "1.1.0");

  // 2. Verify review status and completeness
  assert.strictEqual(CbcLabTest.reviewStatus, "owner-authorized-source-bound");
  assert.strictEqual(TshLabTest.reviewStatus, "owner-authorized-source-bound");
  assert.strictEqual(CbcLabTest.contentCompleteness, 100);
  assert.strictEqual(TshLabTest.contentCompleteness, 100);

  // 3. Verify claim citations
  assert.ok(
    CbcLabTest.claimCitations && CbcLabTest.claimCitations.length >= 5,
    "CBC must have at least 5 claim citations"
  );
  assert.ok(
    TshLabTest.claimCitations && TshLabTest.claimCitations.length >= 5,
    "TSH must have at least 5 claim citations"
  );

  // 4. Verify emergency red flags
  assert.ok(
    CbcLabTest.redFlags && CbcLabTest.redFlags.length >= 3,
    "CBC must have emergency critical panic values"
  );
  assert.ok(
    TshLabTest.redFlags && TshLabTest.redFlags.length >= 3,
    "TSH must have emergency critical panic values"
  );

  // 5. Verify graph relationship proposals
  assert.strictEqual(
    CBC_TSH_RELATIONSHIP_PROPOSALS.length,
    10,
    "Package must contain exactly 10 draft graph proposals"
  );

  const cbcProposals = CBC_TSH_RELATIONSHIP_PROPOSALS.filter(
    (p) => p.sourceEntityId === "L0001"
  );
  const tshProposals = CBC_TSH_RELATIONSHIP_PROPOSALS.filter(
    (p) => p.sourceEntityId === "L0002"
  );

  assert.strictEqual(cbcProposals.length, 5, "CBC must have 5 graph proposals");
  assert.strictEqual(tshProposals.length, 5, "TSH must have 5 graph proposals");

  for (const proposal of CBC_TSH_RELATIONSHIP_PROPOSALS) {
    assert.strictEqual(proposal.status, "draft");
    assert.strictEqual(proposal.publicationEligible, false);
    assert.strictEqual(proposal.ragEligible, false);
  }

  // 6. Build and verify authorization packet
  const packet = buildCBCTSHAuthorizationPacket();
  assert.strictEqual(packet.packageId, "KEP-M2-CBC-TSH");
  assert.strictEqual(packet.status, "authorized");
  assert.strictEqual(packet.decisionOwnerRole, "program-owner");
  assert.strictEqual(packet.invariants.productionRagActivation, false);
  assert.strictEqual(packet.invariants.draftOnlyGraphEdges, true);

  // 7. Write authorization packet report
  const reportsDir = path.resolve(__dirname, "../reports");
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(reportsDir, "knowledge-m2-cbc-tsh-authorization.json"),
    JSON.stringify(packet, null, 2),
    "utf8"
  );

  console.log(
    "✅ CBC + TSH flagship package test passed: 2 lab test entities upgraded to v1.1.0, 10 draft graph proposals, 0 production RAG activation."
  );
}

if (require.main === module) {
  runCBCTSHFlagshipPackageTest();
}
