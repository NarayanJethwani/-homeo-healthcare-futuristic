import assert from "assert";
import { createClinicalRepertoryService } from "../clinicalWorkspace/clinicalRepertoryService";
import { CLINICAL_WORKSPACE_SAFETY_NOTICE } from "../clinicalWorkspace/types";
import { CLINICAL_REPERTORY_WORKSPACE_SECTIONS } from "../clinicalWorkspace/workspaceModel";

assert.strictEqual(CLINICAL_REPERTORY_WORKSPACE_SECTIONS[0].id, "intake");
assert.strictEqual(CLINICAL_REPERTORY_WORKSPACE_SECTIONS.at(-1)?.id, "final_review");
assert.ok(CLINICAL_REPERTORY_WORKSPACE_SECTIONS.every((section) => section.capabilityIds.length > 0));

const service = createClinicalRepertoryService({
  searchProviders: [
    {
      id: "stable-search",
      capabilityIds: ["rubric_search"],
      search: () => [
        {
          id: "abdomen-flatulence",
          title: "Abdomen; flatulence",
          sourceBadge: "Clinical",
          score: 12,
        },
      ],
    },
    {
      id: "failing-search",
      capabilityIds: ["semantic_search"],
      search: () => {
        throw new Error("simulated provider failure");
      },
    },
  ],
  repertorizationProviders: [
    {
      id: "clinical-ranking",
      capabilityIds: ["repertorization"],
      repertorize: ({ rubricCandidates }) => [
        {
          remedyId: "Lyc",
          remedyName: "Lycopodium",
          rank: 1,
          score: 10,
          confidence: 0.75,
          contributingRubricIds: rubricCandidates.map((rubric) => rubric.id),
          missingRubricIds: [],
          explanation: ["Ranked from selected rubric coverage."],
        },
      ],
    },
  ],
  reasoningProviders: [
    {
      id: "clinical-safety",
      capabilityIds: ["case_validation"],
      reason: () => ({
        clinicalWarnings: ["Clinician verification required."],
        missingInformation: ["Confirm modalities."],
        sourceAttribution: ["Dr. Jethwani clinical repertory"],
      }),
    },
  ],
});

service.analyzeCase({ query: "gas", selectedRubrics: [{ rubricId: "abdomen-flatulence" }] }).then((result) => {
  assert.strictEqual(result.success, true);
  assert.strictEqual(result.safetyNotice, CLINICAL_WORKSPACE_SAFETY_NOTICE);
  assert.strictEqual(result.rubricCandidates.length, 1);
  assert.strictEqual(result.remedyRankings[0].remedyId, "Lyc");
  assert.ok(result.clinicalWarnings.some((warning) => warning.includes("failing-search")));
  assert.ok(result.clinicalWarnings.includes("Clinician verification required."));
  assert.deepStrictEqual(result.missingInformation, ["Confirm modalities."]);
  assert.ok(result.engineTrace.internalProviders.includes("stable-search"));
  assert.ok(result.engineTrace.internalProviders.includes("clinical-ranking"));
  assert.ok(!result.engineTrace.internalProviders.some((provider) => provider.toLowerCase().includes("v1")));
  assert.ok(!result.engineTrace.internalProviders.some((provider) => provider.toLowerCase().includes("v2")));
  console.log("clinicalWorkspaceService.test.ts passed");
});
