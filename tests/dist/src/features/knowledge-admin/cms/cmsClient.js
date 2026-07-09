"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDraft = getDraft;
exports.saveDraft = saveDraft;
exports.getVersions = getVersions;
exports.rollbackToVersion = rollbackToVersion;
exports.approveClinicalReview = approveClinicalReview;
exports.publishArticle = publishArticle;
exports.getPublicationEvents = getPublicationEvents;
async function getDraft(articleId) {
    const res = await fetch(`/api/admin/cms?action=getDraft&articleId=${encodeURIComponent(articleId)}`);
    if (!res.ok)
        return null;
    const data = await res.json();
    return data.draft || null;
}
async function saveDraft(draftData, actor) {
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
async function getVersions(articleId) {
    const res = await fetch(`/api/admin/cms?action=getVersions&articleId=${encodeURIComponent(articleId)}`);
    if (!res.ok)
        return [];
    const data = await res.json();
    return data.versions || [];
}
async function rollbackToVersion(versionId, actor, confirmRollback) {
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
async function approveClinicalReview(articleId, reviewer, reviewerRole, reviewDate, nextReviewDate, notes, actor) {
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
async function publishArticle(articleId, publisher, changeSummary, confirmPublish) {
    const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "publishArticle", articleId, publisher, changeSummary, confirmPublish })
    });
    const data = await res.json();
    return data;
}
async function getPublicationEvents(articleId) {
    const url = articleId
        ? `/api/admin/cms?action=getPublications&articleId=${encodeURIComponent(articleId)}`
        : "/api/admin/cms?action=getPublications";
    const res = await fetch(url);
    if (!res.ok)
        return [];
    const data = await res.json();
    return data.publications || [];
}
