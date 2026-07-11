import { AiTaskRequest, AiTaskResult } from "../domain/ai.types";
import { z } from "zod";

export interface AIProvider {
  generateStructured<T>(
    request: AiTaskRequest,
    outputSchema: z.ZodSchema<T>
  ): Promise<AiTaskResult<T>>;
}

export interface AIOrchestrator {
  executeTask<T>(
    request: AiTaskRequest,
    outputSchema: z.ZodSchema<T>
  ): Promise<AiTaskResult<T>>;
}

/**
 * DEVELOPMENT ONLY - Mock Provider-Neutral AI Orchestrator implementing interfaces.
 * No provider-specific code is run and no model calls are made.
 */
export class MockAIOrchestrator implements AIOrchestrator {
  constructor(private readonly provider: AIProvider) {}

  async executeTask<T>(
    request: AiTaskRequest,
    outputSchema: z.ZodSchema<T>
  ): Promise<AiTaskResult<T>> {
    if (!request.consentVerificationStatus) {
      throw new Error("AI task execution aborted: Patient AI processing consent is missing or withdrawn");
    }
    return this.provider.generateStructured(request, outputSchema);
  }
}
