import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(request: Request) {
  try {
    const { patientId = "anonymous", userId = "unknown", selectedRubrics } = await request.json();

    if (!selectedRubrics || !Array.isArray(selectedRubrics) || selectedRubrics.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No rubrics selected for repertorization."
      }, { status: 400 });
    }

    const rubricsRef = adminDb.collection("rubrics");
    const scores: Record<string, { coverage: number; score: number; remedy: string }> = {};

    for (const activeSymptom of selectedRubrics) {
      const { rubricId, severity, frequency, impact } = activeSymptom;
      
      const docSnap = await rubricsRef.doc(rubricId).get();
      if (!docSnap.exists) continue;
      const rubric = docSnap.data();
      if (!rubric || !rubric.remedies) continue;

      const freqMult = frequency === 'constant' ? 1.2 : frequency === 'frequent' ? 1.0 : 0.8;
      const impMult = impact === 'severe' ? 1.2 : impact === 'moderate' ? 1.0 : 0.8;
      const symptomWeight = (severity / 10) * freqMult * impMult;

      Object.entries(rubric.remedies).forEach(([rem, grade]) => {
        const gradeNum = grade as number;
        if (gradeNum < 0) {
          if (!scores[rem]) {
            scores[rem] = { coverage: 0, score: -100, remedy: rem };
          } else {
            scores[rem].score -= 100;
          }
          return;
        }

        const matchPoints = gradeNum * symptomWeight * 10;

        if (!scores[rem]) {
          scores[rem] = { coverage: 1, score: matchPoints, remedy: rem };
        } else {
          scores[rem].coverage += 1;
          scores[rem].score += matchPoints;
        }
      });
    }

    const totalSymptoms = selectedRubrics.length;
    const resultList = Object.values(scores).map(item => {
      let scorePercentage = (item.score / (totalSymptoms * 30)) * 100;
      scorePercentage = Math.max(0, Math.min(100, scorePercentage * 2.2));

      return {
        remedy: item.remedy,
        coverage: `${item.coverage}/${totalSymptoms}`,
        coverageCount: item.coverage,
        score: Math.round(scorePercentage)
      };
    });

    // Sort by score descending, then coverage count descending
    resultList.sort((a, b) => b.score - a.score || b.coverageCount - a.coverageCount);

    // Save session to Firestore
    const sessionId = `session_${patientId}_${Date.now()}`;
    const sessionDoc = {
      id: sessionId,
      patientId,
      userId,
      rubrics: selectedRubrics,
      results: resultList.reduce((acc, curr) => {
        acc[curr.remedy] = { score: curr.score, coverage: curr.coverage };
        return acc;
      }, {} as Record<string, any>),
      createdAt: new Date().toISOString()
    };

    await adminDb.collection("repertorization_sessions").doc(sessionId).set(sessionDoc);

    return NextResponse.json({
      success: true,
      sessionId,
      results: resultList
    });
  } catch (error: any) {
    console.error("Repertorization API failed:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to run case repertorization.",
      error: error.message || error
    }, { status: 500 });
  }
}
