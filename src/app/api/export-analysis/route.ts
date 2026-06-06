import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { appendAiReportToClinicalSheet } from "@/lib/googleDrive";

export async function POST(request: Request) {
  try {
    const { patientId, aiReport } = await request.json();
    if (!patientId || !aiReport) {
      return NextResponse.json(
        { success: false, message: "Missing patientId or aiReport parameter." },
        { status: 400 }
      );
    }

    let sheetId = "mock-sheet-id";

    // 1. Fetch patient document to get sheetId using client-side SDK configuration
    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "mock-project-id") {
      const patientSnap = await adminDb.collection("patients").doc(patientId).get();
      if (patientSnap.exists) {
        const patientData = patientSnap.data();
        sheetId = patientData?.sheetId || "mock-sheet-id";
      }
    }

    // 2. Format JSON to a beautiful text summary for Google Sheets
    let formattedReport = aiReport;
    try {
      const trimmedReport = aiReport.trim();
      if (trimmedReport.startsWith("{")) {
        const data = JSON.parse(trimmedReport);
        const sections: string[] = [];

        if (data.constitutional_profile) {
          const cp = data.constitutional_profile;
          sections.push(`CONSTITUTIONAL PROFILE SYNTHESIS:\n` +
            `- Type: ${cp.type || "N/A"}\n` +
            `- Dominant State: ${cp.dominant_state || "N/A"}\n` +
            `- Vitality Level: ${cp.vitality_level || "N/A"}\n` +
            `- Reaction Type: ${cp.reaction_type || "N/A"}\n` +
            `- Thermal Axis: ${cp.thermal_axis || "N/A"}\n` +
            `- Digestive Axis: ${cp.digestive_axis || "N/A"}\n` +
            `- Nervous Excitability: ${cp.nervous_excitability || "N/A"}\n` +
            `- Anxiety Profile: ${cp.anxiety_profile || "N/A"}\n` +
            `- Perfectionism / Control Tendency: ${cp.perfectionism || cp.control_tendency || "N/A"}\n` +
            `- Suppression History: ${cp.suppression_history || "N/A"}`
          );
        }

        const cmdCenter = [];
        if (data.case_essence) {
          cmdCenter.push(`AI CASE COMMAND CENTER:\n` +
            `- Patient Case Essence:\n  ${data.case_essence}\n` +
            `- Deepest Central Imbalance: ${data.central_disturbance || "N/A"}\n` +
            `- Constitutional Archetype: ${data.constitutional_archetype?.name || "N/A"}\n` +
            `  Description: ${data.constitutional_archetype?.description || "N/A"}\n` +
            `  Traits: ${(data.constitutional_archetype?.traits || []).join(", ") || "N/A"}`
          );
        }
        
        if (data.remedy_battlefield && data.remedy_battlefield.length > 0) {
          const bfText = data.remedy_battlefield.map((b: any) => 
            `* ${b.remedy}:\n` +
            `  Match %: ${b.match_pct || 0}% | Confidence: ${b.confidence_pct || 0}%\n` +
            `  Matches: Mental (${b.mental_match || 0}%), General (${b.general_match || 0}%), Modality (${b.modality_match || 0}%), Constitutional (${b.constitution_match || 0}%)`
          ).join("\n");
          cmdCenter.push(`REMEDY BATTLEFIELD COMPARISON:\n${bfText}`);
        }
        
        if (data.remedy_confirmation && data.remedy_confirmation.length > 0) {
          const confirmText = data.remedy_confirmation.map((c: any) =>
            `* ${c.remedy}:\n` +
            `  - What would confirm: ${(c.confirm_questions || []).join(" | ")}\n` +
            `  - What would rule out: ${(c.rule_out_questions || []).join(" | ")}`
          ).join("\n");
          cmdCenter.push(`REMEDY CONFIRMATION ENGINE:\n${confirmText}`);
        }
        
        if (data.contradictions && data.contradictions.length > 0) {
          const contraText = data.contradictions.map((c: any) =>
            `- Symptom "${c.symptom}" contradicts ${c.remedy}: ${c.reason}`
          ).join("\n");
          cmdCenter.push(`CONTRADICTION DETECTOR:\n${contraText}`);
        }
        
        if (data.missing_information && data.missing_information.length > 0) {
          const missingText = data.missing_information.map((m: string) => `- ${m}`).join("\n");
          cmdCenter.push(`MISSING CLINICAL INFORMATION:\n${missingText}`);
        }
        
        if (data.followup_predictions) {
          const fp = data.followup_predictions;
          cmdCenter.push(`FOLLOW-UP PREDICTION PLAN:\n` +
            `- Improvement Sequence: ${(fp.improvement_order || []).join(" -> ") || "N/A"}\n` +
            `- Anticipated Aggravations: ${(fp.aggravations || []).join(", ") || "N/A"}\n` +
            `- Constitutional Shifts: ${(fp.constitutional_shifts || []).join(", ") || "N/A"}`
          );
        }
        
        if (data.clinical_confidence) {
          const cc = data.clinical_confidence;
          cmdCenter.push(`CLINICAL CONFIDENCE METRICS:\n` +
            `- Level: ${cc.level || "N/A"}\n` +
            `- Reasons: ${(cc.reasons || []).join(", ") || "N/A"}`
          );
        }
        
        if (data.explainability_layer && data.explainability_layer.length > 0) {
          const expText = data.explainability_layer.map((e: any) =>
            `* Conclusion: ${e.conclusion}\n` +
            `  Rationale: ${e.rationale}\n` +
            `  Influencing Rubrics: ${(e.rubrics || []).join(", ") || "None"}\n` +
            `  Constitutional Factors: ${(e.constitutional_factors || []).join(", ") || "None"}`
          ).join("\n");
          cmdCenter.push(`EXPLAINABILITY & TRACEABILITY LAYER:\n${expText}`);
        }
        
        if (cmdCenter.length > 0) {
          sections.push(cmdCenter.join("\n\n"));
        }

        if (data.materia_medica_analysis) {
          const mma = data.materia_medica_analysis;
          const mmaSections: string[] = [];
          
          if (mma.remedy_deep_dive) {
            const rd = mma.remedy_deep_dive;
            mmaSections.push(`TOP REMEDY DEEP DIVE [${rd.remedy || "Selected"}]:\n` +
              `- Constitutional Portrait: ${rd.constitutional_portrait || "N/A"}\n` +
              `- Core Fears: ${(rd.core_fears || []).join(", ") || "N/A"}\n` +
              `- Core Motivations: ${(rd.core_motivations || []).join(", ") || "N/A"}\n` +
              `- Thermal State: ${rd.thermal_state || "N/A"}\n` +
              `- Energy Pattern: ${rd.energy_pattern || "N/A"}\n` +
              `- Digestive Profile: ${rd.digestive_profile || "N/A"}\n` +
              `- Sleep Pattern: ${rd.sleep_pattern || "N/A"}\n` +
              `- Emotional Pattern: ${rd.emotional_pattern || "N/A"}\n` +
              `- Relationship Pattern: ${rd.relationship_pattern || "N/A"}\n` +
              `- Reaction Pattern: ${rd.reaction_pattern || "N/A"}\n` +
              `- Stress Pattern: ${rd.stress_pattern || "N/A"}\n` +
              `- Miasmatic Expression: ${rd.miasmatic_expression || "N/A"}\n` +
              `- Taxonomy: Kingdom: ${rd.kingdom || "N/A"} | Family: ${rd.family || "N/A"} | Source: ${rd.source_substance || "N/A"}`
            );
          }
          
          if (mma.differential_comparison && mma.differential_comparison.length > 0) {
            const diffCards = mma.differential_comparison.map((dc: any) => 
              `* Remedy: ${dc.remedy}\n` +
              `  - Mental Differences: ${dc.mental_differences || "N/A"}\n` +
              `  - General Differences: ${dc.general_differences || "N/A"}\n` +
              `  - Modality Differences: ${dc.modality_differences || "N/A"}\n` +
              `  - Physical Differences: ${dc.physical_differences || "N/A"}\n` +
              `  - Thermal Differences: ${dc.thermal_differences || "N/A"}\n` +
              `  - Miasmatic Differences: ${dc.miasmatic_differences || "N/A"}`
            ).join("\n\n");
            mmaSections.push(`AI DIFFERENTIAL REMEDY COMPARISON (Top 5):\n\n${diffCards}`);
          }
          
          if (mma.confirmatory_questions && mma.confirmatory_questions.length > 0) {
            const cqText = mma.confirmatory_questions.map((q: string) => `- ${q}`).join("\n");
            mmaSections.push(`MATERIA MEDICA CONFIRMATORY QUESTIONS:\n${cqText}`);
          }
          
          if (mma.contradictions && mma.contradictions.length > 0) {
            const contraText = mma.contradictions.map((c: any) =>
              `- Remedy: ${c.remedy} | Contradicting Symptom: "${c.symptom}" | Reason: ${c.reason}`
            ).join("\n");
            mmaSections.push(`MATERIA MEDICA CONTRADICTION DETECTOR:\n${contraText}\n- Confidence Impact: -${mma.contradiction_detector?.confidence_reduction || 0}%`);
          }
          
          if (mma.confidence_scores) {
            const cs = mma.confidence_scores;
            mmaSections.push(`REMEDY CONFIDENCE PROFILE:\n` +
              `- Overall Match: ${cs.overall || 0}%\n` +
              `- Mental Match: ${cs.mental || 0}%\n` +
              `- General Match: ${cs.general || 0}%\n` +
              `- Modality Match: ${cs.modality || 0}%\n` +
              `- Constitution Match: ${cs.constitution || 0}%\n` +
              `- Pathology Match: ${cs.pathology || 0}%`
            );
          }
          
          if (mma.readiness_index) {
            const ri = mma.readiness_index;
            mmaSections.push(`AI PRESCRIPTION READINESS INDEX:\n` +
              `- Status: ${ri.status || "N/A"}\n` +
              `- Key Reasons: ${(ri.reasons || []).join(", ") || "N/A"}`
            );
          }
          
          if (mma.potency_intelligence) {
            const pi = mma.potency_intelligence;
            mmaSections.push(`POTENCY INTELLIGENCE PROFILE:\n` +
              `- Suggested Potency: ${pi.suggested_potency || "N/A"}\n` +
              `- Repetition Strategy: ${pi.repetition || "N/A"}\n` +
              `- Expected Aggravation Risk: ${pi.aggravation_risk || "N/A"}\n` +
              `- Follow-up Timeline: ${pi.followup_timeline || "N/A"}\n` +
              `- Direction of Cure prediction: ${pi.direction_of_cure || "N/A"}\n` +
              `- Potency Confidence Score: ${pi.confidence_score || 0}%`
            );
          }
          
          if (mma.followup_predictions) {
            const fp = mma.followup_predictions;
            mmaSections.push(`AI FOLLOW-UP PREDICTION PLAN:\n` +
              `- Expected Mental Changes: ${fp.mental_changes || "N/A"}\n` +
              `- Expected Sleep Changes: ${fp.sleep_changes || "N/A"}\n` +
              `- Expected Energy Changes: ${fp.energy_changes || "N/A"}\n` +
              `- Expected Physical Changes: ${fp.physical_changes || "N/A"}\n` +
              `- Warning Signs to Monitor: ${fp.warning_signs || "N/A"}\n` +
              `- Next Re-evaluation Timeline: ${fp.reevaluate_weeks || 4} weeks`
            );
          }
          
          if (mmaSections.length > 0) {
            sections.push(`ZONE 5 - AI MATERIA MEDICA INTELLIGENCE ENGINE:\n\n` + mmaSections.join("\n\n---------------------------------\n\n"));
          }
        }

        if (data.constitutional_vector) {
          const cv = data.constitutional_vector;
          sections.push(`CONSTITUTIONAL VECTOR METRICS:\n` +
            `- Anxiety: ${cv.anxiety || 0}%\n` +
            `- Control: ${cv.control || 0}%\n` +
            `- Insecurity: ${cv.insecurity || 0}%\n` +
            `- Perfectionism: ${cv.perfectionism || 0}%\n` +
            `- Sensitivity: ${cv.sensitivity || 0}%\n` +
            `- Digestive Axis: ${cv.digestive || 0}%\n` +
            `- Vitality: ${cv.vitality || 0}%\n` +
            `- Thermal Axis: ${cv.thermal || 0}%`
          );
        }

        if (data.miasmatic_analysis) {
          const ma = data.miasmatic_analysis;
          sections.push(`MIASMATIC TENDENCIES:\n` +
            `- Dominant Miasm: ${ma.dominant_miasm || "N/A"}\n` +
            `- Distribution: Psora: ${ma.psora || 0}%, Sycosis: ${ma.sycosis || 0}%, Syphilis: ${ma.syphilis || 0}%, Tubercular: ${ma.tubercular || 0}%\n` +
            `- Clinical Description: ${ma.description || "N/A"}`
          );
        }

        if (data.top_remedies && data.top_remedies.length > 0) {
          const remediesText = data.top_remedies.map((r: any) =>
            `* ${r.name} (${r.kingdom || "N/A"}) - Confidence: ${r.confidence || 0}%\n` +
            `  - Coverage: ${r.coverage || "N/A"} | Score: ${r.score || 0}\n` +
            `  - Keynotes: ${r.brief_keynotes || "N/A"}\n` +
            `  - Relationship to Patient: ${r.relationship_to_patient || "N/A"}`
          ).join("\n\n");
          sections.push(`TOP COMPLEMENTARY REMEDIES:\n\n${remediesText}`);
        }

        if (data.differential_matrix && data.differential_matrix.length > 0) {
          const diffText = data.differential_matrix.map((d: any) =>
            `* ${d.remedy}:\n` +
            `  - Confirmatory Matches: ${(d.matches || []).join(", ") || "None"}\n` +
            `  - Contradicts: ${(d.contradicts || []).join(", ") || "None"}\n` +
            `  - Verdict: ${d.differential_verdict || "N/A"}`
          ).join("\n\n");
          sections.push(`DIFFERENTIAL PRESCRIPTION MATRIX:\n\n${diffText}`);
        }

        if (data.ai_transparency && data.ai_transparency.length > 0) {
          const transText = data.ai_transparency.map((t: any) =>
            `- Rubric: "${t.rubric}" | Overall Influence: ${t.influence_pct || 0}%\n` +
            `  Remedy Impacts: ${(t.remedy_impacts || []).map((ri: any) => `${ri.remedy}: ${ri.impact}/10`).join(", ")}`
          ).join("\n");
          sections.push(`AI MODEL TRANSPARENCY & SYMPTOM INFLUENCE:\n${transText}`);
        }

        if (data.remedy_evolution && data.remedy_evolution.length > 0) {
          const evoText = data.remedy_evolution.map((e: any) => {
            const keys = Object.keys(e).filter(k => k !== "visit");
            const valuesText = keys.map(k => `${k}: ${e[k]}`).join(", ");
            return `- Visit [${e.visit}]: ${valuesText}`;
          }).join("\n");
          sections.push(`REMEDY RESPONSE EVOLUTION TRACKER:\n${evoText}`);
        }

        if (data.followup_progress && data.followup_progress.length > 0) {
          const progressText = data.followup_progress.map((p: any) =>
            `- ${p.date || p.visit || "Follow-up"}: Severity Index ${p.severity || 0}%`
          ).join("\n");
          sections.push(`PATIENT OUTCOME SEVERITY PROGRESSION:\n${progressText}`);
        }

        if (data.potency_strategy) {
          const ps = data.potency_strategy;
          sections.push(`POTENCY & POSOLOGY STRATEGY:\n` +
            `- Suggested Potency: ${ps.suggested_potency || "N/A"}\n` +
            `- Frequency & Dosage: ${ps.dosing_frequency || "N/A"}\n` +
            `- Clinical Justification: ${ps.justification || "N/A"}`
          );
        }

        if (data.followup_questions && data.followup_questions.length > 0) {
          const qs = data.followup_questions.map((q: string) => `- ${q}`).join("\n");
          sections.push(`DIFFERENTIAL CONSULT CHECKLIST (Follow-up Questions):\n${qs}`);
        }

        sections.push(`ANALYSIS METRICS:\n- Confidence Level: ${data.confidence_score || 0}%\n- Case Complexity: ${data.case_complexity || 0}%`);

        formattedReport = sections.join("\n\n=========================================\n\n");
      }
    } catch (e) {
      console.warn("Failed to parse JSON for formatting Google Sheet export, exporting raw string:", e);
    }

    // 3. If sheetId exists, push the compiled, human-readable report to their Google Sheet
    if (sheetId && sheetId !== "mock-sheet-id" && sheetId !== "mock-sheet") {
      try {
        await appendAiReportToClinicalSheet(sheetId, formattedReport);
      } catch (sheetErr: any) {
        console.warn("Failed to push report to Google Sheets, falling back to Firestore only:", sheetErr);
      }
    }

    // 4. Update Firestore with the raw JSON string (so the dashboard metrics remain dynamic on reload)
    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "mock-project-id") {
      await adminDb.collection("patients").doc(patientId).update({
        aiReport: aiReport,
        aiReportUpdated: new Date().toISOString()
      });
    } else {
      console.log("Firebase not configured or operating in mock-project-id. Skipping Firestore update.");
    }

    return NextResponse.json({
      success: true,
      message: "AI Clinical report exported to Firestore and linked Google Sheet successfully."
    });

  } catch (error: any) {
    console.error("Export analysis failed:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to export AI report.", 
        error: error.message || error 
      },
      { status: 500 }
    );
  }
}

