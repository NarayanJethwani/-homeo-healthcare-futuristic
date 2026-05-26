import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY not configured. Operating in mock mode.");
      return NextResponse.json({
        success: true,
        isMock: true,
        analysis: `### Clinical Repertorization Analysis (Mock Mode)

#### 1. Remedy Differential Diagnosis
* **Sulphur**: Indicated strongly by the high skin itching rubric. Highly warm patient with aggravation from heat.
* **Nux Vomica**: Matches gastrointestinal rubrics and irritability. Best suited for high-stress patients with sedentary habits.
* **Arsenicum Album**: Indicated for anxiety, restlessness, and chilly profile.

#### 2. Suggested Potency & Dosage Selection
* **Remedy**: Sulphur 30C or 200C depending on structural suppression.
* **Dosage**: Single dose or split dose, weekly or daily.
* **Justification**: Deep chronic skin conditions require starting with a moderate potency (30C) to avoid intense initial aggravations, then ascending to 200C once the barrier clears.

#### 3. Remedy Differentiation Questions
* Does the itching worsen with the warmth of the bed? (Points to Sulphur)
* Is the patient chilly, craving hot drinks, and restless at night? (Points to Arsenicum)`,
      });
    }

    const body = await request.json();
    const { patientInfo, rubrics, repertorizationResults } = body;

    const ai = new GoogleGenerativeAI(apiKey);
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `You are the AI Medical Brain, a master homeopathic clinical consultant modeled after world-class repertory engines like Radar Opus, combining Kent's Repertory classical methodologies with modern pathology.
Your goal is to evaluate the repertorization results, patient intake symptoms, and rubrics to generate a professional, highly detailed, structured clinical report for Dr. Narayan Jethwani.

Structure your response with:
1. **Case Synthesis**: A brief pathological/constitutional review of the patient's presentation.
2. **Remedy Differential Diagnosis**: Detailed comparative analysis of the top 3-4 remedies listed in the repertorization grid, describing WHY they match the rubrics and how they differ.
3. **Potency and Posology (Dosage) Recommendation**: Provide specific suggestions (e.g. 30C, 200C, 1M, LM potencies), how frequently to administer, and the rationale (avoiding homeo-aggravations for hyper-sensitive or skin cases).
4. **Differentiation Checklist**: 3-5 specific questions the doctor or junior doctor can ask the patient in their consult to finalize the prescription.
5. **Ancillary Advice**: Crucial homeopathic dietary and lifestyle restrictions (e.g. avoiding raw onions, coffee, strong camphor, mint, or timing doses).`;

    const userPrompt = `Patient Demographics & Case History:
- Name: ${patientInfo.name}
- Age / Gender: ${patientInfo.age} / ${patientInfo.gender}
- Chief Complaint: ${patientInfo.complaint}
- Care Level / Tier: ${patientInfo.careLevel}

Selected Symptom Rubrics (Kent's Repertory structure):
${rubrics.map((r: any) => `- [${r.chapter}] ${r.name} (Intensity Grade: ${r.grade})`).join("\n")}

Repertorization Scores (Remedies showing coverage and sum of grades):
${repertorizationResults.map((res: any) => `- ${res.remedyName} (${res.fullName}): Coverage = ${res.coverage}, Sum of Grades = ${res.score}`).join("\n")}

Please perform a deep, expert analysis and return your advice in clean Markdown format.`;

    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: systemPrompt + "\n\n" + userPrompt }] }
      ]
    });

    const responseText = await result.response.text();

    return NextResponse.json({
      success: true,
      analysis: responseText
    });

  } catch (error: any) {
    console.error("AI diagnostics failed:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to query the AI Medical Brain.", 
        error: error.message || error 
      },
      { status: 500 }
    );
  }
}
