import { NextRequest, NextResponse } from "next/server";
import { RepertorySearch } from "@/features/repertory/search/repertorySearch";
import { PublishedCorpusRepository } from "@/features/repertory/repositories/PublishedCorpusRepository";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Server-side cache for search results to maximize performance
const searchCache = new Map<string, { response: any; version: string; expiry: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.toLowerCase().trim() || "";
    const category = searchParams.get("category") || "All";
    const organSystem = searchParams.get("organSystem") || "All";
    const miasm = searchParams.get("miasm") || "All";
    const remedy = searchParams.get("remedy") || "All";
    const sourceId = searchParams.get("sourceId") || "All";
    
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const pageSize = Math.max(1, Math.min(100, Number(searchParams.get("pageSize")) || 50));

    const activeVersion = await PublishedCorpusRepository.getActiveVersion();

    // Cache key construction
    const cacheKey = `${activeVersion}:${q}:${category}:${organSystem}:${miasm}:${remedy}:${sourceId}:${page}:${pageSize}`;
    const cached = searchCache.get(cacheKey);

    if (cached && cached.version === activeVersion && Date.now() < cached.expiry) {
      console.log(`[repertory-search] Serving cached results for: ${cacheKey}`);
      return NextResponse.json(cached.response);
    }

    // Call server-side search engine
    const searchFilters = {
      category: category !== "All" ? category : undefined,
      organSystem: organSystem !== "All" ? organSystem : undefined,
      miasm: miasm !== "All" ? miasm : undefined,
      remedy: remedy !== "All" ? remedy : undefined,
      sourceId: sourceId !== "All" ? sourceId : undefined,
    };

    const scoredRubrics = await RepertorySearch.searchRubrics(q, searchFilters, true, true);
    
    // Sort and map candidates
    const mappedRubrics = scoredRubrics.map(item => ({
      rubricId: item.rubric.rubricId,
      id: item.rubric.rubricId,
      title: item.rubric.title,
      displayText: item.rubric.displayText || item.rubric.title,
      classicalWording: item.rubric.classicalWording,
      category: item.rubric.category,
      organSystem: item.rubric.organSystem,
      source: item.rubric.source,
      sourceId: item.rubric.sourceId,
      author: item.rubric.author,
      sourceCitation: item.rubric.sourceCitation,
      remedies: item.rubric.relatedRemedies.reduce((acc, curr) => {
        acc[curr.remedyId] = curr.grade;
        return acc;
      }, {} as Record<string, number>),
      score: item.score,
    }));

    const total = mappedRubrics.length;
    const startIndex = (page - 1) * pageSize;
    const paginatedRubrics = mappedRubrics.slice(startIndex, startIndex + pageSize);

    const responsePayload = {
      success: true,
      activeVersion,
      count: paginatedRubrics.length,
      total,
      page,
      pageSize,
      rubrics: paginatedRubrics,
    };

    // Store in cache
    searchCache.set(cacheKey, {
      response: responsePayload,
      version: activeVersion,
      expiry: Date.now() + CACHE_TTL_MS,
    });

    // Housekeeping: remove expired cache items
    const now = Date.now();
    for (const [key, val] of searchCache.entries()) {
      if (val.version !== activeVersion || now > val.expiry) {
        searchCache.delete(key);
      }
    }

    return NextResponse.json(responsePayload);
  } catch (error: any) {
    console.error("Repertory Search API failed:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to search rubrics.",
      error: error.message || error,
    }, { status: 500 });
  }
}
