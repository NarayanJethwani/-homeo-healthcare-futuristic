import { 
  CmsArticleDraft, 
  CmsArticleVersion, 
  CmsPublicationEvent, 
  CmsArticleStatus, 
  CmsChangeType,
  CmsPublishResult
} from "./types";
import { EDITORIAL_REVIEWERS } from "../workflow/reviewerDirectory";
import { validateQualityGates } from "../../knowledge/governance/qualityGates";
import { validatePublicationReadiness } from "./publicationReadiness";
import { globalKmsRepository } from "../repositories/MemoryRepository";
import { KmsKnowledgeEntity } from "../types";
import { queueEmbeddingJob } from "../../knowledge/retrieval/embeddingQueue";

// In-memory fallback structures
const memoryDrafts: CmsArticleDraft[] = [];
const memoryVersions: CmsArticleVersion[] = [];
const memoryPublications: CmsPublicationEvent[] = [];

/**
 * Dynamically acquires the Firebase Firestore database if available.
 */
async function getFirestoreDb() {
  try {
    const { getAdminDb } = await import("../../../lib/firebaseAdmin");
    const db = getAdminDb();
    if (db) return db;
  } catch (e) {
    // Graceful degradation when Firebase Admin is unavailable or unconfigured
  }
  return null;
}

function generateUniqueId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function clearCmsMemoryStore(): void {
  memoryDrafts.length = 0;
  memoryVersions.length = 0;
  memoryPublications.length = 0;
}

/**
 * Gets the current draft of an article. If none exists in Firestore/memory,
 * checks if a public published version exists and seeds a new draft from it.
 */
export async function getDraft(articleId: string): Promise<CmsArticleDraft | null> {
  const db = await getFirestoreDb();
  if (db) {
    try {
      const snap = await db.collection("knowledge_article_drafts").where("articleId", "==", articleId).get();
      if (!snap.empty) {
        const doc = snap.docs[0];
        return { id: doc.id, ...doc.data() } as CmsArticleDraft;
      }
    } catch (e) {
      console.warn("CmsManager: Firestore draft read failed, falling back to memory.");
    }
  }

  // Check memory
  const mem = memoryDrafts.find(d => d.articleId === articleId);
  if (mem) return mem;

  // Fallback: Seed from existing public knowledge entity
  const publicEntity = await globalKmsRepository.getEntity(articleId);
  if (publicEntity) {
    const defaultDraft: CmsArticleDraft = {
      id: generateUniqueId(),
      articleId: publicEntity.id,
      title: publicEntity.title.en,
      slug: publicEntity.slug,
      entityType: publicEntity.entityType,
      status: "published",
      draftContent: publicEntity.content?.overview || publicEntity.content?.description || publicEntity.content?.definition || "",
      patientSummary: publicEntity.aiKnowledge?.patientSummary || publicEntity.summary?.en || "",
      practitionerSummary: publicEntity.aiKnowledge?.practitionerSummary || "",
      educationalSummary: publicEntity.aiKnowledge?.educationalSummary || "",
      references: publicEntity.content?.references || [],
      metadata: {
        isCornerstone: publicEntity.isCornerstone,
        evidenceLevel: publicEntity.evidenceLevel,
        tags: publicEntity.tags
      },
      reviewer: typeof publicEntity.reviewer === "string" ? publicEntity.reviewer : publicEntity.reviewer?.name,
      reviewerRole: publicEntity.reviewerRole || (typeof publicEntity.reviewer === "object" ? publicEntity.reviewer.specialty : "Clinical Reviewer"),
      clinicalReviewDate: publicEntity.lastClinicalReview,
      nextReviewDate: publicEntity.nextClinicalReview,
      createdAt: publicEntity.versionInfo.created || new Date().toISOString(),
      updatedAt: publicEntity.versionInfo.updated || new Date().toISOString(),
      createdBy: publicEntity.author.name,
      version: 1
    };
    
    // Save locally
    memoryDrafts.push(defaultDraft);
    return defaultDraft;
  }

  return null;
}

/**
 * Saves or updates a draft article. Increments version and registers a snapshot log.
 */
