import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { RepertoryScoring } from "@/features/repertory/scoring/repertoryScoring";
import { ReasoningEngine } from "@/features/repertory/reasoning/reasoningEngine";
import repertoryRepository from "@/features/repertory/database/repertoryDb";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { patientId = "anonymous", userId = "unknown", selectedRubrics } = await request.json();

    if (!selectedRubrics || !Array.isArray(selectedRubrics) || selectedRubrics.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No rubrics selected for repertorization."
      }, { status: 400 });
    }

    // Validate all rubric IDs exist in active published corpus
    const validatedSymptoms = [];
    for (const symptom of selectedRubrics) {
      const rub = await repertoryRepository.getRubricById(symptom.rubricId);
      if (!rub) {
        return NextResponse.json({
          success: false,
          message: `Unknown or unpublished rubric ID: ${symptom.rubricId}`
        }, { status: 400 });
      }
      validatedSymptoms.push({
        rubricId: symptom.rubricId,
        severity: symptom.severity ?? 5,
        frequency: symptom.frequency || 'constant',
        impact: symptom.impact || 'moderate'
      });
    }

    // Calculate scoring using the canonical scoring engine
    const scoringResult = await RepertoryScoring.calculateRepertorization(validatedSymptoms);

    // Compute remedy differentiations
    let differentiations: any[] = [];
    if (scoringResult.topRemedies.length > 0) {
      const topIds = scoringResult.topRemedies.slice(0, 3).map(r => r.remedyId);
      const activeIds = validatedSymptoms.map(s => s.rubricId);
      differentiations = await RepertoryScoring.differentiateRemedies(topIds, activeIds);
    }

    // Generate reasoning
    const reasoningSummary = await ReasoningEngine.generateReasoning(validatedSymptoms, scoringResult);

    // Build validation findings
    const validationFindings: any[] = [];
    const rubricDetails = await Promise.all(validatedSymptoms.map(s => repertoryRepository.getRubricById(s.rubricId)));
    const categories = rubricDetails.filter((r): r is NonNullable<typeof r> => r !== null && r !== undefined).map(r => r.category);

    const thermals = rubricDetails.filter(r => r && r.category === 'Thermal State');
    if (thermals.length > 1) {
      const hasChilly = thermals.some(t => t?.subCategory === 'Chilly');
      const hasWarm = thermals.some(t => t?.subCategory === 'Warm');
      if (hasChilly && hasWarm) {
        validationFindings.push({
          severity: "critical",
          category: "contradiction",
          message: "Conflicting thermal states selected: Patient cannot be both cold-sensitive (Chilly) and heat-sensitive (Warm).",
          relatedRubricIds: thermals.filter((t): t is NonNullable<typeof t> => t !== undefined).map(t => t.rubricId)
        });
      }
    }

    if (!categories.includes('Thermal State')) {
      validationFindings.push({
        severity: "warning",
        category: "missing_information",
        message: "Missing crucial constitutional general: Patient's Thermal State (Chilly / Warm) has not been specified."
      });
    }

    // Safety checks / Contraindications
    const contraindications: string[] = [];
    validatedSymptoms.forEach(sym => {
      const rub = rubricDetails.find(r => r && r.rubricId === sym.rubricId);
      if (!rub) return;
      rub.relatedRemedies.forEach(rem => {
        if (rem.contraindicationNotes) {
          const isTopRemedy = scoringResult.topRemedies.slice(0, 3).some(tr => tr.remedyId === rem.remedyId);
          if (isTopRemedy) {
            const msg = `Contraindication for ${rem.remedyName}: ${rem.contraindicationNotes}`;
            contraindications.push(msg);
            validationFindings.push({
              severity: "critical",
              category: "safety",
              message: msg,
              relatedRemedyIds: [rem.remedyId],
              relatedRubricIds: [sym.rubricId]
            });
          }
        }
      });
    });

    const clinicalWarnings = [
      ...contraindications,
      ...(reasoningSummary.safetyLabel ? [reasoningSummary.safetyLabel] : [])
    ];

    const finalResponse = {
      success: true,
      runId: `clinical-analysis-${Date.now()}`,
      remedyRankings: scoringResult.topRemedies.map((tr, index) => ({
        remedyId: tr.remedyId,
        remedyName: tr.remedyName,
        rank: index + 1,
        score: tr.score,
        confidence: tr.confidence,
        coverage: tr.matches,
        contributingRubricIds: [],
        missingRubricIds: [],
        explanation: [tr.kingdom || "", tr.miasm || "", tr.thermal || ""]
      })),
      validationFindings,
      clinicalWarnings,
      missingInformation: scoringResult.missingDataNeeded,
      confidenceAssessment: {
        score: scoringResult.confidenceScore,
        explanation: `Analysis margin confidence index is ${scoringResult.confidenceScore}%.`
      },
      scoringResult,
      differentiations,
      reasoningSummary
    };

    // Save session to Firestore
    try {
      const db = getAdminDb();
      if (db) {
        const sessionId = `session_${patientId}_${Date.now()}`;
        const sessionDoc = {
          id: sessionId,
          patientId,
          userId,
          rubrics: selectedRubrics,
          results: scoringResult.topRemedies.reduce((acc, curr) => {
            acc[curr.remedyId] = { score: curr.score, coverage: `${curr.matches}/${selectedRubrics.length}` };
            return acc;
          }, {} as Record<string, any>),
          createdAt: new Date().toISOString()
        };
        await db.collection("repertorization_sessions").doc(sessionId).set(sessionDoc);
      }
    } catch (e) {
      console.warn("Failed to save session to Firestore:", e);
    }

    return NextResponse.json(finalResponse);
  } catch (error: any) {
    console.error("Repertorization API failed:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to run case repertorization.",
      error: error.message || error
    }, { status: 500 });
  }
}
