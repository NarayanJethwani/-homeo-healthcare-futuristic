import { NextRequest, NextResponse } from "next/server";
import { searchKnowledgeBase } from "@/features/knowledge/search/knowledgeIndex";
import { EntityType } from "@/features/knowledge/types";
import { trackSearchQuery } from "@/features/knowledge/analytics/knowledgeSearchAnalytics";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";
  const typeParam = searchParams.get("type") as EntityType | null;

  const validTypes: EntityType[] = [
    "disease",
    "symptom",
    "remedy",
    "lab-test",
    "faq",
    "research",
    "case-study",
  ];

  const typeFilter = typeParam && validTypes.includes(typeParam) ? typeParam : undefined;

  const results = searchKnowledgeBase(query, typeFilter);

  // Track the search event safely
  // (We do not await this operation to ensure zero response latency penalty)
  trackSearchQuery({
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

  return NextResponse.json({
    query,
    typeFilter: typeFilter || "all",
    resultsCount: responseData.length,
    results: responseData,
  });
}
