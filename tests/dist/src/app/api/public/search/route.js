"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const knowledgeIndex_1 = require("@/features/knowledge/search/knowledgeIndex");
const knowledgeSearchAnalytics_1 = require("@/features/knowledge/analytics/knowledgeSearchAnalytics");
async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const typeParam = searchParams.get("type");
    const validTypes = [
        "disease",
        "symptom",
        "remedy",
        "lab-test",
        "faq",
        "research",
        "case-study",
    ];
    const typeFilter = typeParam && validTypes.includes(typeParam) ? typeParam : undefined;
    const results = (0, knowledgeIndex_1.searchKnowledgeBase)(query, typeFilter);
    // Track the search event safely
    // (We do not await this operation to ensure zero response latency penalty)
    (0, knowledgeSearchAnalytics_1.trackSearchQuery)({
        query,
        resultCount: results.length,
        entityTypeFilter: typeFilter || "all",
        source: "public-site"
    }).catch(err => {
        console.error("Failed to track search query event:", err);
    });
    // Return formatted response mapping scores and matching entities
    const responseData = results.map(res => ({
        id: res.entity.id,
        slug: res.entity.slug,
        entityType: res.entity.entityType,
        title: res.entity.title,
        summary: res.entity.summary,
        score: res.score,
        matchedFields: res.matchedFields,
        canonicalUrl: res.entity.canonicalUrl,
    }));
    return server_1.NextResponse.json({
        query,
        typeFilter: typeFilter || "all",
        resultsCount: responseData.length,
        results: responseData,
    });
}
