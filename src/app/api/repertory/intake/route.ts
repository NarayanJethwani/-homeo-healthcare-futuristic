import { NextRequest, NextResponse } from "next/server";
import { RepertorySearch } from "@/features/repertory/search/repertorySearch";
import { PublishedCorpusRepository } from "@/features/repertory/repositories/PublishedCorpusRepository";
import { JETHWANI_REPERTORY_DATA } from "@/lib/repertoryData";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const intakeText = (body.text || body.intakeText || body.nlpInput || "").trim();

    if (!intakeText) {
      return NextResponse.json({
        success: true,
        nlpPhrase: "",
        matchedRubrics: [],
        suggestedRemedies: [],
        missingClarificationQuestions: [],
        repertoryScore: 0,
        rubrics: []
      });
    }

    const result = await RepertorySearch.parseAIIntakeText(intakeText);

    // Fetch full rubric details for all matched rubrics
    const rubricIds = result.matchedRubrics.map(m => m.rubricId);
    const rubricsMap = new Map<string, any>();

    for (const id of rubricIds) {
      try {
        const r = await PublishedCorpusRepository.getRubricById(id);
        if (r) {
          rubricsMap.set(id, r);
        }
      } catch (_e) {
        // Ignore single rubric fetch failures
      }
    }

    // Fallback to local Jethwani rubrics for any missing IDs
    for (const id of rubricIds) {
      if (!rubricsMap.has(id)) {
        const fallback = JETHWANI_REPERTORY_DATA.find(j => j.id === id);
        if (fallback) {
          rubricsMap.set(id, {
            rubricId: fallback.id,
            id: fallback.id,
            title: fallback.name,
            displayText: fallback.name,
            classicalWording: fallback.name,
            plainLanguageMeaning: fallback.name,
            category: fallback.section === "Section A" ? "Mental & Emotional" : "Physical Symptoms",
            organSystem: "General",
            severity: 5,
            frequency: "frequent",
            impact: "moderate",
            synonyms: [],
            clinicalKeywords: [],
            patientExpressions: [],
            relatedRemedies: Object.entries(fallback.remedies || {}).map(([rem, grade]) => ({
              remedyId: rem,
              remedyName: rem,
              grade
            }))
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      ...result,
      rubrics: Array.from(rubricsMap.values())
    });
  } catch (error: any) {
    console.error("AI Repertory Intake route error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to parse AI clinical intake." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const intakeText = (searchParams.get("text") || searchParams.get("q") || "").trim();

    if (!intakeText) {
      return NextResponse.json({
        success: true,
        nlpPhrase: "",
        matchedRubrics: [],
        suggestedRemedies: [],
        missingClarificationQuestions: [],
        repertoryScore: 0,
        rubrics: []
      });
    }

    const result = await RepertorySearch.parseAIIntakeText(intakeText);
    const rubricIds = result.matchedRubrics.map(m => m.rubricId);
    const rubricsMap = new Map<string, any>();

    for (const id of rubricIds) {
      try {
        const r = await PublishedCorpusRepository.getRubricById(id);
        if (r) rubricsMap.set(id, r);
      } catch (_e) {}
    }

    for (const id of rubricIds) {
      if (!rubricsMap.has(id)) {
        const fallback = JETHWANI_REPERTORY_DATA.find(j => j.id === id);
        if (fallback) {
          rubricsMap.set(id, {
            rubricId: fallback.id,
            id: fallback.id,
            title: fallback.name,
            displayText: fallback.name,
            classicalWording: fallback.name,
            plainLanguageMeaning: fallback.name,
            category: fallback.section === "Section A" ? "Mental & Emotional" : "Physical Symptoms",
            organSystem: "General",
            severity: 5,
            frequency: "frequent",
            impact: "moderate",
            synonyms: [],
            clinicalKeywords: [],
            patientExpressions: [],
            relatedRemedies: Object.entries(fallback.remedies || {}).map(([rem, grade]) => ({
              remedyId: rem,
              remedyName: rem,
              grade
            }))
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      ...result,
      rubrics: Array.from(rubricsMap.values())
    });
  } catch (error: any) {
    console.error("AI Repertory Intake GET error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to parse AI clinical intake." },
      { status: 500 }
    );
  }
}
