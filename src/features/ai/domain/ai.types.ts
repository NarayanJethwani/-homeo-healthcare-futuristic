export type AiTaskType = "completeness" | "missing_questions" | "summary";

export interface BaseAiRequest {
  taskType: AiTaskType;
  schemaVersion: number;
  organizationId: string;
  patientId: string;
  encounterId: string;
  consentVerificationStatus: boolean;
  requestedOutputSchemaVersion: number;
}

export interface CompletenessTaskRequest extends BaseAiRequest {
  taskType: "completeness";
  clinicalDataSnapshot: {
    chiefComplaintPresent: boolean;
    vitalsCount: number;
    notesLength: number;
  };
}

export interface MissingQuestionsTaskRequest extends BaseAiRequest {
  taskType: "missing_questions";
  clinicalDataSnapshot: {
    historyText: string;
    generalsLogged: string[];
  };
}

export interface CaseSummaryTaskRequest extends BaseAiRequest {
  taskType: "summary";
  clinicalDataSnapshot: {
    complaintsList: string[];
    vitalsList: Array<{ parameter: string; value: string | number }>;
    historyTimeline: string[];
  };
}

export type AiTaskRequest =
  | CompletenessTaskRequest
  | MissingQuestionsTaskRequest
  | CaseSummaryTaskRequest;

export interface AiTaskResult<T> {
  provider: string;
  model: string;
  promptVersion: string;
  payload: T;
  latencyMs: number;
  tokensUsed?: number;
  generatedAt: string;
}
