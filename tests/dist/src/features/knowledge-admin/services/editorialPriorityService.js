"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateEditorialPriority = calculateEditorialPriority;
/**
 * Calculates editorial priority category and score for curating Knowledge Base articles.
 * Clinical safety issues outrank SEO issues.
 * Important: Analytics NEVER marks an article as clinically reviewed, nor can it lower citation risk parameters.
 */
function calculateEditorialPriority(meta) {
    // 1. Clinical safety warnings always outrank SEO/views and become CRITICAL
    if (meta.hasClinicalSafetyContraindications) {
        return {
            category: "Critical",
            score: 100,
            reason: "Clinical safety warning: Active contraindications or interactions require immediate review."
        };
    }
    // 2. Cornerstone + poor/warning citation health -> CRITICAL
    if (meta.isCornerstone && (meta.citationHealth === "warning" || meta.citationHealth === "Low" || meta.citationHealth === "Needs Citations" || meta.citationHealth === "error")) {
        return {
            category: "Critical",
            score: 95,
            reason: "Critical priority: Cornerstone article has weak or warning citation health score."
        };
    }
    // 3. High Clinical OS usage + needs-review/draft status -> HIGH
    if (meta.clinicalOsViews > 1000 && (meta.editorialStatus === "needs-review" || meta.editorialStatus === "draft")) {
        return {
            category: "High",
            score: 85,
            reason: "High priority: Unreviewed draft article is receiving high Clinical OS view count."
        };
    }
    // 4. Missing references / citation warning (non-cornerstone) -> MEDIUM
    if (meta.citationHealth === "warning" || meta.citationHealth === "Low" || meta.citationHealth === "Needs Citations") {
        return {
            category: "Medium",
            score: 65,
            reason: "Medium priority: Reference update needed. Article has weak citation health score."
        };
    }
    // 5. High search impressions + low CTR -> MEDIUM (SEO improvement opportunity)
    if (meta.searchImpressions > 5000 && meta.searchCtr < 0.015) {
        return {
            category: "Medium",
            score: 55,
            reason: "Medium priority: SEO improvement suggestion. High organic impressions but click-through rate is below 1.5%."
        };
    }
    // Default priority
    return {
        category: "Low",
        score: 25,
        reason: "Low priority: Article is healthy or has low practitioner traffic."
    };
}
