"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runQualityDashboardAudit = runQualityDashboardAudit;
const index_1 = require("../index");
const citations_1 = require("../content/citations");
const entityRelationships_1 = require("../graph/entityRelationships");
function runQualityDashboardAudit() {
    const entities = (0, index_1.getAllKnowledgeEntities)();
    const allIds = new Set(entities.map(e => e.id));
    const citationIds = new Set(citations_1.CITATIONS.map(c => c.id));
    // Count relationships per node
    const connectionCounts = new Map();
    entities.forEach(e => connectionCounts.set(e.id, 0));
    entityRelationships_1.KNOWLEDGE_RELATIONSHIPS.forEach(rel => {
        if (allIds.has(rel.source)) {
            connectionCounts.set(rel.source, (connectionCounts.get(rel.source) || 0) + 1);
        }
        if (allIds.has(rel.target)) {
            connectionCounts.set(rel.target, (connectionCounts.get(rel.target) || 0) + 1);
        }
    });
    const metrics = [];
    let totalScoreSum = 0;
    let healthyPagesCount = 0;
    entities.forEach(e => {
        const titleStr = typeof e.title === "string" ? e.title : e.title.en;
        const content = e.content || {};
        const issues = [];
        // 1. Specificity Score
        let specificityScore = 100;
        const overview = content.overview || content.description || content.definition || "";
        const genericPhrases = [
            "outpatient clinics",
            "common clinical condition",
            "defined clinically as a pathological",
            "typical physical symptoms",
            "diagnosed based on patient clinical",
            "standard conventional therapy"
        ];
        let genericCount = 0;
        genericPhrases.forEach(phrase => {
            if (overview.toLowerCase().includes(phrase) || JSON.stringify(content).toLowerCase().includes(phrase)) {
                genericCount++;
            }
        });
        if (genericCount > 0) {
            specificityScore = Math.max(0, 100 - genericCount * 25);
            issues.push(`Contains ${genericCount} generic template/placeholder phrases.`);
        }
        // 2. Citation Quality Score
        let citationQualityScore = 100;
        const refs = content.references || [];
        if (refs.length === 0) {
            citationQualityScore = 0;
            issues.push("No reference citations linked.");
        }
        else {
            // Check for mismatched citations
            const isThyroid = e.id.match(/(L0002|L0003|L0004|L0026|L0027|L0028|D0011|D0012|S0006)/) || titleStr.toLowerCase().includes("thyroid") || titleStr.toLowerCase().includes("tpo") || titleStr.toLowerCase().includes("tsh");
            const isGerd = e.id.match(/(D0001|D0004|D0008|S0001|R0002|R0003)/) || titleStr.toLowerCase().includes("gerd") || titleStr.toLowerCase().includes("gastritis") || titleStr.toLowerCase().includes("reflux");
            refs.forEach((refId) => {
                if (!citationIds.has(refId)) {
                    citationQualityScore = Math.max(0, citationQualityScore - 40);
                    issues.push(`Linked reference citation ID '${refId}' is missing from the citations registry.`);
                }
                else {
                    // Check alignment
                    if (isThyroid && refId === "CIT-0002") { // CIT-0002 is Atopic Dermatitis
                        citationQualityScore = Math.max(0, citationQualityScore - 30);
                        issues.push(`Citation mismatch: Thyroid page is referencing Atopic Dermatitis study (CIT-0002).`);
                    }
                    if (isGerd && refId === "CIT-0002") {
                        citationQualityScore = Math.max(0, citationQualityScore - 30);
                        issues.push(`Citation mismatch: Gastrointestinal page is referencing Atopic Dermatitis study (CIT-0002).`);
                    }
                }
            });
        }
        // 3. FAQ Score
        let faqScore = 100;
        const faqs = content.faqs || [];
        if (faqs.length === 0) {
            faqScore = 0;
            issues.push("Missing page-specific FAQs.");
        }
        else if (faqs.length < 3) {
            faqScore = 50;
            issues.push(`Low FAQ count: Page has only ${faqs.length} FAQs (recommended minimum is 3).`);
        }
        // 4. Connection Score
        const connectionCount = connectionCounts.get(e.id) || 0;
        let connectionScore = 100;
        if (connectionCount < 6) {
            connectionScore = Math.min(100, Math.round((connectionCount / 6) * 100));
            issues.push(`Low connectivity: Has only ${connectionCount} connections (minimum recommended is 6).`);
        }
        // 5. SEO Score
        let seoScore = 100;
        const summaryStr = typeof e.summary === "string" ? e.summary : e.summary.en;
        if (!summaryStr || summaryStr.length < 40 || summaryStr.length > 160) {
            seoScore = 70;
            issues.push("Meta description length is non-optimal (should be 40-160 characters).");
        }
        // Compute composite score
        const compositeScore = Math.round(specificityScore * 0.3 +
            citationQualityScore * 0.2 +
            faqScore * 0.2 +
            connectionScore * 0.15 +
            seoScore * 0.15);
        if (compositeScore >= 90 && issues.length === 0) {
            healthyPagesCount++;
        }
        totalScoreSum += compositeScore;
        metrics.push({
            entityId: e.id,
            title: titleStr,
            type: e.entityType,
            specificityScore,
            citationQualityScore,
            faqScore,
            connectionCount,
            connectionScore,
            seoScore,
            compositeScore,
            issues
        });
    });
    const averageScore = Math.round(totalScoreSum / entities.length);
    const weakPages = metrics
        .filter(m => m.compositeScore < 80)
        .sort((a, b) => a.compositeScore - b.compositeScore);
    return {
        totalEntities: entities.length,
        averageScore,
        weakPages,
        healthyPagesCount,
        metrics
    };
}
if (require.main === module) {
    const result = runQualityDashboardAudit();
    console.log("\n=======================================================");
    console.log("      CLINICAL CONTENT QUALITY AUDIT DASHBOARD");
    console.log("=======================================================");
    console.log(`Total Knowledge Entities Audited : ${result.totalEntities}`);
    console.log(`Overall Platform Quality Score    : ${result.averageScore} / 100`);
    console.log(`Healthy, Audit-Pass Pages        : ${result.healthyPagesCount} / ${result.totalEntities}`);
    console.log(`Weak Pages requiring attention   : ${result.weakPages.length}`);
    console.log("-------------------------------------------------------");
    if (result.weakPages.length > 0) {
        console.log("\n--- Bottom 10 Weakest Pages ---");
        result.weakPages.slice(0, 10).forEach(wp => {
            console.log(`[Score: ${wp.compositeScore}/100] ${wp.entityId} (${wp.title}) - Type: ${wp.type}`);
            wp.issues.forEach(iss => console.log(`  - ${iss}`));
        });
    }
}
