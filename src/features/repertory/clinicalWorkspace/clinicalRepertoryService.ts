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
} from "./types";

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
  };
}