export async function saveDraft(
  draftData: Partial<CmsArticleDraft> & { articleId: string },
  actor: string
): Promise<CmsArticleDraft> {
  const now = new Date().toISOString();
  const existing = await getDraft(draftData.articleId);

  let updatedDraft: CmsArticleDraft;
  if (existing) {
    updatedDraft = {
      ...existing,
      ...draftData,
      status: draftData.status || "draft",
      version: existing.version + 1,
      updatedAt: now,
      updatedBy: actor
    };
  } else {
    updatedDraft = {
      id: generateUniqueId(),
      articleId: draftData.articleId,
      title: draftData.title || "",
      slug: draftData.slug || "",
      entityType: draftData.entityType || "disease",
      status: "draft",
      draftContent: draftData.draftContent || "",
      patientSummary: draftData.patientSummary || "",
      practitionerSummary: draftData.practitionerSummary || "",
      educationalSummary: draftData.educationalSummary || "",
      references: draftData.references || [],
      metadata: draftData.metadata || {},
      reviewer: draftData.reviewer,
      reviewerRole: draftData.reviewerRole,
      clinicalReviewDate: draftData.clinicalReviewDate,
      nextReviewDate: draftData.nextReviewDate,
      createdAt: now,
      updatedAt: now,
      createdBy: actor,
      updatedBy: actor,
      version: 1
    };
  }

  // Save draft
  const db = await getFirestoreDb();
  if (db) {
    try {
      await db.collection("knowledge_article_drafts").doc(updatedDraft.id).set(updatedDraft);
    } catch (e) {
      console.warn("CmsManager: Firestore draft save failed, keeping in memory.");
    }
  }

  const memIdx = memoryDrafts.findIndex(d => d.articleId === updatedDraft.articleId);
  if (memIdx !== -1) {
    memoryDrafts[memIdx] = updatedDraft;
  } else {
    memoryDrafts.push(updatedDraft);
  }

  // Create version snapshot
  const changeType: CmsChangeType = draftData.status === "published" ? "publication" : "content-edit";
  const versionRecord: CmsArticleVersion = {
    id: generateUniqueId(),
    articleId: updatedDraft.articleId,
    version: updatedDraft.version,
    status: updatedDraft.status,
    snapshot: updatedDraft,
    createdAt: now,
    createdBy: actor,
    changeType,
    changeSummary: `Draft version ${updatedDraft.version} updated.`
  };

  if (db) {
    try {
      await db.collection("knowledge_article_versions").doc(versionRecord.id).set(versionRecord);
    } catch (e) {
      console.warn("CmsManager: Firestore version snapshot save failed, keeping in memory.");
    }
  }
  memoryVersions.push(versionRecord);

  return updatedDraft;
}

/**
 * Returns all historical versions of the article.
 */
export async function getVersions(articleId: string): Promise<CmsArticleVersion[]> {
  const db = await getFirestoreDb();
  const list: CmsArticleVersion[] = [];

  if (db) {
    try {
      const snap = await db.collection("knowledge_article_versions")
        .where("articleId", "==", articleId)
        .get();
      snap.forEach((doc: any) => {
        list.push({ id: doc.id, ...doc.data() } as CmsArticleVersion);
      });
    } catch (e) {
      console.warn("CmsManager: Firestore versions read failed.");
    }
  }

  // Merge memory
  for (const m of memoryVersions) {
    if (m.articleId === articleId && !list.some(l => l.id === m.id)) {
      list.push(m);
    }
  }

  return list.sort((a, b) => b.version - a.version);
}

/**
 * Restores a version snapshot to the current draft.
 */
export async function rollbackToVersion(
  versionId: string, 
  actor: string,
  confirmRollback?: boolean
): Promise<CmsArticleDraft> {
  if (!confirmRollback) {
    throw new Error("Explicit rollback confirmation is required.");
  }

  const db = await getFirestoreDb();
  let selectedVersion: CmsArticleVersion | undefined;

  if (db) {
    try {
      const doc = await db.collection("knowledge_article_versions").doc(versionId).get();
      if (doc.exists) {
        selectedVersion = { id: doc.id, ...doc.data() } as CmsArticleVersion;
      }
    } catch (e) {
      console.warn("CmsManager: Firestore version lookup failed during rollback.");
    }
  }

  if (!selectedVersion) {
    selectedVersion = memoryVersions.find(v => v.id === versionId);
  }

  if (!selectedVersion) {
    throw new Error("Specified version snapshot does not exist.");
  }

  const now = new Date().toISOString();
  const existing = await getDraft(selectedVersion.articleId);
  const nextVer = existing ? existing.version + 1 : 1;

  const restoredDraft: CmsArticleDraft = {
    ...selectedVersion.snapshot,
    version: nextVer,
    status: "draft",
    updatedAt: now,
    updatedBy: actor,
    notes: `Rolled back to version ${selectedVersion.version} snapshot.`
  };

  // Save draft
  if (db) {
    try {
      await db.collection("knowledge_article_drafts").doc(restoredDraft.id).set(restoredDraft);
    } catch (e) {
      console.warn("CmsManager: Firestore rollback draft save failed.");
    }
  }

  const memIdx = memoryDrafts.findIndex(d => d.articleId === restoredDraft.articleId);
  if (memIdx !== -1) {
    memoryDrafts[memIdx] = restoredDraft;
  } else {
    memoryDrafts.push(restoredDraft);
  }

  // Create version history entry for the rollback event itself
  const rollbackVersionRecord: CmsArticleVersion = {
    id: generateUniqueId(),
    articleId: restoredDraft.articleId,
    version: restoredDraft.version,
    status: restoredDraft.status,
    snapshot: restoredDraft,
    createdAt: now,
    createdBy: actor,
    changeType: "rollback",
    changeSummary: `Rolled back to version ${selectedVersion.version} snapshot.`
  };

  if (db) {
    try {
      await db.collection("knowledge_article_versions").doc(rollbackVersionRecord.id).set(rollbackVersionRecord);
    } catch (e) {
      console.warn("CmsManager: Firestore rollback snapshot save failed.");
    }
  }
  memoryVersions.push(rollbackVersionRecord);

  return restoredDraft;
}

