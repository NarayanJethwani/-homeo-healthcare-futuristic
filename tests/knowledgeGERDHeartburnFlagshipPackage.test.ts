import assert from "assert";
import fs from "fs";
import path from "path";
import { CITATIONS } from "../src/features/knowledge/content/citations";
import { GerdDisease } from "../src/features/knowledge/content/diseases/gerd";
import { HeartburnSymptom } from "../src/features/knowledge/content/symptoms/heartburn";
import {
  buildGERDHeartburnAuthorizationPacket,
  GERD_HEARTBURN_RELATIONSHIP_PROPOSALS,
} from "../src/features/knowledge/expansion/gerdHeartburnFlagshipPackage";
import { RELATIONSHIP_REGISTRY } from "../src/features/knowledge/graph/relationshipRegistry";

const PROHIBITED_TEMPLATE_OR_EFFICACY_PATTERNS = [
  /rome iv/i,
  /altered stool consistency/i,
  /low-fodmap/i,
  /microbial dysbiosis/i,
  /yes, individualized homeopathy can help/i,
  /resolves chronic dependency/i,
  /functional digestive dish harmony/i,
];

export function runKnowledgeGERDHeartburnFlagshipPackageTests(): void {
  const entities = [GerdDisease, HeartburnSymptom];
  const citationById = new Map(
    CITATIONS.map((citation) => [citation.id, citation])
  );
  const packet = buildGERDHeartburnAuthorizationPacket();
  const committedPacket = JSON.parse(
    fs.readFileSync(
      path.resolve(
        __dirname,
        "../reports/knowledge-m2-gerd-heartburn-authorization.json"
      ),
      "utf8"
    )
  );

  assert.deepStrictEqual(committedPacket, packet);
  assert.strictEqual(packet.status, "final-authorization-pending");
  assert.strictEqual(packet.releaseDecision.approved, false);
  assert.strictEqual(packet.invariants.automaticApprovalForbidden, true);
  assert.strictEqual(packet.invariants.finalDecisionMustBeHuman, true);
  assert.strictEqual(packet.invariants.productionPublicationOnPackageBuild, false);
  assert.strictEqual(packet.invariants.productionRagActivation, false);
  assert.strictEqual(packet.invariants.frozenDomainMutationCount, 0);
  assert.match(packet.packageHash, /^[a-f0-9]{64}$/);
  assert.deepStrictEqual(
    buildGERDHeartburnAuthorizationPacket(),
    packet,
    "The revision-bound authorization packet must be deterministic"
  );

  for (const entity of entities) {
    assert.strictEqual(entity.versionInfo.version, "1.1.0");
    assert.strictEqual(entity.contentCompleteness, 100);
    assert.strictEqual(entity.citationHealth, "complete");
    assert.strictEqual(entity.evidenceProfile?.citationCompleteness, 1);
    assert.strictEqual(entity.editorialStatus, "published");
    assert.strictEqual(entity.legacyVerificationStatus, "review-required");
    assert.strictEqual(
      entity.reviewStatus,
      "owner-final-authorization-pending"
    );

    const serialized = JSON.stringify(entity);
    for (const prohibited of PROHIBITED_TEMPLATE_OR_EFFICACY_PATTERNS) {
      assert.doesNotMatch(
        serialized,
        prohibited,
        `${entity.id} retains prohibited generic or efficacy wording`
      );
    }

    const referenceIds = new Set(entity.content.references as string[]);
    assert.deepStrictEqual(
      [...referenceIds].sort(),
      ["CIT-0017", "CIT-0023", "CIT-0025", "CIT-0036"]
    );
    for (const referenceId of referenceIds) {
      const citation = citationById.get(referenceId);
      assert.ok(citation, `${entity.id} has unresolved citation ${referenceId}`);
      assert.strictEqual(citation?.verificationStatus, "verified");
      assert.ok(citation?.sourceIdentifier);
    }

    const claimCitations = entity.content.claimCitations as Array<{
      claimId: string;
      passage: string;
      citationIds: string[];
    }>;
    assert.ok(claimCitations.length >= 6);
    assert.strictEqual(
      new Set(claimCitations.map((claim) => claim.claimId)).size,
      claimCitations.length
    );
    for (const claim of claimCitations) {
      assert.ok(claim.passage.length > 0);
      assert.ok(claim.citationIds.length > 0);
      assert.ok(
        claim.citationIds.every((citationId) => referenceIds.has(citationId))
      );
    }

    const relationshipProposals = GERD_HEARTBURN_RELATIONSHIP_PROPOSALS.filter(
      (proposal) => proposal.sourceEntityId === entity.id
    );
    assert.ok(relationshipProposals.length >= 5);
    assert.ok(relationshipProposals.length <= 10);
    assert.ok(
      relationshipProposals.every(
        (proposal) =>
          proposal.status === "draft" &&
          proposal.publicationEligible === false &&
          proposal.ragEligible === false &&
          proposal.sourceRevision === "1.1.0"
      )
    );
  }

  assert.strictEqual(GerdDisease.content.labTests.length, 0);
  assert.match(
    GerdDisease.content.homeopathicApproach,
    /Reliable evidence has not established homeopathy/i
  );
  assert.match(
    HeartburnSymptom.content.differentialDiagnosis,
    /cardiac ischemia/i
  );
  assert.match(
    HeartburnSymptom.content.redFlags.join(" "),
    /seek emergency assessment/i
  );

  const proposalIds = GERD_HEARTBURN_RELATIONSHIP_PROPOSALS.map(
    (proposal) => proposal.proposalId
  );
  assert.strictEqual(new Set(proposalIds).size, proposalIds.length);
  const semanticKeys = GERD_HEARTBURN_RELATIONSHIP_PROPOSALS.map(
    (proposal) =>
      `${proposal.sourceEntityId}|${proposal.relationshipType}|${proposal.targetId}`
  );
  assert.strictEqual(new Set(semanticKeys).size, semanticKeys.length);

  for (const proposal of GERD_HEARTBURN_RELATIONSHIP_PROPOSALS) {
    const definition = RELATIONSHIP_REGISTRY[proposal.relationshipType];
    assert.ok(definition);
    assert.ok(definition.allowedSourceTypes.includes(proposal.sourceNodeType));
    assert.ok(definition.allowedTargetTypes.includes(proposal.targetNodeType));
    assert.strictEqual(
      proposal.clinicalReviewRequired,
      definition.requiresClinicalReview
    );
    assert.ok(
      proposal.citationIds.every(
        (citationId) =>
          citationById.get(citationId)?.verificationStatus === "verified"
      )
    );
  }

  console.log(
    "✅ GERD + Heartburn source-bound content, claim provenance, governed graph proposals, and human final-authorization boundary verified."
  );
}

if (require.main === module) {
  runKnowledgeGERDHeartburnFlagshipPackageTests();
}
