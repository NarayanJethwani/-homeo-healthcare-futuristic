import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { REMEDIES_METADATA } from "@/lib/repertoryData";

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

    const docRef = getAdminDb().collection("rubrics").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({
        success: false,
        message: "Rubric not found."
      }, { status: 404 });
    }

    const rubric = docSnap.data();
    if (!rubric) {
      return NextResponse.json({
        success: false,
        message: "Rubric data is empty."
      }, { status: 404 });
    }

    // Enrich remedies with full names
    const remediesEnriched: any[] = [];
    if (rubric.remedies) {
      Object.entries(rubric.remedies).forEach(([abbrev, grade]) => {
        const meta = REMEDIES_METADATA[abbrev] || { fullName: abbrev, source: "Unknown" };
        remediesEnriched.push({
          abbreviation: abbrev,
          fullName: meta.fullName,
          source: meta.source,
          grade
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