/**
 * Validates clinician reviewer exists in the clinical directory and approves the draft.
 */
export async function approveClinicalReview(
  articleId: string,
  reviewer: string,
  reviewerRole: string,
  reviewDate: string,
  nextReviewDate: string,
  notes?: string,
  actor?: string
): Promise<boolean> {
  // Validate reviewer exists in active clinical directory
  const clinicianExists = EDITORIAL_REVIEWERS.some(r => r.name.toLowerCase() === reviewer.toLowerCase());
  if (!clinicianExists) {
    throw new Error(`Reviewer '${reviewer}' is not registered in the active clinical directory.`);
  }

  const draft = await getDraft(articleId);
  if (!draft) {
    throw new Error("Cannot approve review. No active draft exists.");
  }

  draft.status = "clinically-approved";
  draft.reviewer = reviewer;
  draft.reviewerRole = reviewerRole;
  draft.clinicalReviewDate = reviewDate;
  draft.nextReviewDate = nextReviewDate;
  if (notes) draft.notes = notes;

  await saveDraft(draft, actor || reviewer);

  return true;
}

/**
 * Performs publication quality checks and promotes/merges the draft content to the published collection.
 */
export async function publishArticle(
  articleId: string,
  publisher: string,
  changeSummary: string,
  confirmPublish?: boolean
): Promise<CmsPublishResult> {
  const result: CmsPublishResult = {
    success: false,
    draftId: "",
    articleId,
    version: 0,
    publicWriteBack: "skipped",
    indexUpdate: "skipped",
    publicationEventCreated: false,
    rollbackAvailable: false,
    warnings: [],
    errors: []
  };

  if (!confirmPublish) {
    result.errors.push("Explicit publish confirmation is required.");
    return result;
  }

  const draft = await getDraft(articleId);
  if (!draft) {
    result.errors.push("No active draft exists to publish.");
    return result;
  }
  result.draftId = draft.id;
  result.version = draft.version;

  if (draft.status !== "clinically-approved" && draft.status !== "ready-to-publish" && draft.status !== "published") {
    result.errors.push("Article must be clinically approved before publishing.");
    return result;
  }

  // 1. Run full publication readiness validations
  const readiness = await validatePublicationReadiness(draft);
  result.warnings = readiness.warnings;
  if (!readiness.passed) {
    result.errors = [...result.errors, ...readiness.errors];
    return result;
  }

  // 2. Pre-publication snapshot for rollback ability
  const prePublishEntity = await globalKmsRepository.getEntity(articleId);
  
  // Construct KmsKnowledgeEntity snapshot for public promotion
  const publicEntity: any = {
    id: draft.articleId,
    slug: draft.slug,
    entityType: draft.entityType as any,
    title: { en: draft.title, hi: "", gu: "", mr: "", es: "", ar: "" },
    summary: { en: draft.patientSummary || "", hi: "", gu: "", mr: "", es: "", ar: "" },
    relatedEntities: (draft.metadata?.relatedEntities as string[]) || [],
    lastReviewed: draft.clinicalReviewDate || new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    author: { name: draft.createdBy || publisher },
    reviewer: { 
      name: draft.reviewer || "", 
      credentials: draft.reviewerRole?.includes("MD") ? "MD(Hom)" : "BHMS", 
      specialty: draft.reviewerRole || "Clinical Reviewer" 
    },
    reviewerRole: draft.reviewerRole || "Clinical Reviewer",
    lastClinicalReview: draft.clinicalReviewDate || new Date().toISOString(),
    nextClinicalReview: draft.nextReviewDate || new Date().toISOString(),
    referencesUpdated: draft.clinicalReviewDate || new Date().toISOString(),
    reviewStatus: "clinically-reviewed",
    isCornerstone: !!draft.metadata?.isCornerstone,
    evidenceLevel: (draft.metadata?.evidenceLevel as any) || "Level-C",
    tags: (draft.metadata?.tags as string[]) || [],
    canonicalUrl: `https://homeo.healthcare/knowledge/${draft.entityType === "research" ? "research" : draft.entityType === "case-study" ? "case-studies" : draft.entityType === "remedy" ? "remedies" : draft.entityType + "s"}/${draft.slug}`,
    editorialStatus: "published",
    editorialNotes: draft.notes || "",
    nextReviewDate: draft.nextReviewDate || new Date().toISOString(),
    versionInfo: {
      version: `${draft.version}.0.0`,
      created: draft.createdAt,
      updated: new Date().toISOString(),
      reviewed: draft.clinicalReviewDate || new Date().toISOString(),
      changelog: []
    },
    content: {
      overview: draft.draftContent || "",
      references: (draft.references as string[]) || []
    },
    readabilityScore: { score: 85, readingLevel: "Patient Friendly", readingTimeMinutes: 2 },
    seoGeoScores: { seoScore: 90, geoScore: 90, aiReadinessScore: 90 },
    aiKnowledge: {
      retrievalSummary: draft.patientSummary || "",
      differentialSummary: "",
      practitionerSummary: draft.practitionerSummary || "",
      patientSummary: draft.patientSummary || "",
      educationalSummary: draft.educationalSummary || "",
      graphContext: "",
      embeddingText: ""
    },
    readingTimeMinutes: 2,
    audience: "practitioner",
    license: "Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International"
  };

  // 3. Promote/Merge to public repository
  try {
    await globalKmsRepository.saveEntity(publicEntity, publisher, "Administrator", changeSummary);
    result.publicWriteBack = "completed";
  } catch (err: any) {
    result.publicWriteBack = "failed";
    result.errors.push(`Public write-back failed: ${err.message}`);
    return result;
  }

  // 4. Queue Embedding Job for indexing
  try {
    const bodyText = draft.draftContent || "";
    await queueEmbeddingJob(draft.articleId, draft.title, draft.entityType, bodyText);
    result.indexUpdate = "completed";
  } catch (err: any) {
    result.indexUpdate = "failed";
    result.warnings.push(`Failed to queue vector index job: ${err.message || err}`);
  }

  // 5. Update draft status
  draft.status = "published";
  try {
    await saveDraft(draft, publisher);
  } catch (err: any) {
    result.publicWriteBack = "partial-failure";
    result.errors.push(`Failed to update draft status after publication: ${err.message}`);
    result.warnings.push("Draft rollback available. Public rollback pending.");
    return result;
  }

  // 6. Log publication event
  const pubEvent: CmsPublicationEvent = {
    id: generateUniqueId(),
    articleId: draft.articleId,
    draftId: draft.id,
    version: draft.version,
    publishedAt: new Date().toISOString(),
    publishedBy: publisher,
    reviewer: draft.reviewer || "",
    clinicalReviewDate: draft.clinicalReviewDate || "",
    changeSummary
  };

  const db = await getFirestoreDb();
  if (db) {
    try {
      await db.collection("knowledge_publication_events").doc(pubEvent.id).set(pubEvent);
    } catch (e) {
      console.warn("CmsManager: Firestore publication event save failed.");
      result.warnings.push("Failed to persist publication audit trail to Firestore. Session log is active.");
    }
  }
  memoryPublications.push(pubEvent);
  result.publicationEventCreated = true;
  result.rollbackAvailable = !!prePublishEntity;

  result.success = true;
  return result;
}

/**
 * Lists publication events.
 */
export async function getPublicationEvents(articleId?: string): Promise<CmsPublicationEvent[]> {
  const db = await getFirestoreDb();
  const list: CmsPublicationEvent[] = [];

  if (db) {
    try {
      let query: any = db.collection("knowledge_publication_events");
      if (articleId) {
        query = query.where("articleId", "==", articleId);
      }
      const snap = await query.get();
      snap.forEach((doc: any) => {
        list.push({ id: doc.id, ...doc.data() } as CmsPublicationEvent);
      });
    } catch (e) {
      console.warn("CmsManager: Firestore publication events read failed.");
    }
  }

  // Merge memory
  for (const m of memoryPublications) {
    if ((!articleId || m.articleId === articleId) && !list.some(l => l.id === m.id)) {
      list.push(m);
    }
  }

  return list.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
