import {
  CLINICAL_WORKSPACE_SAFETY_NOTICE,
  ClinicalCapabilityId,
  ClinicalReasoningProvider,
  ClinicalRepertorizationProvider,
  ClinicalRepertoryRequest,
  ClinicalRepertoryResult,
  ClinicalRepertoryService,
  ClinicalRepertoryServiceProviders,
  ClinicalSearchProvider,
  AIIntakeMappingResult,
  RemedyDifferentiation,
  ClinicalValidationFinding,
  ClinicalRubricCandidate,
} from "./types";
import { RepertorySearch } from "../search/repertorySearch";
import { RepertoryScoring } from "../scoring/repertoryScoring";
import { ReasoningEngine } from "../reasoning/reasoningEngine";
import { repertoryRepository } from "../database/repertoryDb";
import { VisitTimelineEntry, LongitudinalCaseSummary } from "./longitudinalTypes";
import { LongitudinalCaseModel } from "./longitudinalModel";

function unique<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

function capabilitiesFromProviders(
  searchProviders: ClinicalSearchProvider[],
  repertorizationProviders: ClinicalRepertorizationProvider[],
  reasoningProviders: ClinicalReasoningProvider[],
): ClinicalCapabilityId[] {
  return unique([
    ...searchProviders.flatMap((provider) => provider.capabilityIds),
    ...repertorizationProviders.flatMap((provider) => provider.capabilityIds),
    ...reasoningProviders.flatMap((provider) => provider.capabilityIds),
  ]);
}

