/**
 * Deterministic Remedy Totality Scorer
 * Pure, versioned scoring engine implementing RepertoryScoringConfiguration.
 */

import {
  SelectedRubric,
  RepertoryScoringConfiguration,
  DEFAULT_SCORING_CONFIGURATION,
  RankedRemedyResult,
  RepertoryProvenance,
  RemedyScoreBreakdown,
  RemedyAnalysisMetadata,
} from "../types/repertory-intelligence.types";
import { CanonicalRubricSearchResult } from "./repertoryConsultationAdapter";

export interface TotalityScoringOptions {
  selectedRubrics: SelectedRubric[];
  rubricData: CanonicalRubricSearchResult[];
  patientThermal?: "chilly" | "warm" | "ambithermal";
  patientMiasm?: string;
  config?: RepertoryScoringConfiguration;
  requestSequence?: number;
}

export function computeInputSnapshotHash(rubrics: SelectedRubric[], thermal?: string, miasm?: string): string {
  const sortedKeys = rubrics
    .filter((r) => !r.excluded)
    .map((r) => `${r.rubricId}:${r.weight}:${r.characteristic ? "char" : "norm"}`)
    .sort()
    .join("|");

  const combined = `${sortedKeys}::thermal=${thermal || "none"}::miasm=${miasm || "none"}`;

  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `hash_${Math.abs(hash).toString(36)}`;
}

export function computeRemedyTotality(options: TotalityScoringOptions): RankedRemedyResult[] {
  const config = options.config || DEFAULT_SCORING_CONFIGURATION;
  const activeRubrics = options.selectedRubrics.filter((r) => !r.excluded);
  const sequence = options.requestSequence || 1;
  const snapshotHash = computeInputSnapshotHash(activeRubrics, options.patientThermal, options.patientMiasm);
  const now = new Date().toISOString();

  if (activeRubrics.length === 0) {
    return [];
  }

  // Map remedyId -> accumulated metrics
  const remedyMap = new Map<
    string,
    {
      remedyName: string;
      rubricScore: number;
      characteristicAdjustment: number;
      thermalAdjustment: number;
      miasmaticAdjustment: number;
      matchedRubrics: Set<string>;
      provenanceList: RepertoryProvenance[];
    }
  >();

  const rubricDataMap = new Map<string, CanonicalRubricSearchResult>();
  for (const rd of options.rubricData) {
    rubricDataMap.set(rd.rubricId, rd);
  }

  for (const sr of activeRubrics) {
    const canonicalData = rubricDataMap.get(sr.rubricId);
    if (!canonicalData) continue;

    for (const rem of canonicalData.remedies) {
      const remId = rem.remedyId.toLowerCase();
      let entry = remedyMap.get(remId);

      if (!entry) {
        entry = {
          remedyName: rem.remedyName,
          rubricScore: 0,
          characteristicAdjustment: 0,
          thermalAdjustment: 0,
          miasmaticAdjustment: 0,
          matchedRubrics: new Set<string>(),
          provenanceList: [],
        };
        remedyMap.set(remId, entry);
      }

      // Base grade score from versioned configuration
      const baseGradeScore = config.gradeWeights[rem.grade] || rem.grade;
      let rubricPoints = baseGradeScore * sr.weight;

      // Characteristic multiplier
      if (sr.characteristic) {
        const extraChar = rubricPoints * (config.characteristicMultiplier - 1.0);
        entry.characteristicAdjustment += extraChar;
        rubricPoints *= config.characteristicMultiplier;
      }

      entry.rubricScore += rubricPoints;
      entry.matchedRubrics.add(sr.rubricId);

      entry.provenanceList.push({
        sourceId: canonicalData.sourceId,
        sourceTitle: canonicalData.sourceTitle,
        chapterId: canonicalData.chapterName,
        rubricId: canonicalData.rubricId,
        rubricPath: canonicalData.rubricPath,
        remedyGrade: rem.grade,
        repertoryVersion: config.algorithmVersion,
        retrievedAt: now,
      });
    }
  }

  // Calculate thermal and miasmatic adjustments
  const results: RankedRemedyResult[] = [];

  for (const [remedyId, entry] of remedyMap.entries()) {
    let thermalBonus = 0;
    let miasmaticBonus = 0;

    // Thermal alignment adjustment
    if (options.patientThermal && options.patientThermal !== "ambithermal") {
      const isChillyRemedy = ["arsenicum_album", "nux_vomica", "hepary_sulfur"].includes(remedyId);
      const isWarmRemedy = ["pulsatilla", "sulfur", "iodum"].includes(remedyId);

      if (
        (options.patientThermal === "chilly" && isChillyRemedy) ||
        (options.patientThermal === "warm" && isWarmRemedy)
      ) {
        thermalBonus = entry.rubricScore * config.thermalAlignmentWeight;
      }
    }

    // Miasmatic alignment adjustment
    if (options.patientMiasm) {
      miasmaticBonus = entry.rubricScore * config.miasmaticAlignmentWeight;
    }

    entry.thermalAdjustment = thermalBonus;
    entry.miasmaticAdjustment = miasmaticBonus;

    const finalScore = Number(
      (entry.rubricScore + thermalBonus + miasmaticBonus).toFixed(2)
    );

    const scoreBreakdown: RemedyScoreBreakdown = {
      rubricScore: Number(entry.rubricScore.toFixed(2)),
      characteristicAdjustment: Number(entry.characteristicAdjustment.toFixed(2)),
      thermalAdjustment: Number(thermalBonus.toFixed(2)),
      miasmaticAdjustment: Number(miasmaticBonus.toFixed(2)),
      matchedRubricCount: entry.matchedRubrics.size,
      totalSelectedRubrics: activeRubrics.length,
      finalScore,
    };

    const metadata: RemedyAnalysisMetadata = {
      algorithmVersion: config.algorithmVersion,
      scoringConfigurationVersion: config.scoringConfigurationVersion,
      repertoryVersion: "kent_v1_canonical",
      inputSnapshotHash: snapshotHash,
      generatedAt: now,
      requestSequence: sequence,
      isStale: false,
    };

    results.push({
      remedyId,
      remedyName: entry.remedyName,
      scoreBreakdown,
      provenanceList: entry.provenanceList,
      metadata,
    });
  }

  // Deterministic Sorting & Tie-Breaking
  results.sort((a, b) => {
    if (b.scoreBreakdown.finalScore !== a.scoreBreakdown.finalScore) {
      return b.scoreBreakdown.finalScore - a.scoreBreakdown.finalScore;
    }

    if (config.tieBreakStrategy === "symptom_coverage") {
      if (b.scoreBreakdown.matchedRubricCount !== a.scoreBreakdown.matchedRubricCount) {
        return b.scoreBreakdown.matchedRubricCount - a.scoreBreakdown.matchedRubricCount;
      }
    }

    if (config.tieBreakStrategy === "grade_sum" || config.tieBreakStrategy === "symptom_coverage") {
      if (b.scoreBreakdown.rubricScore !== a.scoreBreakdown.rubricScore) {
        return b.scoreBreakdown.rubricScore - a.scoreBreakdown.rubricScore;
      }
    }

    return a.remedyName.localeCompare(b.remedyName);
  });

  return results;
}
