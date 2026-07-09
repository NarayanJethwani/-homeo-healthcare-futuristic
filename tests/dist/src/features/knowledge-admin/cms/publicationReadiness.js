"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePublicationReadiness = validatePublicationReadiness;
const reviewerDirectory_1 = require("../workflow/reviewerDirectory");
const prohibitedClaims_1 = require("../../knowledge/governance/prohibitedClaims");
const MemoryRepository_1 = require("../repositories/MemoryRepository");
function containsPII(text) {
    const normalized = text.toLowerCase();
    // Emails
    if (/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(text))
        return true;
    // Phone numbers
    if (/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/.test(text))
        return true;
    // DOB / SSN keywords and dates
    if (/\b(?:dob|ssn|date\s*of\s*birth)\b/i.test(normalized))
        return true;
    // Case / Patient identifiers
    if (/\bcase\s*#?\s*\d+\b/i.test(normalized))
        return true;
    if (/\bpatient\s*#?\s*\d+\b/i.test(normalized))
        return true;
    return false;
}
/**
 * Validates a CMS draft for publication readiness.
 */
async function validatePublicationReadiness(draft) {
    const errors = [];
    const warnings = [];
    // 1. Basic Metadata presence
    if (!draft.title || draft.title.trim().length === 0) {
        errors.push("Article title is missing.");
    }
    if (!draft.slug || draft.slug.trim().length === 0) {
        errors.push("Article URL slug is missing.");
    }
    else if (!/^[a-z0-9-]+$/.test(draft.slug)) {
        errors.push("URL slug must contain only lowercase alphanumeric characters and hyphens.");
    }
    const validEntityTypes = ["disease", "symptom", "remedy", "lab-test", "faq", "research", "case-study"];
    if (!draft.entityType || !validEntityTypes.includes(draft.entityType)) {
        errors.push(`Invalid entity type '${draft.entityType}'. Must be one of: ${validEntityTypes.join(", ")}`);
    }
    // 2. Draft content existence
    if (!draft.draftContent || draft.draftContent.trim().length === 0) {
        errors.push("Article draft content body is empty.");
    }
    // 3. Summaries presence
    const isCornerstone = !!draft.metadata?.isCornerstone;
    if (!draft.patientSummary || draft.patientSummary.trim().length === 0) {
        if (isCornerstone) {
            errors.push("Cornerstone articles require a patient-friendly summary.");
        }
        else {
            warnings.push("Patient-friendly summary is empty.");
        }
    }
    if (!draft.practitionerSummary || draft.practitionerSummary.trim().length === 0) {
        if (isCornerstone) {
            errors.push("Cornerstone articles require a practitioner summary.");
        }
        else {
            warnings.push("Practitioner summary is empty.");
        }
    }
    // 4. Clinical Reviewer verification
    if (!draft.reviewer) {
        errors.push("Reviewer name is required.");
    }
    else {
        const activeReviewer = reviewerDirectory_1.EDITORIAL_REVIEWERS.some(r => r.name.toLowerCase() === draft.reviewer.toLowerCase());
        if (!activeReviewer) {
            errors.push(`Reviewer '${draft.reviewer}' is not registered in the active clinical directory.`);
        }
    }
    if (!draft.reviewerRole) {
        errors.push("Reviewer clinical specialty/role is required.");
    }
    if (!draft.clinicalReviewDate) {
        errors.push("Clinical review date is required.");
    }
    if (!draft.nextReviewDate) {
        errors.push("Next clinical review date deadline is required.");
    }
    // 5. References checks
    const refsCount = draft.references?.length || 0;
    if (draft.entityType !== "faq") {
        if (refsCount === 0) {
            errors.push("Entities (except FAQs) require at least one reference citation.");
        }
        else if (isCornerstone && refsCount < 3) {
            errors.push(`Cornerstone articles require at least 3 references (currently has ${refsCount}).`);
        }
    }
    // 6. PHI/PII check
    const fullText = [
        draft.title || "",
        draft.slug || "",
        draft.draftContent || "",
        draft.patientSummary || "",
        draft.practitionerSummary || "",
        draft.educationalSummary || "",
        draft.notes || ""
    ].join("\n");
    if (containsPII(fullText)) {
        errors.push("Potential PHI/PII (patient email, phone, case id, or birth date keyword) detected in draft fields.");
    }
    // 7. Prohibited Claims scans
    const claimMatches = (0, prohibitedClaims_1.checkProhibitedClaims)(fullText);
    if (claimMatches.length > 0) {
        errors.push(`Draft contains prohibited medical claims or guarantees: ${claimMatches.join(", ")}`);
    }
    // Conventional treatment advice check
    const lowerText = fullText.toLowerCase();
    if (lowerText.includes("stop conventional") ||
        lowerText.includes("discontinue conventional") ||
        lowerText.includes("stop allopathic") ||
        lowerText.includes("discontinue allopathic")) {
        errors.push("Draft contains prohibited advice recommending discontinuation of conventional medical treatment.");
    }
    // 8. Disclaimer / safety warnings
    const requiresDisclaimer = draft.entityType !== "faq" && draft.entityType !== "research";
    if (requiresDisclaimer) {
        const hasDisclaimerTerm = lowerText.includes("disclaimer") ||
            lowerText.includes("educational only") ||
            lowerText.includes("for clinician review") ||
            lowerText.includes("consultation with a qualified") ||
            lowerText.includes("consult with physician");
        if (!hasDisclaimerTerm) {
            errors.push("Article content must contain standard medical disclaimer references or clinician consultation warning keywords.");
        }
    }
    // 9. Slug collision prevention
    if (draft.slug) {
        const allEntities = await MemoryRepository_1.globalKmsRepository.getEntities();
        const collision = allEntities.some(e => e.slug === draft.slug && e.id !== draft.articleId);
        if (collision) {
            errors.push(`slug collision detected: Another article is already published under slug '${draft.slug}'`);
        }
    }
    // 10. SEO Metadata
    if (draft.title && draft.title.length > 70) {
        warnings.push("Title exceeds recommended SEO length of 70 characters.");
    }
    if (draft.patientSummary && (draft.patientSummary.length < 10 || draft.patientSummary.length > 160)) {
        warnings.push("Patient summary length is outside optimal SEO meta description bounds (10-160 characters).");
    }
    return {
        passed: errors.length === 0,
        errors,
        warnings
    };
}
