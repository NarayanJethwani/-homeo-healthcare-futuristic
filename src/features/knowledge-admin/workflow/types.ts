export type EditorialTaskType =
  | "clinical-review"
  | "reference-update"
  | "seo-improvement"
  | "schema-fix"
  | "summary-expansion"
  | "graph-enrichment"
  | "ai-readiness"
  | "clinical-os-link-review"
  | "content-expansion"
  | "accessibility-review";

export type EditorialTaskStatus =
  | "backlog"
  | "assigned"
  | "in-progress"
  | "blocked"
  | "ready-for-review"
  | "completed"
  | "deferred"
  | "cancelled";

export type EditorialTaskPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface EditorialTask {
  id: string;
  articleId: string;
  articleTitle: string;
  entityType: string;
  taskType: EditorialTaskType;
  status: EditorialTaskStatus;
  priority: EditorialTaskPriority;
  assignedTo?: string;
  reviewerRole?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  source:
    | "manual"
    | "editorial-priority-service"
    | "search-console"
    | "analytics"
    | "clinical-os-usage"
    | "ai-readiness"
    | "citation-health"
    | "review-schedule";
  reasons: string[];
  notes?: string;
  blockingReason?: string;
}

export interface EditorialWorkflowEvent {
  id: string;
  articleId: string;
  taskId?: string; // added to correlate events to specific tasks
  eventType:
    | "task-created"
    | "task-assigned"
    | "task-status-changed"
    | "reviewer-changed"
    | "review-date-updated"
    | "review-completed"
    | "citation-status-updated"
    | "priority-changed"
    | "note-added";
  actor?: string;
  createdAt: string;
  before?: any;
  after?: any;
  note?: string;
}
