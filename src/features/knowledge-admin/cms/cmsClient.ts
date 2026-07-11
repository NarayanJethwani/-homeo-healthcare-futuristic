import { CmsArticleDraft, CmsArticleVersion, CmsPublicationEvent, CmsPublishResult } from "./types";

export async function getDraft(articleId: string): Promise<CmsArticleDraft | null> {
  const res = await fetch(`/api/admin/cms?action=getDraft&articleId=${encodeURIComponent(articleId)}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.draft || null;
}

export async function saveDraft(
  draftData: Partial<CmsArticleDraft> & { articleId: string },
  actor: string
): Promise<CmsArticleDraft> {
  const res = await fetch("/api/admin/cms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "saveDraft", draftData, actor })
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to save draft");
  }
  const data = await res.json();
  return data.draft;
}

export async function getVersions(articleId: string): Promise<CmsArticleVersion[]> {
  const res = await fetch(`/api/admin/cms?action=getVersions&articleId=${encodeURIComponent(articleId)}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.versions || [];
}

export async function rollbackToVersion(
  versionId: string, 
  actor: string,
  confirmRollback?: boolean
): Promise<CmsArticleDraft> {
  const res = await fetch("/api/admin/cms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "rollbackToVersion", versionId, actor, confirmRollback })
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to rollback version");
  }
  const data = await res.json();
  return data.draft;
}

export async function approveClinicalReview(
  articleId: string,
  reviewer: string,
  reviewerRole: string,
  reviewDate: string,
  nextReviewDate: string,
  notes?: string,
  actor?: string
): Promise<boolean> {
  const res = await fetch("/api/admin/cms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      action: "approveClinicalReview", 
      articleId, 
      reviewer, 
      reviewerRole, 
      reviewDate, 
      nextReviewDate, 
      notes, 
      actor 
    })
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to approve clinical review");
  }
  const data = await res.json();
  return !!data.success;
}

export async function publishArticle(
  articleId: string,
  publisher: string,
  changeSummary: string,
  confirmPublish?: boolean
): Promise<CmsPublishResult> {
  const res = await fetch("/api/admin/cms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "publishArticle", articleId, publisher, changeSummary, confirmPublish })
  });
  const data = await res.json();
  return data;
}

export async function getPublicationEvents(articleId?: string): Promise<CmsPublicationEvent[]> {
  const url = articleId 
    ? `/api/admin/cms?action=getPublications&articleId=${encodeURIComponent(articleId)}`
    : "/api/admin/cms?action=getPublications";
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return data.publications || [];
}

export async function transitionLifecycle(
  articleId: string,
  targetStatus: string,
  options: {
    comments?: string;
    expectedRevision?: number;
    reviewer?: string;
    reviewerRole?: string;
    reviewDate?: string;
    nextReviewDate?: string;
    changeSummary?: string;
    confirmPublish?: boolean;
  } = {}
): Promise<CmsArticleDraft> {
  const res = await fetch("/api/admin/cms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "transitionLifecycle", articleId, targetStatus, ...options })
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to transition state");
  }
  const data = await res.json();
  return data.draft;
}
