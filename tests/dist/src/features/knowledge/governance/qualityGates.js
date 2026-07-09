"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQualityGates = validateQualityGates;
const prohibitedClaims_1 = require("./prohibitedClaims");
const REQUIRED_LOCALES = ["en"]; // English is mandatory. Others are optional/fallback.
/**
 * Validates if an entity meets all editorial quality gates before publication.
 */
function validateQualityGates(entity, allEntityIds) {
    const errors = [];
    // 1. Entity ID format
    const validIdPrefixes = ["DIS-", "SYM-", "REM-", "LAB-", "FAQ-", "RES-", "CAS-"];
    const hasValidPrefix = validIdPrefixes.some(prefix => entity.id.startsWith(prefix));
    if (!hasValidPrefix) {
        errors.push(`Entity ID '${entity.id}' must start with one of: ${validIdPrefixes.join(", ")}`);
    }
    // 2. Slug and Canonical URL alignment
    if (!entity.slug || typeof entity.slug !== "string") {
        errors.push("Entity must have a non-empty string slug.");
    }
    const pluralType = entity.entityType === "research"
        ? "research"
        : entity.entityType === "case-study"
            ? "case-studies"
            : entity.entityType === "remedy"
                ? "remedies"
                : entity.entityType + "s";
    const expectedUrl = `https://homeo.healthcare/knowledge/${pluralType}/${entity.slug}`;
    if (!entity.canonicalUrl || entity.canonicalUrl !== expectedUrl) {
        errors.push(`Canonical URL '${entity.canonicalUrl}' does not match consistent expected path '${expectedUrl}'`);
    }
    // 3. Localized Title and Summary checks
    for (const locale of REQUIRED_LOCALES) {
        if (!entity.title?.[locale]) {
            errors.push(`Missing title for required locale '${locale}'`);
        }
        if (!entity.summary?.[locale]) {
            errors.push(`Missing summary for required locale '${locale}'`);
        }
    }
    // 4. Prohibited claims validator
    const titleClaims = (0, prohibitedClaims_1.checkProhibitedClaims)(entity.title);
    const summaryClaims = (0, prohibitedClaims_1.checkProhibitedClaims)(entity.summary);
    const contentClaims = (0, prohibitedClaims_1.checkProhibitedClaims)(entity.content);
    if (titleClaims.length > 0) {
        errors.push(`Title contains prohibited claims: ${titleClaims.join(", ")}`);
    }
    if (summaryClaims.length > 0) {
        errors.push(`Summary contains prohibited claims: ${summaryClaims.join(", ")}`);
    }
    if (contentClaims.length > 0) {
        errors.push(`Content contains prohibited claims: ${contentClaims.join(", ")}`);
    }
    // 5. Medical Reviewer metadata
    if (!entity.reviewer?.name) {
        errors.push("Reviewer name is required.");
    }
    if (!entity.reviewer?.credentials) {
        errors.push("Reviewer credentials (e.g. MD(Hom)) are required.");
    }
    if (!entity.reviewer?.specialty) {
        errors.push("Reviewer clinical specialty is required.");
    }
    // 6. Review dates
    if (!entity.versionInfo?.reviewed) {
        errors.push("Entity last reviewed date is required.");
    }
    if (!entity.versionInfo?.updated) {
        errors.push("Entity last updated date is required.");
    }
    // 7. Medical Disclaimer Check
    // Each entity must contain or explicitly set a medical safety warning
    const contentStr = JSON.stringify(entity.content || {}).toLowerCase();
    const hasDisclaimerTerm = contentStr.includes("disclaimer") ||
        contentStr.includes("educational only") ||
        contentStr.includes("for clinician review") ||
        contentStr.includes("consultation with a qualified") ||
        entity.entityType === "faq" ||
        entity.entityType === "research";
    if (!hasDisclaimerTerm) {
        errors.push("Entity content must contain standard medical disclaimer references or clinician consultation warning keywords.");
    }
    // 8. References
    if (entity.entityType !== "faq" && (!entity.content?.references || entity.content.references.length === 0)) {
        errors.push("Entities (except FAQs) require at least one reference citation.");
    }
    // 9. Internal relationship target validation (if all IDs are provided)
    if (allEntityIds && entity.content?.relatedEntities) {
        for (const targetId of entity.content.relatedEntities) {
            if (!allEntityIds.includes(targetId)) {
                errors.push(`Related entity ID '${targetId}' does not exist in the platform index.`);
            }
        }
    }
    return {
        passed: errors.length === 0,
        errors,
    };
}
