import { EditorialWorkflowState, WorkflowTransition } from "../types/governanceTypes";
import { recordGovernanceAuditEvent } from "./governanceAuditTrail";

/**
 * Permitted state transitions in the Editorial Workflow State Machine
 */
const PERMITTED_TRANSITIONS: Record<EditorialWorkflowState, EditorialWorkflowState[]> = {
  draft: ["editorial-review", "archived"],
  "editorial-review": ["clinical-review", "draft", "changes-requested"],
  "clinical-review": ["changes-requested", "evidence-review"],
  "changes-requested": ["draft", "editorial-review"],
  "evidence-review": ["approved", "changes-requested"],
  approved: ["published", "archived"],
  published: ["withdrawn", "archived", "editorial-review"],
  withdrawn: ["editorial-review", "archived"],
  archived: ["draft"],
};

/**
 * Permitted emergency override target states.
 * Emergency overrides may ONLY be used to withdraw, suppress, or transition to safety-containment states.
 * They MUST NOT be used to bypass clinical approval, evidence approval, or publication.
 */
const PERMITTED_EMERGENCY_OVERRIDE_TARGETS = new Set<EditorialWorkflowState>([
  "withdrawn",
  "changes-requested",
  "draft",
  "archived",
]);

export interface TransitionValidationResult {
  isValid: boolean;
  reason?: string;
}

/**
 * Validates whether a workflow state transition is permitted.
 * Rejects skipped stages unless a documented, unexpired emergency override is provided for containment.
 */
export function validateWorkflowTransition(
  entityId: string,
  from: EditorialWorkflowState,
  to: EditorialWorkflowState,
  transition: Partial<WorkflowTransition>
): TransitionValidationResult {
  // Handle Emergency Override explicitly first if specified
  if (transition.isEmergencyOverride) {
    if (!transition.actorId) {
      return { isValid: false, reason: "emergency-override-missing-actor-id" };
    }
    if (!transition.emergencyReason || transition.emergencyReason.trim().length < 10) {
      return { isValid: false, reason: "emergency-override-insufficient-reasoning" };
    }
    if (!transition.emergencyExpiry) {
      return { isValid: false, reason: "emergency-override-missing-expiry" };
    }

    // Expiry verification
    const expiryDate = new Date(transition.emergencyExpiry);
    if (isNaN(expiryDate.getTime()) || expiryDate <= new Date()) {
      return { isValid: false, reason: "emergency-override-expired-or-invalid" };
    }

    // Prohibit using emergency override to grant clinical approval or publish unreviewed content
    if (!PERMITTED_EMERGENCY_OVERRIDE_TARGETS.has(to)) {
      return {
        isValid: false,
        reason: `emergency-override-prohibited-target:${to} (Emergency overrides cannot grant clinical approval or publication)`,
      };
    }

    // Log audit event for emergency override
    recordGovernanceAuditEvent({
      id: `AUD-EMERGENCY-${Date.now()}`,
      entityId,
      actorId: transition.actorId,
      action: "EMERGENCY_WORKFLOW_OVERRIDE",
      previousState: from,
      newState: to,
      reason: transition.emergencyReason,
      createdAt: new Date().toISOString(),
      metadata: { emergencyExpiry: transition.emergencyExpiry },
    });

    return { isValid: true };
  }

  // Standard permitted workflow state transitions
  const allowed = PERMITTED_TRANSITIONS[from] || [];
  if (allowed.includes(to)) {
    return { isValid: true };
  }

  return {
    isValid: false,
    reason: `invalid-workflow-transition:${from}->${to}`,
  };
}
