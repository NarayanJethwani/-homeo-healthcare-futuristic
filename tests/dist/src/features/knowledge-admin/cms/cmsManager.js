"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCmsMemoryStore = clearCmsMemoryStore;
exports.getDraft = getDraft;
exports.saveDraft = saveDraft;
exports.getVersions = getVersions;
exports.rollbackToVersion = rollbackToVersion;
exports.approveClinicalReview = approveClinicalReview;
exports.publishArticle = publishArticle;
exports.getPublicationEvents = getPublicationEvents;
const reviewerDirectory_1 = require("../workflow/reviewerDirectory");
const publicationReadiness_1 = require("./publicationReadiness");
const MemoryRepository_1 = require("../repositories/MemoryRepository");
const embeddingQueue_1 = require("../../knowledge/retrieval/embeddingQueue");
// In-memory fallback structures
const memoryDrafts = [];
const memoryVersions = [];
const memoryPublications = [];
/**
 * Dynamically acquires the Firebase Firestore database if available.
 */
async function getFirestoreDb() {
    try {
        const { getAdminDb } = await Promise.resolve().then(() => __importStar(require("../../../lib/firebaseAdmin")));
        const db = getAdminDb();
        if (db)
            return db;
    }
    catch (e) {
        // Graceful degradation when Firebase Admin is unavailable or unconfigured
    }
    return null;
}
function generateUniqueId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
function clearCmsMemoryStore() {
    memoryDrafts.length = 0;
    memoryVersions.length = 0;
    memoryPublications.length = 0;
}
/**
 * Gets the current draft of an article. If none exists in Firestore/memory,
 * checks if a public published version exists and seeds a new draft from it.
 */
