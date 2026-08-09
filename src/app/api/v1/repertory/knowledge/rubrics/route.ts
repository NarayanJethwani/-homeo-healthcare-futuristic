import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { resolveApiContext } from "@/features/repertory/access/resolveContext";
import { getKnowledgeAccessService } from "@/features/repertory/application/KnowledgeAccessService";
import { PublishedCorpusRepository } from "@/features/repertory/repositories/PublishedCorpusRepository";
import { RepertoryChapterId, RepertoryEditionId } from "@/features/repertory/types/repertoryTypes";
import { CANONICAL_REPERTORY_DATABASE } from "@/features/consultation/services/repertoryConsultationAdapter";
import {
  getCorpusChapterIds,
  mapPublishedRubric,
  toCorpusSourceId,
  UI_TO_CORPUS_SOURCE_ID,
} from "@/features/consultation/services/repertoryCorpusMapper";

export const dynamic = "force-dynamic";

const LegacyQuerySchema = z.object({
  editionId: z.string().min(1).max(50).regex(/^[a-zA-Z0-9_-]+$/).transform((value) => value as RepertoryEditionId),
  chapterId: z.string().min(1).max(100).transform((value) => value as RepertoryChapterId),
  limit: z.preprocess((value) => (value ? Number(value) : undefined), z.number().int().min(1).max(100).optional().default(50)),
  cursor: z.string().optional(),
});

const SearchQuerySchema = z.object({
  query: z.string().max(200),
  source: z.string().max(80).regex(/^[a-zA-Z0-9_-]+$/).optional(),
  chapter: z.string().max(100).regex(/^[a-zA-Z0-9 _&(),-]+$/).optional(),
});

function filterCanonicalRubrics(query: string, chapter?: string, source?: string) {
  const terms = query.split(/\s+/).filter(Boolean);
  return CANONICAL_REPERTORY_DATABASE.filter((item) => {
    const fullText = `${item.chapterName} ${item.rubricPath.join(" ")} ${item.sourceTitle} ${item.rubricId}`.toLowerCase();
    const matchesQuery = !query || fullText.includes(query) || terms.every((term) => fullText.includes(term));
    const matchesChapter = !chapter || chapter === "all" || item.chapterName.toLowerCase().includes(chapter.toLowerCase());
    const matchesSource = !source || source === "all" || item.sourceId === source;
    return matchesQuery && matchesChapter && matchesSource;
  });
}

