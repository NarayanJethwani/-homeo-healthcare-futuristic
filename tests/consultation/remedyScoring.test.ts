import assert from "assert";
import { 
  computeRemedyTotality, 
  computeInputSnapshotHash 
} from "../../src/features/consultation/services/remedyTotalityScorer";
import { 
  SelectedRubric, 
  DEFAULT_SCORING_CONFIGURATION 
} from "../../src/features/consultation/types/repertory-intelligence.types";
import { CanonicalRubricSearchResult } from "../../src/features/consultation/services/repertoryConsultationAdapter";
import {
  getCorpusChapterIds,
  mapPublishedRubric,
  toCorpusSourceId,
} from "../../src/features/consultation/services/repertoryCorpusMapper";
import { RepertoryRubric } from "../../src/features/repertory/types";

async function runRemedyScoringTests() {
  const selectedRubrics: SelectedRubric[] = [
    {
      rubricId: "r1",
      sourceId: "kent",
      rubricPath: ["MIND", "ANXIETY"],
      weight: 1.0,
      characteristic: true, // x1.5 multiplier
      excluded: false,
      pinned: false,
      addedAt: new Date().toISOString(),
      addedBy: "doc",
    },
    {
      rubricId: "r2",
      sourceId: "kent",
      rubricPath: ["STOMACH", "NAUSEA"],
      weight: 1.0,
      characteristic: false,
      excluded: false,
      pinned: false,
      addedAt: new Date().toISOString(),
      addedBy: "doc",
    },
  ];

  const rubricData: CanonicalRubricSearchResult[] = [
    {
      rubricId: "r1",
      sourceId: "kent",
      sourceTitle: "Kent's Repertory",
      chapterName: "MIND",
      rubricPath: ["MIND", "ANXIETY"],
      remedyCount: 2,
      remedies: [
        { remedyId: "arsenicum_album", remedyName: "Arsenicum Album", grade: 3 },
        { remedyId: "pulsatilla", remedyName: "Pulsatilla", grade: 2 },
      ],
    },
    {
      rubricId: "r2",
      sourceId: "kent",
      sourceTitle: "Kent's Repertory",
      chapterName: "STOMACH",
      rubricPath: ["STOMACH", "NAUSEA"],
      remedyCount: 2,
      remedies: [
        { remedyId: "arsenicum_album", remedyName: "Arsenicum Album", grade: 2 },
        { remedyId: "pulsatilla", remedyName: "Pulsatilla", grade: 3 },
      ],
    },
  ];

  // Test 1: Snapshot Hashing
  const hash1 = computeInputSnapshotHash(selectedRubrics, "chilly", "psora");
  const hash2 = computeInputSnapshotHash(selectedRubrics, "chilly", "psora");
  assert.strictEqual(hash1, hash2);
  assert.ok(hash1.startsWith("hash_"));

  // Test 2: Compute Totality Rankings
  const rankings = computeRemedyTotality({
    selectedRubrics,
    rubricData,
    patientThermal: "chilly",
    patientMiasm: "psora",
    config: DEFAULT_SCORING_CONFIGURATION,
    requestSequence: 1,
  });

  assert.ok(rankings.length > 0);
  const topRemedy = rankings[0];

  // Arsenicum Album: r1 grade 3 x 1.5 char = 4.5; r2 grade 2 = 2. Total base = 6.5.
  // Plus thermal chilly bonus. Miasmatic scoring remains neutral until a
  // governed remedy-specific evidence matrix is available.
  assert.strictEqual(topRemedy.remedyId, "arsenicum_album");
  assert.strictEqual(topRemedy.scoreBreakdown.matchedRubricCount, 2);
  assert.ok(topRemedy.scoreBreakdown.finalScore > 0);
  assert.strictEqual(topRemedy.scoreBreakdown.miasmaticAdjustment, 0);

  // Test 3: Excluded Rubric Filter
  const rubricsWithExclusion: SelectedRubric[] = [
    { ...selectedRubrics[0], excluded: true },
    selectedRubrics[1],
  ];

  const rankingsWithExclusion = computeRemedyTotality({
    selectedRubrics: rubricsWithExclusion,
    rubricData,
    patientThermal: "ambithermal",
    config: DEFAULT_SCORING_CONFIGURATION,
  });

  // Only r2 is active; Pulsatilla grade 3 > Arsenicum grade 2
  assert.strictEqual(rankingsWithExclusion[0].remedyId, "pulsatilla");

  // Test 4: Consultation filters map to governed corpus identifiers.
  assert.strictEqual(toCorpusSourceId("kent_repertory_v1"), "kent_1908");
  assert.strictEqual(toCorpusSourceId("boericke_repertory_v1"), "boericke_1927");
  assert.deepStrictEqual(
    getCorpusChapterIds("kent_1908", "MIND"),
    ["Mind (Mental & Emotional)"]
  );

  // Test 5: Published records retain remedy grades when converted for scoring.
  const publishedRubric = {
    rubricId: "kent_mind_test_fear",
    sourceId: "kent_1908",
    source: "Kent Repertory",
    chapterId: "Mind (Mental & Emotional)",
    organSystem: "Mind (Mental & Emotional)",
    title: "fear, with",
    hierarchyPath: ["Mind (Mental & Emotional)", "FEAR"],
    relatedRemedies: [
      {
        remedyId: "Ars",
        remedyName: "Arsenicum Album",
        grade: 3,
      },
    ],
  } as RepertoryRubric;
  const mappedRubric = mapPublishedRubric(publishedRubric);
  assert.strictEqual(mappedRubric.sourceId, "kent_repertory_v1");
  assert.deepStrictEqual(mappedRubric.rubricPath, ["Mind (Mental & Emotional)", "FEAR", "fear, with"]);
  assert.deepStrictEqual(mappedRubric.remedies, [
    { remedyId: "arsenicum_album", remedyName: "Arsenicum Album", grade: 3 },
  ]);

  const publishedRanking = computeRemedyTotality({
    selectedRubrics: [
      {
        rubricId: mappedRubric.rubricId,
        sourceId: mappedRubric.sourceId,
        rubricPath: mappedRubric.rubricPath,
        weight: 1,
        characteristic: false,
        excluded: false,
        pinned: false,
        addedAt: new Date().toISOString(),
        addedBy: "doc",
      },
    ],
    rubricData: [mappedRubric],
    patientThermal: "ambithermal",
  });
  assert.strictEqual(publishedRanking[0].remedyId, "arsenicum_album");

  console.log("✅ Remedy Totality Scoring unit tests passed.");
}

runRemedyScoringTests();
