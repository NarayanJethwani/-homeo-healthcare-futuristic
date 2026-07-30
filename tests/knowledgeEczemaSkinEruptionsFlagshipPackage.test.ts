import assert from "assert";
import fs from "fs";
import path from "path";
import { CITATIONS } from "../src/features/knowledge/content/citations";
import { EczemaDisease } from "../src/features/knowledge/content/diseases/eczema";
import { SkinEruptionsSymptom } from "../src/features/knowledge/content/symptoms/skin-eruptions";
import {
  buildEczemaSkinEruptionsAuthorizationPacket,
  ECZEMA_SKIN_ERUPTIONS_RELATIONSHIP_PROPOSALS,
} from "../src/features/knowledge/expansion/eczemaSkinEruptionsFlagshipPackage";

const PROHIBITED_PATTERNS = [
  /homeopathy cures eczema/i,
  /replaces topical steroids/i,
  /functional digestive dish harmony/i,
  /rome iv/i,
  /microbial dysbiosis/i,
];

export function runKnowledgeEczemaSkinEruptionsFlagshipPackageTests(): void {
  const entities = [EczemaDisease, SkinEruptionsSymptom];
  const citationById = new Map(CITATIONS.map((c) => [c.id, c]));
  const packet = buildEczemaSkinEruptionsAuthorizationPacket();

  assert.strictEqual(packet.status, "authorized");
  assert.strictEqual(packet.releaseDecision.approved, true);
  assert.strictEqual(packet.releaseDecision.approvedBy, "Dr. Narayan Jethwani");
  assert.strictEqual(packet.invariants.automaticApprovalForbidden, true);
  assert.strictEqual(packet.invariants.finalDecisionMustBeHuman, true);
  assert.strictEqual(packet.invariants.productionPublicationOnPackageBuild, false);
  assert.strictEqual(packet.invariants.productionRagActivation, false);
  assert.strictEqual(packet.invariants.frozenDomainMutationCount, 0);
  assert.match(packet.packageHash, /^[a-f0-9]{64}$/);

  for (const entity of entities) {
    assert.strictEqual(entity.versionInfo.version, "1.1.0");
    assert.strictEqual(entity.contentCompleteness, 100);
    assert.strictEqual(entity.citationHealth, "complete");
    assert.strictEqual(entity.editorialStatus, "published");
    assert.strictEqual(entity.reviewStatus, "owner-authorized-source-bound");

    const serialized = JSON.stringify(entity);
    for (const prohibited of PROHIBITED_PATTERNS) {
      assert.doesNotMatch(
        serialized,
        prohibited,
        `${entity.id} retains prohibited generic or efficacy wording`
      );
    }

    const referenceIds = new Set(entity.content.references as string[]);
    for (const refId of referenceIds) {
      const citation = citationById.get(refId);
      assert.ok(citation, `${entity.id} has unresolved citation ${refId}`);
      assert.ok(
        citation?.verificationStatus === "verified" ||
          citation?.verificationStatus === "internal-only"
      );
    }

    const claimCitations = entity.content.claimCitations as Array<{
      claimId: string;
      passage: string;
      citationIds: string[];
    }>;
    assert.ok(claimCitations.length >= 6);
    for (const claim of claimCitations) {
      assert.ok(claim.passage.length > 0);
      assert.ok(claim.citationIds.length > 0);
      assert.ok(claim.citationIds.every((id) => referenceIds.has(id)));
    }
  }

  assert.match(
    EczemaDisease.content.homeopathicApproach,
    /Reliable clinical evidence has not established homeopathy/i
  );
  assert.match(
    SkinEruptionsSymptom.content.redFlags.join(" "),
    /Stevens-Johnson syndrome|erythroderma/i
  );

  for (const proposal of ECZEMA_SKIN_ERUPTIONS_RELATIONSHIP_PROPOSALS) {
    assert.strictEqual(proposal.status, "draft");
    assert.strictEqual(proposal.publicationEligible, false);
    assert.strictEqual(proposal.ragEligible, false);
    assert.strictEqual(proposal.sourceRevision, "1.1.0");
    assert.ok(
      proposal.citationIds.every((id) => citationById.has(id)),
      `Proposal ${proposal.proposalId} has invalid citation`
    );
  }

  const reportsDir = path.resolve(__dirname, "../reports");
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(reportsDir, "knowledge-m2-eczema-skin-eruptions-authorization.json"),
    JSON.stringify(packet, null, 2),
    "utf8"
  );

  console.log(
    "✅ Eczema + Skin Eruptions source-bound content, claim provenance, governed graph proposals, and human final-authorization boundary verified."
  );
}

if (require.main === module) {
  runKnowledgeEczemaSkinEruptionsFlagshipPackageTests();
}
