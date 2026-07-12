import assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { getRuntimeEnvironment } from '../src/features/repertory/config/runtimeEnv';
import { RepertoryScoring } from '../src/features/repertory/scoring/repertoryScoring';
import { CLARKE_REMEDY_MAP } from '../src/features/repertory/import-export/ingestionPipeline';
import { REMEDIES_METADATA } from '../src/lib/repertoryData';
import { resolveCanonicalRemedyId } from '../src/lib/normalizationEngine';

async function run() {
  console.log("🚀 Running Clarke Repertory Safety & Isolation Tests...");
  let passed = 0;

  // 1. Environment isolation validation
  const env = getRuntimeEnvironment();
  console.log(`Current environment mode: ${env.mode}`);
  assert.ok(env.mode === 'test' || env.mode === 'development' || env.mode === 'production' || env.mode === 'emulator', "Should resolve to a valid environment mode.");
  assert.ok(env.artifactRoot, "Environment must define an artifact root.");
  passed++;

  // 2. Exclude scoring validation
  // Let's call calculateRepertorization with a Clarke rubric and a Kent rubric to assert Clarke's zero numerical influence.
  const clarkeRubricId = "clarke_clinical_1904_rubric_2"; // Abdomen - Coldness in
  
  const scoringResult = await RepertoryScoring.calculateRepertorization([
    {
      rubricId: clarkeRubricId,
      severity: 5,
      frequency: 'frequent',
      impact: 'moderate'
    }
  ]);

  // Assert that Clarke rubric does not contribute to scoring
  assert.ok(scoringResult.nonScoringRubrics, "Should contain nonScoringRubrics array.");
  const nonScored = scoringResult.nonScoringRubrics.find(r => r.rubricId === clarkeRubricId);
  assert.ok(nonScored, "Clarke rubric must be marked as non-scoring.");
  assert.strictEqual(nonScored.reason, "source-search-only", "Reason must be source-search-only.");
  assert.strictEqual(nonScored.sourceId, "clarke_clinical_1904", "Source ID must match clarke.");
  
  // Assert warning code is returned
  assert.ok(scoringResult.warnings, "Should contain warnings.");
  const clarkeWarn = scoringResult.warnings.find(w => w.code === "CLARKE_SCORING_DISABLED_UNVERIFIED_GRADES");
  assert.ok(clarkeWarn, "Must return CLARKE_SCORING_DISABLED_UNVERIFIED_GRADES warning.");
  
  // Assert topRemedies is empty because the only rubric was non-scoring
  assert.strictEqual(scoringResult.topRemedies.length, 0, "No remedies should be scored from Clarke.");
  passed++;

  // 3. Mapping Safety: Duplicate source keys audit
  const pipelineCode = fs.readFileSync(path.join(process.cwd(), 'src', 'features', 'repertory', 'import-export', 'ingestionPipeline.ts'), 'utf-8');
  const mapMatch = pipelineCode.match(/export const CLARKE_REMEDY_MAP: Record<string, string> = \{([\s\S]*?)\};/)!;
  const mapLines = mapMatch[1].split('\n');
  const rawKeys: string[] = [];
  for (const line of mapLines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const match = trimmed.match(/^"([^"]+)"\s*:/) || trimmed.match(/^'([^']+)'\s*:/) || trimmed.match(/^([a-zA-Z0-9_\-\<\>«\^]+)\s*:/);
    if (match) {
      rawKeys.push(match[1]);
    }
  }
  const duplicateKeys = rawKeys.filter((item, index) => rawKeys.indexOf(item) !== index);
  assert.strictEqual(duplicateKeys.length, 0, `No duplicate keys allowed in CLARKE_REMEDY_MAP source code. Found duplicates: ${duplicateKeys.join(', ')}`);
  passed++;

  // 4. Mapping Safety: Normalized key collisions
  const cleanKey = (k: string) => k.trim().replace(/^[\^\[\(\s]+/, '').replace(/[\]\)\s]+$/, '').replace(/\./g, '').replace(/\s+/g, ' ').toLowerCase();
  const normalizedMap = new Map<string, { original: string; target: string }>();
  for (const [key, target] of Object.entries(CLARKE_REMEDY_MAP)) {
    const norm = cleanKey(key);
    if (normalizedMap.has(norm)) {
      const existing = normalizedMap.get(norm)!;
      assert.strictEqual(target, existing.target, `Normalized key collision: "${key}" and "${existing.original}" normalize to "${norm}" but map to different targets: "${target}" vs "${existing.target}"`);
    } else {
      normalizedMap.set(norm, { original: key, target });
    }
  }
  passed++;

  // 5. Mapping Safety: Mapped target validation
  const packPath = path.join(process.cwd(), 'src', 'lib', 'remedyDataPack.json');
  const pack = JSON.parse(fs.readFileSync(packPath, 'utf-8'));
  const packAbbrs = new Set<string>();
  const idToAbbr = new Map<string, string>();
  pack.forEach((r: any) => {
    if (r.abbr) {
      const abbrClean = r.abbr.trim();
      packAbbrs.add(abbrClean);
      if (r.id) idToAbbr.set(r.id, abbrClean);
    }
  });
  for (const id of Object.keys(REMEDIES_METADATA)) {
    idToAbbr.set(id, id);
  }

  let resolvedCount = 0;
  let totalCount = 0;
  for (const target of Object.values(CLARKE_REMEDY_MAP)) {
    totalCount++;
    const normalized = target
      .replace(/Æ/g, 'Ae')
      .replace(/æ/g, 'ae')
      .replace(/Œ/g, 'Oe')
      .replace(/œ/g, 'oe')
      .replace(/[\.\s_-]/g, ' ')
      .trim();

    let isValid = !!REMEDIES_METADATA[target] || packAbbrs.has(target);
    if (!isValid) {
      const canonicalId = resolveCanonicalRemedyId(normalized);
      if (idToAbbr.has(canonicalId)) {
        isValid = true;
      } else {
        const lower = normalized.toLowerCase();
        for (const id of idToAbbr.keys()) {
          if (id.replace('rem_', '').replace(/_/g, '') === lower.replace(/ /g, '')) {
            isValid = true;
            break;
          }
        }
      }
    }
    if (isValid) {
      resolvedCount++;
    }
  }
  
  const resolutionRate = (resolvedCount / totalCount) * 100;
  console.log(`Clarke Remedy Map overall target resolution rate: ${resolutionRate.toFixed(2)}% (${resolvedCount}/${totalCount})`);
  assert.ok(resolutionRate >= 98.0, "Resolution rate of mapping targets must be at least 98.0% (allowing minor expected unresolved exceptions).");
  passed++;

  // Helper to assert that two objects are recursively equal on all numerical, string, and boolean properties,
  // excluding warning and metadata properties that are allowed to differ.
  function assertObjectsEqualNumerical(a: any, b: any, path = '') {
    if (typeof a !== typeof b) {
      throw new Error(`Type mismatch at ${path}: ${typeof a} vs ${typeof b}`);
    }
    if (a === null || b === null || typeof a !== 'object') {
      if (typeof a === 'number') {
        assert.strictEqual(a, b, `Numerical value mismatch at ${path}: ${a} vs ${b}`);
      } else if (typeof a === 'boolean' || typeof a === 'string') {
        assert.strictEqual(a, b, `Value mismatch at ${path}: ${a} vs ${b}`);
      }
      return;
    }
    if (Array.isArray(a)) {
      assert.ok(Array.isArray(b), `Expected array at ${path}`);
      assert.strictEqual(a.length, b.length, `Array length mismatch at ${path}: ${a.length} vs ${b.length}`);
      for (let i = 0; i < a.length; i++) {
        assertObjectsEqualNumerical(a[i], b[i], `${path}[${i}]`);
      }
      return;
    }
    for (const key of Object.keys(a)) {
      if (key === 'warnings' || key === 'nonScoringRubrics' || key === 'sourceLabels' || key === 'citationMetadata' || key === 'matchedRubrics') {
        continue;
      }
      if (!(key in b)) {
        throw new Error(`Key ${key} missing in b at ${path}`);
      }
      assertObjectsEqualNumerical(a[key], b[key], `${path}.${key}`);
    }
  }

  // 6. Invariant checks for all baseline combinations
  const clarkeRubricInput = {
    rubricId: clarkeRubricId,
    severity: 5,
    frequency: 'frequent' as const,
    impact: 'moderate' as const
  };

  // Test Case A: Kent vs Kent + Clarke
  const kentRubrics = [
    {
      rubricId: "jeth_rb_adrenal_burnout",
      severity: 3,
      frequency: 'frequent' as const,
      impact: 'moderate' as const
    },
    {
      rubricId: "jeth_rb_panic_death_terror",
      severity: 4,
      frequency: 'frequent' as const,
      impact: 'moderate' as const
    }
  ];
  const scoreKentOnly = await RepertoryScoring.calculateRepertorization(kentRubrics);
  const scoreKentMixed = await RepertoryScoring.calculateRepertorization([...kentRubrics, clarkeRubricInput]);
  assertObjectsEqualNumerical(scoreKentOnly, scoreKentMixed, 'KentBaseline');

  // Test Case B: Boericke vs Boericke + Clarke
  const boerickeRubrics = [
    {
      rubricId: "boericke_1927_rubric_1", // Mind - Panic
      severity: 2,
      frequency: 'frequent' as const,
      impact: 'mild' as const
    }
  ];
  const scoreBoerickeOnly = await RepertoryScoring.calculateRepertorization(boerickeRubrics);
  const scoreBoerickeMixed = await RepertoryScoring.calculateRepertorization([...boerickeRubrics, clarkeRubricInput]);
  assertObjectsEqualNumerical(scoreBoerickeOnly, scoreBoerickeMixed, 'BoerickeBaseline');

  // Test Case C: Kent + Boericke vs Kent + Boericke + Clarke
  const mixedBaseRubrics = [...kentRubrics, ...boerickeRubrics];
  const scoreBaseOnly = await RepertoryScoring.calculateRepertorization(mixedBaseRubrics);
  const scoreBaseMixed = await RepertoryScoring.calculateRepertorization([...mixedBaseRubrics, clarkeRubricInput]);
  assertObjectsEqualNumerical(scoreBaseOnly, scoreBaseMixed, 'MixedBaseline');

  passed++;

  console.log(`✅ All Clarke Repertory Safety & Isolation Tests Passed: ${passed}/6`);
}

run().catch(err => {
  console.error("❌ Clarke Safety & Isolation Test Failed:", err);
  process.exit(1);
});
