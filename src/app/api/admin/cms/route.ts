import { NextRequest, NextResponse } from "next/server";
import { 
  getDraft, 
  saveDraft, 
  getVersions, 
  rollbackToVersion, 
  approveClinicalReview, 
  publishArticle, 
  getPublicationEvents 
} from "@/features/knowledge-admin/cms/cmsManager";

// TODO: Enforce centralized admin auth before exposing CMS mutations in production.

export const dynamic = "force-dynamic";

const ALLOWED_STATUSES = ["draft", "in-editorial-review", "changes-requested", "clinically-approved", "ready-to-publish", "published", "archived"];
const ALLOWED_CHANGE_TYPES = ["content-edit", "metadata-edit", "reference-update", "summary-update", "schema-update", "seo-update", "clinical-review", "publication", "rollback"];

function containsPII(text: string): boolean {
  const normalized = text.toLowerCase();
  if (/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(text)) return true;
  if (/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/.test(text)) return true;
  if (/\b(?:dob|birth|ssn)\b/i.test(normalized)) return true;
  if (/\bcase\s*#?\s*\d+\b/i.test(normalized)) return true;
  if (/\bpatient\s*#?\s*\d+\b/i.test(normalized)) return true;
  return false;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const articleId = searchParams.get("articleId");

    if (!action) {
      return NextResponse.json({ error: "Missing action parameter" }, { status: 400 });
    }

    if (articleId && containsPII(articleId)) {
      return NextResponse.json({ error: "Invalid articleId parameter" }, { status: 400 });
    }

    if (action === "getDraft") {
      if (!articleId) return NextResponse.json({ error: "Missing articleId" }, { status: 400 });
      const draft = await getDraft(articleId);
      return NextResponse.json({ draft });
    }

    if (action === "getVersions") {
      if (!articleId) return NextResponse.json({ error: "Missing articleId" }, { status: 400 });
      const versions = await getVersions(articleId);
      return NextResponse.json({ versions });
    }

    if (action === "getPublications") {
      const publications = await getPublicationEvents(articleId || undefined);
      return NextResponse.json({ publications });
    }

    return NextResponse.json({ error: "Invalid GET action" }, { status: 400 });
  } catch (e: any) {
    console.error("CMS API GET Failure: Internal action failed.");
    return NextResponse.json({ error: "An internal request error occurred." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json({ error: "Missing action in request body" }, { status: 400 });
    }

    if (action === "saveDraft") {
      const { draftData, actor } = body;
      if (!draftData || !draftData.articleId) {
        return NextResponse.json({ error: "Missing draftData or articleId" }, { status: 400 });
      }

      // Check fields for PII
      if (
        containsPII(draftData.articleId) ||
        (draftData.title && containsPII(draftData.title)) ||
        (draftData.draftContent && containsPII(draftData.draftContent)) ||
        (draftData.patientSummary && containsPII(draftData.patientSummary)) ||
        (actor && containsPII(actor))
      ) {
        return NextResponse.json({ error: "Payload contains potential PII/PHI" }, { status: 400 });
      }

      // Check status if provided
      if (draftData.status && !ALLOWED_STATUSES.includes(draftData.status)) {
        return NextResponse.json({ error: "Invalid draft status value" }, { status: 400 });
      }

      const draft = await saveDraft(draftData, actor);
      return NextResponse.json({ draft });
    }

    if (action === "rollbackToVersion") {
      const { versionId, actor, confirmRollback } = body;
      if (!versionId || typeof versionId !== "string") {
        return NextResponse.json({ error: "Invalid versionId" }, { status: 400 });
      }
      if (!confirmRollback) {
        return NextResponse.json({ error: "Explicit rollback confirmation is required" }, { status: 400 });
      }
      if (actor && containsPII(actor)) {
        return NextResponse.json({ error: "Actor contains potential PII" }, { status: 400 });
      }

      try {
        const draft = await rollbackToVersion(versionId, actor, confirmRollback);
        return NextResponse.json({ draft });
      } catch (err: any) {
        return NextResponse.json({ error: err.message || "Failed to rollback version" }, { status: 400 });
      }
    }

    if (action === "approveClinicalReview") {
      const { articleId, reviewer, reviewerRole, reviewDate, nextReviewDate, notes, actor } = body;
      if (!articleId || !reviewer || !reviewDate || !nextReviewDate) {
        return NextResponse.json({ error: "Missing required clinical review validation fields" }, { status: 400 });
      }

      if (
        containsPII(articleId) ||
        containsPII(reviewer) ||
        (notes && containsPII(notes)) ||
        (actor && containsPII(actor))
      ) {
        return NextResponse.json({ error: "Payload contains potential PII/PHI" }, { status: 400 });
      }

      try {
        const success = await approveClinicalReview(
          articleId,
          reviewer,
          reviewerRole,
          reviewDate,
          nextReviewDate,
          notes,
          actor
        );
        return NextResponse.json({ success });
      } catch (err: any) {
        return NextResponse.json({ error: err.message || "Failed to approve clinical review" }, { status: 400 });
      }
    }

    if (action === "publishArticle") {
      const { articleId, publisher, changeSummary, confirmPublish } = body;
      if (!articleId || !publisher || !changeSummary) {
        return NextResponse.json({ error: "Missing publishing payload details" }, { status: 400 });
      }
      if (!confirmPublish) {
        return NextResponse.json({ error: "Explicit publish confirmation is required" }, { status: 400 });
      }

      if (
        containsPII(articleId) ||
        containsPII(publisher) ||
        containsPII(changeSummary)
      ) {
        return NextResponse.json({ error: "Payload contains potential PII/PHI" }, { status: 400 });
      }

      try {
        const result = await publishArticle(articleId, publisher, changeSummary, confirmPublish);
        return NextResponse.json(result);
      } catch (err: any) {
        return NextResponse.json({ error: "Failed to publish article safely" }, { status: 500 });
      }
    }

    return NextResponse.json({ error: "Invalid POST action" }, { status: 400 });
  } catch (e: any) {
    console.error("CMS API POST Failure: Internal action failed.");
    return NextResponse.json({ error: "An internal request error occurred." }, { status: 500 });
  }
}
