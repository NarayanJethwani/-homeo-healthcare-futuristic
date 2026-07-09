export type CmsArticleStatus =
  | "draft"
  | "in-editorial-review"
  | "changes-requested"
  | "clinically-approved"
  | "ready-to-publish"
  | "published"
  | "archived";

export type CmsChangeType =
  | "content-edit"
  | "metadata-edit"
  | "reference-update"
  | "summary-update"
  | "schema-update"
  | "seo-update"
  | "clinical-review"
  | "publication"
  | "rollback";

export interface CmsArticleDraft {
  id: string;
  articleId: string;
  title: string;
  slug: string;
  entityType: string;
  status: CmsArticleStatus;
  draftContent?: string;
  patientSummary?: string;
  practitionerSummary?: string;
  educationalSummary?: string;
  references?: unknown[];
  metadata?: Record<string, unknown>;
  reviewer?: string;
  reviewerRole?: string;
  clinicalReviewDate?: string;
  nextReviewDate?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  version: number;
  basedOnPublishedVersion?: string;
  notes?: string;
}

export interface CmsArticleVersion {
  id: string;
  articleId: string;
  version: number;
  status: CmsArticleStatus;
  snapshot: CmsArticleDraft;
  createdAt: string;
  createdBy?: string;
  changeType: CmsChangeType;
  changeSummary: string;
}

export interface CmsPublicationEvent {
  id: string;
  articleId: string;
  draftId: string;
  version: number;
  publishedAt: string;
  publishedBy?: string;
  reviewer: string;
  clinicalReviewDate: string;
  changeSummary: string;
  rollbackFromVersion?: number;
}

export interface CmsPublishResult {
  success: boolean;
  draftId: string;
  articleId: string;
  version: number;
  publicWriteBack: "completed" | "skipped" | "failed" | "partial-failure";
  indexUpdate: "completed" | "skipped" | "failed";
  publicationEventCreated: boolean;
  rollbackAvailable: boolean;
  warnings: string[];
  errors: string[];
}