async function getDraft(articleId) {
    const db = await getFirestoreDb();
    if (db) {
        try {
            const snap = await db.collection("knowledge_article_drafts").where("articleId", "==", articleId).get();
            if (!snap.empty) {
                const doc = snap.docs[0];
                return { id: doc.id, ...doc.data() };
            }
        }
        catch (e) {
            console.warn("CmsManager: Firestore draft read failed, falling back to memory.");
        }
    }
    // Check memory
    const mem = memoryDrafts.find(d => d.articleId === articleId);
    if (mem)
        return mem;
    // Fallback: Seed from existing public knowledge entity
    const publicEntity = await MemoryRepository_1.globalKmsRepository.getEntity(articleId);
    if (publicEntity) {
        const defaultDraft = {
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
async function saveDraft(draftData, actor) {
    const now = new Date().toISOString();
    const existing = await getDraft(draftData.articleId);
    let updatedDraft;
    if (existing) {
        updatedDraft = {
            ...existing,
            ...draftData,
            status: draftData.status || "draft",
            version: existing.version + 1,
            updatedAt: now,
            updatedBy: actor
        };
    }
    else {
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
        }
        catch (e) {
            console.warn("CmsManager: Firestore draft save failed, keeping in memory.");
        }
    }
    const memIdx = memoryDrafts.findIndex(d => d.articleId === updatedDraft.articleId);
    if (memIdx !== -1) {
        memoryDrafts[memIdx] = updatedDraft;
    }
    else {
        memoryDrafts.push(updatedDraft);
    }
    // Create version snapshot
    const changeType = draftData.status === "published" ? "publication" : "content-edit";
    const versionRecord = {
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
        }
        catch (e) {
            console.warn("CmsManager: Firestore version snapshot save failed, keeping in memory.");
        }
    }
    memoryVersions.push(versionRecord);
    return updatedDraft;
}
/**
 * Returns all historical versions of the article.
 */
async function getVersions(articleId) {
    const db = await getFirestoreDb();
    const list = [];
    if (db) {
        try {
            const snap = await db.collection("knowledge_article_versions")
                .where("articleId", "==", articleId)
                .get();
            snap.forEach((doc) => {
                list.push({ id: doc.id, ...doc.data() });
            });
        }
        catch (e) {
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
async function rollbackToVersion(versionId, actor, confirmRollback) {
    if (!confirmRollback) {
        throw new Error("Explicit rollback confirmation is required.");
    }
    const db = await getFirestoreDb();
    let selectedVersion;
    if (db) {
        try {
            const doc = await db.collection("knowledge_article_versions").doc(versionId).get();
            if (doc.exists) {
                selectedVersion = { id: doc.id, ...doc.data() };
            }
        }
        catch (e) {
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
    const restoredDraft = {
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
        }
        catch (e) {
            console.warn("CmsManager: Firestore rollback draft save failed.");
        }
    }
    const memIdx = memoryDrafts.findIndex(d => d.articleId === restoredDraft.articleId);
    if (memIdx !== -1) {
        memoryDrafts[memIdx] = restoredDraft;
    }
    else {
        memoryDrafts.push(restoredDraft);
    }
    // Create version history entry for the rollback event itself
    const rollbackVersionRecord = {
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
        }
        catch (e) {
            console.warn("CmsManager: Firestore rollback snapshot save failed.");
        }
    }
    memoryVersions.push(rollbackVersionRecord);
    return restoredDraft;
}
/**
 * Validates clinician reviewer exists in the clinical directory and approves the draft.
 */
async function approveClinicalReview(articleId, reviewer, reviewerRole, reviewDate, nextReviewDate, notes, actor) {
    // Validate reviewer exists in active clinical directory
    const clinicianExists = reviewerDirectory_1.EDITORIAL_REVIEWERS.some(r => r.name.toLowerCase() === reviewer.toLowerCase());
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
    if (notes)
        draft.notes = notes;
    await saveDraft(draft, actor || reviewer);
    return true;
}
/**
 * Performs publication quality checks and promotes/merges the draft content to the published collection.
 */
async function publishArticle(articleId, publisher, changeSummary, confirmPublish) {
    const result = {
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
    const readiness = await (0, publicationReadiness_1.validatePublicationReadiness)(draft);
    result.warnings = readiness.warnings;
    if (!readiness.passed) {
        result.errors = [...result.errors, ...readiness.errors];
        return result;
    }
    // 2. Pre-publication snapshot for rollback ability
    const prePublishEntity = await MemoryRepository_1.globalKmsRepository.getEntity(articleId);
    // Construct KmsKnowledgeEntity snapshot for public promotion
    const publicEntity = {
        id: draft.articleId,
        slug: draft.slug,
        entityType: draft.entityType,
        title: { en: draft.title, hi: "", gu: "", mr: "", es: "", ar: "" },
        summary: { en: draft.patientSummary || "", hi: "", gu: "", mr: "", es: "", ar: "" },
        relatedEntities: draft.metadata?.relatedEntities || [],
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
        evidenceLevel: draft.metadata?.evidenceLevel || "Level-C",
        tags: draft.metadata?.tags || [],
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
            references: draft.references || []
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
        await MemoryRepository_1.globalKmsRepository.saveEntity(publicEntity, publisher, "Administrator", changeSummary);
        result.publicWriteBack = "completed";
    }
    catch (err) {
        result.publicWriteBack = "failed";
        result.errors.push(`Public write-back failed: ${err.message}`);
        return result;
    }
    // 4. Queue Embedding Job for indexing
    try {
        const bodyText = draft.draftContent || "";
        await (0, embeddingQueue_1.queueEmbeddingJob)(draft.articleId, draft.title, draft.entityType, bodyText);
        result.indexUpdate = "completed";
    }
    catch (err) {
        result.indexUpdate = "failed";
        result.warnings.push(`Failed to queue vector index job: ${err.message || err}`);
    }
    // 5. Update draft status
    draft.status = "published";
    try {
        await saveDraft(draft, publisher);
    }
    catch (err) {
        result.publicWriteBack = "partial-failure";
        result.errors.push(`Failed to update draft status after publication: ${err.message}`);
        result.warnings.push("Draft rollback available. Public rollback pending.");
        return result;
    }
    // 6. Log publication event
    const pubEvent = {
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
        }
        catch (e) {
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
async function getPublicationEvents(articleId) {
    const db = await getFirestoreDb();
    const list = [];
    if (db) {
        try {
            let query = db.collection("knowledge_publication_events");
            if (articleId) {
                query = query.where("articleId", "==", articleId);
            }
            const snap = await query.get();
            snap.forEach((doc) => {
                list.push({ id: doc.id, ...doc.data() });
            });
        }
        catch (e) {
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