export function createClinicalRepertoryService(
  providers: ClinicalRepertoryServiceProviders = {},
): ClinicalRepertoryService {
  const searchProviders = providers.searchProviders || [];
  const repertorizationProviders = providers.repertorizationProviders || [];
  const reasoningProviders = providers.reasoningProviders || [];

  return {
    async analyzeCase(request: ClinicalRepertoryRequest): Promise<ClinicalRepertoryResult> {
      const startedAt = Date.now();
      const runId = `clinical-repertory-${startedAt}`;
      const clinicalWarnings: string[] = [];
      const internalProviders: string[] = [];

      const rubricCandidateGroups = await Promise.all(
        searchProviders.map(async (provider) => {
          try {
            internalProviders.push(provider.id);
            return await provider.search(request);
          } catch {
            clinicalWarnings.push(`Search provider ${provider.id} failed and was skipped.`);
            return [];
          }
        }),
      );
      const rubricCandidates = rubricCandidateGroups.flat();

      const rankingGroups = await Promise.all(
        repertorizationProviders.map(async (provider) => {
          try {
            internalProviders.push(provider.id);
            return await provider.repertorize({ request, rubricCandidates });
          } catch {
            clinicalWarnings.push(`Repertorization provider ${provider.id} failed and was skipped.`);
            return [];
          }
        }),
      );
      const remedyRankings = rankingGroups.flat().sort((left, right) => left.rank - right.rank);

      const reasoningGroups = await Promise.all(
        reasoningProviders.map(async (provider) => {
          try {
            internalProviders.push(provider.id);
            return await provider.reason({ request, rubricCandidates, remedyRankings });
          } catch {
            clinicalWarnings.push(`Reasoning provider ${provider.id} failed and was skipped.`);
            return {};
          }
        }),
      );

      return {
        success: true,
        runId,
        safetyNotice: CLINICAL_WORKSPACE_SAFETY_NOTICE,
        query: request.query,
        rubricCandidates,
        selectedRubrics: request.selectedRubrics || [],
        remedyRankings,
        differentialAnalysis: reasoningGroups.flatMap((group) => group.differentialAnalysis || []),
        validationFindings: reasoningGroups.flatMap((group) => group.validationFindings || []),
        clinicalWarnings: [
          ...clinicalWarnings,
          ...reasoningGroups.flatMap((group) => group.clinicalWarnings || []),
        ],
        missingInformation: reasoningGroups.flatMap((group) => group.missingInformation || []),
        sourceAttribution: unique(reasoningGroups.flatMap((group) => group.sourceAttribution || [])),
        confidenceAssessment: reasoningGroups.find((group) => group.confidenceAssessment)?.confidenceAssessment,
        engineTrace: {
          selectedCapabilities: request.requestedCapabilities?.length
            ? request.requestedCapabilities
            : capabilitiesFromProviders(searchProviders, repertorizationProviders, reasoningProviders),
          internalProviders: unique(internalProviders),
          latencyMs: Date.now() - startedAt,
        },
      };
    },

    async runClinicalAnalysis(request: ClinicalRepertoryRequest): Promise<ClinicalRepertoryResult> {
      const startedAt = Date.now();
      const runId = `clinical-analysis-${startedAt}`;

      // Map request.selectedRubrics to symptoms array expected by engines
      const symptoms = request.selectedRubrics?.map(sr => ({
        rubricId: sr.rubricId,
        severity: sr.severity ?? 5,
        frequency: (sr.frequency as any) || 'constant',
        impact: sr.impact || 'moderate'
      })) || [];

      const scoringResult = await RepertoryScoring.calculateRepertorization(symptoms);

      let differentiations: RemedyDifferentiation[] = [];
      if (scoringResult.topRemedies.length > 0) {
        const topIds = scoringResult.topRemedies.slice(0, 3).map(r => r.remedyId);
        const activeIds = symptoms.map(s => s.rubricId);
        differentiations = await RepertoryScoring.differentiateRemedies(topIds, activeIds);
      }

      const reasoningSummary = await ReasoningEngine.generateReasoning(symptoms, scoringResult);

      // Build enhanced validation findings
      const validationFindings: ClinicalValidationFinding[] = [];

      // Fetch rubric details for advanced rule matching
      const rubricDetails = await Promise.all(symptoms.map(s => repertoryRepository.getRubricById(s.rubricId)));
      const categories = rubricDetails.filter((r): r is NonNullable<typeof r> => r !== undefined).map(r => r.category);

      // Conflicting thermals check
      const thermals = rubricDetails.filter(r => r && r.category === 'Thermal State');
      if (thermals.length > 1) {
        const hasChilly = thermals.some(t => t?.subCategory === 'Chilly');
        const hasWarm = thermals.some(t => t?.subCategory === 'Warm');
        if (hasChilly && hasWarm) {
          validationFindings.push({
            severity: "critical",
            category: "contradiction",
            message: "Conflicting thermal states selected: Patient cannot be both cold-sensitive (Chilly) and heat-sensitive (Warm).",
            relatedRubricIds: thermals.filter((t): t is NonNullable<typeof t> => t !== undefined).map(t => t.rubricId)
          });
        }
      }

      // Missing crucial parameters checks
      if (!categories.includes('Thermal State')) {
        validationFindings.push({
          severity: "warning",
          category: "missing_information",
          message: "Missing crucial constitutional general: Patient's Thermal State (Chilly / Warm) has not been specified."
        });
      }
      if (!categories.includes('Food & Cravings')) {
        validationFindings.push({
          severity: "info",
          category: "missing_information",
          message: "Missing constitutional general: Food cravings & aversions have not been specified."
        });
      }

      // Weak evidence checks
      if (symptoms.length < 3) {
        validationFindings.push({
          severity: "warning",
          category: "weak_evidence",
          message: `Weak case definition: Only ${symptoms.length} symptom rubric(s) selected. A robust analysis requires at least 3 indicators.`
        });
      }

      // Safety checks / Contraindications
      const contraindications: string[] = [];
      symptoms.forEach(sym => {
        const rub = rubricDetails.find(r => r && r.rubricId === sym.rubricId);
        if (!rub) return;
        rub.relatedRemedies.forEach(rem => {
          if (rem.contraindicationNotes) {
            const isTopRemedy = scoringResult.topRemedies.slice(0, 3).some(tr => tr.remedyId === rem.remedyId);
            if (isTopRemedy) {
              const msg = `Contraindication for ${rem.remedyName}: ${rem.contraindicationNotes}`;
              contraindications.push(msg);
              validationFindings.push({
                severity: "critical",
                category: "safety",
                message: msg,
                relatedRemedyIds: [rem.remedyId],
                relatedRubricIds: [sym.rubricId]
              });
            }
          }
        });
      });

      const clinicalWarnings = [
        ...contraindications,
        ...(reasoningSummary.safetyLabel ? [reasoningSummary.safetyLabel] : [])
      ];

      return {
        success: true,
        runId,
        safetyNotice: CLINICAL_WORKSPACE_SAFETY_NOTICE,
        query: request.query,
        rubricCandidates: [],
        selectedRubrics: request.selectedRubrics || [],
        remedyRankings: scoringResult.topRemedies.map((tr, index) => ({
          remedyId: tr.remedyId,
          remedyName: tr.remedyName,
          rank: index + 1,
          score: tr.score,
          confidence: tr.confidence,
          coverage: tr.matches,
          contributingRubricIds: [],
          missingRubricIds: [],
          explanation: [tr.kingdom || "", tr.miasm || "", tr.thermal || ""]
        })),
        differentialAnalysis: [],
        validationFindings,
        clinicalWarnings,
        missingInformation: scoringResult.missingDataNeeded,
        sourceAttribution: [],
        confidenceAssessment: {
          score: scoringResult.confidenceScore,
          explanation: `Analysis margin confidence index is ${scoringResult.confidenceScore}%.`
        },
        engineTrace: {
          selectedCapabilities: request.requestedCapabilities || [],
          internalProviders: ["repertory-scoring", "reasoning-engine"],
          latencyMs: Date.now() - startedAt
        },
        scoringResult,
        differentiations,
        reasoningSummary
      };
    },

    async searchRubrics(query: string, filters?: Record<string, any>): Promise<ClinicalRubricCandidate[]> {
      const scoredRubrics = await RepertorySearch.searchRubrics(query, filters, true, true);
      return scoredRubrics.map((item) => ({
        id: item.rubric.rubricId,
        title: item.rubric.title,
        source: item.rubric.source,
        category: item.rubric.category,
        clinicalSystem: item.rubric.organSystem,
        score: item.score,
        confidence: Math.min(1.0, item.score / 200),
        explanation: item.rubric.plainLanguageMeaning,
      }));
    },

    async parseAIIntakeText(intakeText: string): Promise<AIIntakeMappingResult> {
      return await RepertorySearch.parseAIIntakeText(intakeText);
    },

    async getLongitudinalSummary(
      patientId: string,
      timeline: VisitTimelineEntry[]
    ): Promise<LongitudinalCaseSummary> {
      const rubrics = await repertoryRepository.getRubrics();
      const titlesMap: Record<string, string> = {};
      rubrics.forEach((r: any) => {
        titlesMap[r.rubricId] = r.title;
      });
      return LongitudinalCaseModel.buildLongitudinalSummary(patientId, timeline, titlesMap);
    }
  };
}
