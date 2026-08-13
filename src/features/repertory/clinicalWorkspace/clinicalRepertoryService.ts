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
): ClinicalRepertoryService & {
  getRubricById(id: string): Promise<any>;
  loadInitialRubrics(): Promise<any[]>;
  getRubrics(filters?: Record<string, any>): Promise<any[]>;
  searchFullRubrics(query: string, filters?: Record<string, any>): Promise<any[]>;
} {
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
      // patientId comes from the caller context — never synthesised here.
      // userId is deliberately omitted: the server derives it from the verified
      // session cookie. Sending a client-supplied userId would allow identity spoofing.
      const patientId = typeof request.patientId === "string" && request.patientId.length > 0
        ? request.patientId
        : "unassigned";

      const response = await fetch("/api/repertory/repertorize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          patientId,
          selectedRubrics: request.selectedRubrics
        })
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to run clinical analysis on server.");
      }
      return data;
    },

    async searchRubrics(query: string, filters?: Record<string, any>): Promise<ClinicalRubricCandidate[]> {
      const qParams = new URLSearchParams();
      qParams.set('q', query);
      if (filters) {
        if (filters.category) qParams.set('category', filters.category);
        if (filters.organSystem) qParams.set('organSystem', filters.organSystem);
        if (filters.miasm) qParams.set('miasm', filters.miasm);
        if (filters.remedy) qParams.set('remedy', filters.remedy);
        if (filters.sourceId) qParams.set('sourceId', filters.sourceId);
      }
      const response = await fetch(`/api/repertory/search?${qParams.toString()}`);
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch search results from server.");
      }

      return data.rubrics.map((item: any) => ({
        id: item.rubricId,
        title: item.title,
        source: item.source,
        category: item.category,
        clinicalSystem: item.organSystem,
        score: item.score,
        confidence: Math.min(1.0, item.score / 200),
        explanation: item.classicalWording,
      }));
    },

    async parseAIIntakeText(intakeText: string): Promise<AIIntakeMappingResult & { rubrics?: any[] }> {
      const response = await fetch("/api/repertory/intake", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: intakeText })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to parse AI clinical intake.");
      }
      return data as AIIntakeMappingResult & { rubrics?: any[] };
    },

    async getLongitudinalSummary(
      patientId: string,
      timeline: VisitTimelineEntry[]
    ): Promise<LongitudinalCaseSummary> {
      const response = await fetch("/api/repertory/search?q=&pageSize=50");
      const data = await response.json();
      const rubrics = data.success ? data.rubrics : [];
      const titlesMap: Record<string, string> = {};
      rubrics.forEach((r: any) => {
        titlesMap[r.rubricId] = r.title;
      });
      return LongitudinalCaseModel.buildLongitudinalSummary(patientId, timeline, titlesMap);
    },

    async getRubricById(id: string): Promise<any> {
      const response = await fetch(`/api/repertory/details?id=${encodeURIComponent(id)}`);
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch rubric details from server.");
      }
      return data.rubric;
    },

    async loadInitialRubrics(): Promise<any[]> {
      const response = await fetch("/api/repertory/search?q=&pageSize=50");
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to load initial rubrics from server.");
      }
      return data.rubrics;
    },

    async getRubrics(filters?: Record<string, any>): Promise<any[]> {
      const qParams = new URLSearchParams();
      qParams.set('q', '');
      qParams.set('pageSize', '50');
      if (filters) {
        if (filters.category) qParams.set('category', filters.category);
        if (filters.organSystem) qParams.set('organSystem', filters.organSystem);
        if (filters.miasm) qParams.set('miasm', filters.miasm);
        if (filters.remedy) qParams.set('remedy', filters.remedy);
        if (filters.sourceId) qParams.set('sourceId', filters.sourceId);
      }
      const response = await fetch(`/api/repertory/search?${qParams.toString()}`);
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch rubrics from server.");
      }
      return data.rubrics;
    },

    async searchFullRubrics(query: string, filters?: Record<string, any>): Promise<any[]> {
      const qParams = new URLSearchParams();
      qParams.set('q', query);
      qParams.set('pageSize', '50');
      if (filters) {
        if (filters.category) qParams.set('category', filters.category);
        if (filters.organSystem) qParams.set('organSystem', filters.organSystem);
        if (filters.miasm) qParams.set('miasm', filters.miasm);
        if (filters.remedy) qParams.set('remedy', filters.remedy);
        if (filters.sourceId) qParams.set('sourceId', filters.sourceId);
      }
      const response = await fetch(`/api/repertory/search?${qParams.toString()}`);
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to search rubrics from server.");
      }
      return data.rubrics;
    }
  };
}
