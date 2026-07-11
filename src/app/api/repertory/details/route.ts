import { NextResponse } from "next/server";
import repertoryRepository from "@/features/repertory/database/repertoryDb";
import { REMEDIES_METADATA } from "@/lib/repertoryData";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({
        success: false,
        message: "Rubric ID is required."
      }, { status: 400 });
    }

    const rubric = await repertoryRepository.getRubricById(id);

    if (!rubric) {
      return NextResponse.json({
        success: false,
        message: "Rubric not found in active published snapshot."
      }, { status: 404 });
    }

    // Enrich remedies with full names
    const remediesEnriched: any[] = [];
    if (rubric.relatedRemedies) {
      rubric.relatedRemedies.forEach((rem) => {
        remediesEnriched.push({
          abbreviation: rem.remedyId,
          fullName: rem.remedyName || rem.remedyId,
          source: rem.keynoteReason || "Unknown",
          grade: rem.grade
        });
      });
    }

    // Sort remedies by grade descending
    remediesEnriched.sort((a, b) => b.grade - a.grade);

    return NextResponse.json({
      success: true,
      rubric: {
        ...rubric,
        remediesEnriched
      }
    });
  } catch (error: any) {
    console.error("Repertory Details API failed:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to load rubric details.",
      error: error.message || error
    }, { status: 500 });
  }
}