async function queryPublishedCorpus(query: string, uiSource?: string, uiChapter?: string) {
  const requestedCorpusSource = toCorpusSourceId(uiSource);
  if (uiSource && uiSource !== "all" && !requestedCorpusSource) {
    return { available: true, rubrics: [] };
  }

  const corpusSources = requestedCorpusSource
    ? [requestedCorpusSource]
    : Object.values(UI_TO_CORPUS_SOURCE_ID);
  const batches = [];

  if (query) {
    if (!uiChapter || uiChapter === "all") {
      batches.push(
        PublishedCorpusRepository.searchRubrics(
          query,
          requestedCorpusSource ? { sourceId: requestedCorpusSource } : undefined
        )
      );
    } else {
      for (const corpusSource of corpusSources) {
        for (const chapterId of getCorpusChapterIds(corpusSource, uiChapter)) {
          batches.push(PublishedCorpusRepository.searchRubrics(query, { sourceId: corpusSource, organSystem: chapterId }));
        }
      }
    }
  } else if (uiChapter && uiChapter !== "all") {
    for (const corpusSource of corpusSources) {
      for (const chapterId of getCorpusChapterIds(corpusSource, uiChapter)) {
        batches.push(PublishedCorpusRepository.getRubrics({ sourceId: corpusSource, organSystem: chapterId }));
      }
    }
  }

  if (batches.length === 0) {
    return { available: true, rubrics: [] };
  }

  try {
    const records = (await Promise.all(batches)).flat();
    const uniqueRecords = Array.from(new Map(records.map((record) => [record.rubricId, record])).values());
    return { available: true, rubrics: uniqueRecords.map(mapPublishedRubric) };
  } catch (error) {
    console.warn("Published repertory corpus unavailable; using consultation fallback:", error);
    return { available: false, rubrics: [] };
  }
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const requestId = `req_${crypto.randomUUID()}`;

  try {
    const auth = await resolveApiContext(request, "repertory.review.read");
    if (!auth.authorized || !auth.context) {
      return auth.response || NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const rawQuery = searchParams.get("q") ?? searchParams.get("query");
    const rawChapter = searchParams.get("chapter");
    const isConsultationSearch = rawQuery !== null || rawChapter !== null;

    if (!isConsultationSearch) {
      const validated = LegacyQuerySchema.safeParse({
        editionId: searchParams.get("editionId") || undefined,
        chapterId: searchParams.get("chapterId") || undefined,
        limit: searchParams.get("limit") || undefined,
        cursor: searchParams.get("cursor") || undefined,
      });

      if (!validated.success) {
        return NextResponse.json(
          {
            metadata: { requestId, generatedAt: new Date().toISOString(), durationMs: Date.now() - startTime },
            error: { code: "INVALID_INPUT", message: "Invalid query parameters.", details: validated.error.flatten() },
          },
          { status: 400 }
        );
      }

      const { editionId, chapterId, limit, cursor } = validated.data;
      const result = await getKnowledgeAccessService().getRubricsByChapter(
        auth.context,
        editionId,
        chapterId,
        { limit, position: cursor }
      );

      return NextResponse.json({
        metadata: {
          requestId,
          generatedAt: new Date().toISOString(),
          durationMs: Date.now() - startTime,
          pagination: { hasNextPage: result.hasNextPage, nextCursor: result.nextCursor },
          sourceVersions: { active: result.sourceVersion },
        },
        data: result.items,
      });
    }

    const validated = SearchQuerySchema.safeParse({
      query: (rawQuery || "").trim().toLowerCase(),
      source: searchParams.get("source") || undefined,
      chapter: rawChapter || undefined,
    });
    if (!validated.success) {
      return NextResponse.json(
        {
          metadata: { requestId, generatedAt: new Date().toISOString(), durationMs: Date.now() - startTime },
          error: { code: "INVALID_INPUT", message: "Invalid repertory search parameters.", details: validated.error.flatten() },
        },
        { status: 400 }
      );
    }

    const { query, source, chapter } = validated.data;
    const published = await queryPublishedCorpus(query, source, chapter);
    const corpusBackedSource = Boolean(toCorpusSourceId(source));
    const canonical = !published.available || !source || source === "all" || !corpusBackedSource
      ? filterCanonicalRubrics(query, chapter, source).filter((item) => {
          if (!published.available || (source && source !== "all")) return true;
          return !toCorpusSourceId(item.sourceId);
        })
      : [];

    const rubrics = Array.from(
      new Map([...published.rubrics, ...canonical].map((item) => [item.rubricId, item])).values()
    );

    return NextResponse.json({
      metadata: {
        requestId,
        generatedAt: new Date().toISOString(),
        durationMs: Date.now() - startTime,
        total: rubrics.length,
        source: published.available ? "published_corpus" : "canonical_fallback",
      },
      rubrics,
    });
  } catch (error: any) {
    const isAccessDenied = error?.message?.includes("Access denied");
    return NextResponse.json(
      {
        metadata: { requestId, generatedAt: new Date().toISOString(), durationMs: Date.now() - startTime },
        error: {
          code: isAccessDenied ? "FORBIDDEN" : "INTERNAL_ERROR",
          message: error?.message || "Failed to retrieve rubrics.",
        },
      },
      { status: isAccessDenied ? 403 : 500 }
    );
  }
}
